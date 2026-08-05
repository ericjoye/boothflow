# BoothFlow Pricing Plan

Monetization model: freemium to subscription.

Tiers:
- Free: 3 clients per month, basic booking, simple gallery, manual quotes
- Pro: $29/month or $19/month billed annually — unlimited clients, instant quote builder with add-ons, branded gallery with print-order prompts, automated follow-ups, event-day checklist
- Business: $59/month or $39/month billed annually — multi-operator setup, more booths/client history, rebooking engine

Current fulfillment state:
- License-gated features are implemented and verified.
- Stripe checkout links are placeholders; live payment flow is not yet wired.

Human action required:
- Replace Stripe placeholders in `js/licensing.js` with real Payment Link URLs.
- After wiring, confirm checkout opens correctly and rerun smoke tests.
