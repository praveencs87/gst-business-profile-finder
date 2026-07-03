import { armKillSwitch, disarmKillSwitch } from './utils/timeoutManager.js';
import { Actor } from 'apify';
import { CheerioCrawler, log } from 'crawlee';

await Actor.init();

try {
    const input = await Actor.getInput();
    if (!input || !input.searchUrls || input.searchUrls.length === 0) {
        throw new Error('searchUrls input is required!');
    }

    const { searchUrls, maxProfiles = 1000 } = input;

    let totalProfilesExtracted = 0;

    const crawler = new CheerioCrawler({
        maxConcurrency: 10,
        maxRequestRetries: 3,
        
        async requestHandler({ request, $, log }) {
            const url = request.url;
            log.info(`Scraping Public GST Profile: ${url}`);
            
            // Check for bot block
            if ($('title').text().toLowerCase().includes('robot') || $('title').text().toLowerCase().includes('captcha')) {
                throw new Error('Blocked by security check. Retrying with new fingerprint...');
            }

            if (totalProfilesExtracted >= maxProfiles) return;

            // Generic Table Parser for GST Profile Aggregators
            const extractTableData = (keywords) => {
                let value = null;
                $('tr').each((i, el) => {
                    const rowText = $(el).text().toLowerCase();
                    for (const keyword of keywords) {
                        if (rowText.includes(keyword.toLowerCase())) {
                            // Find the corresponding td/th that isn't the label itself
                            const cells = $(el).find('td, th');
                            if (cells.length >= 2) {
                                value = $(cells[1]).text().trim();
                                break;
                            }
                        }
                    }
                    if (value) return false; // break loop
                });
                return value;
            };

            // Attempt to extract GSTIN from URL or page
            let gstin = null;
            const gstinMatch = url.match(/[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/);
            if (gstinMatch) {
                gstin = gstinMatch[0];
            } else {
                gstin = extractTableData(['gstin', 'gst number']) || null;
            }

            const legalName = extractTableData(['legal name']) || $('h1').text().trim() || null;
            const tradeName = extractTableData(['trade name']) || null;
            const businessType = extractTableData(['constitution of business', 'business type']) || null;
            const address = extractTableData(['principal place', 'address']) || null;
            const registrationDate = extractTableData(['date of registration', 'registration date']) || null;
            const status = extractTableData(['gst status', 'status']) || null;

            if (!legalName && !gstin) {
                log.warning(`Could not find valid business data on ${url}.`);
                return;
            }

            const output = {
                gstin,
                legalName,
                tradeName,
                businessType,
                address,
                registrationDate,
                status,
                profileUrl: url,
                scrapedAt: new Date().toISOString()
            };

            await Actor.pushData(output);
            
            totalProfilesExtracted++;
            
            // PPE Monetization - $1.00 per 1000 profiles
            await Actor.charge({ eventName: 'profile-extracted', count: 1 });
            log.info(`✅ Extracted profile for ${legalName || gstin}. Total so far: ${totalProfilesExtracted}`);
        },
        
        async failedRequestHandler({ request, log }) {
            log.error(`Failed to scrape ${request.url} after multiple retries.`);
        },
    });

    log.info(`Starting GST Business Public Profile Finder for ${searchUrls.length} start URLs...`);
    
    await crawler.addRequests(searchUrls);
    armKillSwitch(crawler);
    await crawler.run();
    disarmKillSwitch();

    log.info(`🎉 Finished! Extracted ${totalProfilesExtracted} business profiles.`);
} catch (error) {
    log.error('Actor failed:', error);
    throw error;
}

await Actor.exit();
