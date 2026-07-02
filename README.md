# GST Business Public Profile Finder

**Automatically extract verified business registration details (Legal Name, Address, Status) from public GST directory aggregators.**

B2B FinTech companies, accounting SaaS providers (like Zoho or Tally), and business marketers in India constantly need to verify the registration details of businesses or build lead lists of registered entities. 

This actor automates the extraction of publicly available business profiles from third-party GST directory aggregators.

## What can this Actor do?

- ✅ **Business Details** - Extracts the Legal Name, Trade Name, and Constitution of Business (e.g., Private Limited, Proprietorship).
- ✅ **Location Data** - Grabs the registered Principal Place of Business (Full Address).
- ✅ **Registration Metrics** - Extracts the Date of Registration and the current GST Status (Active, Suspended, Cancelled).
- ✅ **High Speed** - Bypasses aggregator bot protections using advanced TLS fingerprinting (`got-scraping`).

## Why use this Actor?

- 🎯 **B2B FinTechs** - Automate the gathering of public business verification data for KYC or lead enrichment.
- 🤝 **Accounting SaaS** - Identify newly registered businesses (via Registration Date) to pitch your accounting software.
- 📊 **Market Research** - Build massive, verified databases of active businesses in specific localities.

## How to use it

1. Go to a public GST profile aggregator (like `knowyourgst.com`).
2. Copy the URLs of the public profiles you want to scrape (e.g., `https://www.knowyourgst.com/gst-number-search/27AAAAA0000A1Z5`) and paste them into the **Public GST Directory URLs** field.
3. Set the **Max Profiles to Extract** limit (default is 1000).
4. Click Start!

## How much does it cost?

Because business verification data is a highly sought-after B2B commodity, this actor uses a **Pay-Per-Event (PPE)** pricing model. You only pay for the exact number of profiles successfully extracted!
- **$1.00 per 1,000 public GST profiles extracted.**

## Output Example

When a business profile is extracted, the actor pushes this data to your dataset:

```json
{
  "gstin": "27AAAAA0000A1Z5",
  "legalName": "ACME TECHNOLOGIES PRIVATE LIMITED",
  "tradeName": "ACME TECH",
  "businessType": "Private Limited Company",
  "address": "123 Tech Park, Andheri East, Mumbai, Maharashtra, 400069",
  "registrationDate": "01/07/2017",
  "status": "Active",
  "profileUrl": "https://www.knowyourgst.com/gst-number-search/27AAAAA0000A1Z5",
  "scrapedAt": "2023-10-25T15:00:00.000Z"
}
```
