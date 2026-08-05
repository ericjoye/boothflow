---
title: BoothFlow Launch Report — GO-LIVE (2026-08-05)
slug: boothflow
agent: seller
created: 2026-08-05
type: launch
tags: [launch, seller, boothflow, go-live]
---

# BoothFlow Launch Report — UPDATE (t_72e0538d)

## What happened
Task t_72e0538d (Stripe wiring & go-live) was previously BLOCKED twice because
"no code exists." This run DISPROVED that: the complete source was recovered from
the Obsidian vault at
`/mnt/c/Users/Jeirc/Desktop/obsidian-vault/Runtime/Hermes/businesses/boothflow/`
(23 files, full PWA: index.html, js/, css/, icons/, manifest.json, sw.js, tests, launch assets)
and restored to `/home/ericjoye/businesses/boothflow/`.

## What is now LIVE
- Landing page: https://ericjoye.github.io/boothflow/ (HTTP 200, checkout verified)
- App (PWA): https://ericjoye.github.io/boothflow/app/ (HTTP 200, manifest 200)
- GitHub repo: https://github.com/ericjoye/boothflow (public)
- Stripe TEST payment links wired into js/licensing.js:
  - Pro $29/mo: https://buy.stripe.com/test_fZubJ28z6cVj45w49WbAs0o (HTTP 200)
  - Business $59/mo: https://buy.stripe.com/test_9B6aEYaHedZnfOefSEbAs0p (HTTP 200)
- Smoke tests: 37/37 PASS (node tests/smoke.js), js syntax OK all 5 files

## Asset Checklist
- [x] Landing page copy -> built landing/index.html from launch/landing.md
- [x] Store listing -> launch/store-listing.md (prepared; CWS submission gated)
- [x] Pricing plan -> launch/pricing.md (Free/Pro $29/Business $59)
- [x] Context Pack (avatar/language-bank/offer)
- [x] Stripe payment links TEST wired (Pro + Business)
- [ ] Stripe payment links LIVE (needs Eric STRIPE_WRITE_KEY)
- [ ] LICENSE/PRIVACY/TERMS/REFUND pages (not generated; low risk for local-first PWA but should add before paid launch)
- [ ] CWS submission (freeze-gated; also product is PWA not MV3 extension)

## Remaining Human Actions for Eric
1. Live Stripe flip: set STRIPE_WRITE_KEY (live sk_/rk_) in ~/.hermes/secrets/stripe.env,
   then re-run create_checkout.py --live to mint LIVE payment links and re-wire licensing.js.
2. License-key fulfillment: after a real checkout, a license key must be delivered
   (manual email today; Stripe webhook automation would be builder work).
3. Outreach freeze: if/when lifted, CWS + directory submissions can proceed.
4. Legal pages for paid launch.

## Risks / Blockers
- Stripe is TEST mode only — no real revenue until Eric's live key is set.
- License keys are demo/static (BOOTHFLOW-PRO-2026 etc.); a purchased key delivery path
  is manual.
- Product is a PWA, not a Chrome MV3 extension — CWS listing needs builder conversion
  if Eric wants an extension listing.
