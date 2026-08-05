---
title: BoothFlow — Offer
slug: boothflow
agent: seller
created: 2026-07-03
type: context
tags: [offer, pricing, boothflow]
---

# BoothFlow — Offer

## The Promise
Turn a photo booth lead into a delivered gallery with one repeatable workflow — quote, booking, event day, gallery delivery, and rebooking — without ten disconnected tools.

## The Mechanism
A zero-install progressive web app that opens in any browser. Runs locally with offline caching and stores data in the browser until the operator chooses to share it.

## What the Buyer Gets (fulfillment state: PROVISIONAL)
- Free tier: limited clients, basic booking, simple gallery, manual quotes
- Pro tier unlock: instant quote builder with add-ons, branded gallery with follow-up flow, event checklist, print-order prompt path
- Business tier unlock: multi-operator workflows, rebooking reminders, more records and history

License unlock: licensing.js enforces tier gates by action boundary. Buyer who enters a valid key gets the tier features for real.

## Monetization Model: Freemium to Subscription
Why: operators use these workflows every booking month, so recurring value maps to recurring price. $29/mo is below one event hour for most solo operators and undercuts generic event/CRM tools while adding booth-specific flow.

## Price Points
- Pro: $29/month or $19/month billed annually
- Business: $59/month or $39/month billed annually

## Competitive Landscape
| Competitor | Price | Why operator leaves |
|---|---|---|
| Generic event/CRM tools | $40–99/mo | Too broad, no booth-specific quote/add-on flow |
| Photography CRMs | Varies | Wedding-photo-centric, ignores booth packaging |
| Spreadsheets/notes | $0 | Quote speed and rebooking fatigue grow fast |

## Honest Scope (Known Gaps)
- Gallery storage is URL-based, not real file upload.
- Calendar sync, billing, and client-side notifications are placeholders or manual.
- No backend sync or auth; localStorage only.
- Stripe checkout link needs real/live wiring before use.

## Fulfillment State: PROVISIONAL
License key activation is implemented and works in verified QA. Revenue path is scaffolded but not yet live until Stripe pricing links are wired.
