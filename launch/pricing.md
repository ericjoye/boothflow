# BoothFlow Pricing Plan

Monetization model: freemium to subscription.

Tiers:
- Free: 3 clients per month, basic booking, simple gallery, manual quotes
- Pro: $29/month or $19/month billed annually — unlimited clients, instant quote builder with add-ons, branded gallery with print-order prompts, automated follow-ups, event-day checklist
- Business: $59/month or $39/month billed annually — multi-operator setup, more booths/client history, rebooking engine

Current fulfillment state:
- License-gated features are implemented and verified.
- Stripe TEST payment links are wired into `js/licensing.js` (Pro $29/mo + Business $59/mo) and verified HTTP 200.
- LIVE payment flow is NOT yet wired — requires Eric's STRIPE_WRITE_KEY (live sk_/rk_) then `create_checkout.py boothflow --live` + re-wire.

Human action required (Eric-gated):
- Live flip: set STRIPE_WRITE_KEY in ~/.hermes/secrets/stripe.env, re-run create_checkout.py --live to mint LIVE payment links, re-wire js/licensing.js.
- License-key delivery after live checkout is manual today (email key); webhook automation would be builder work.
- Legal pages (TERMS/PRIVACY/REFUND) before paid launch.
