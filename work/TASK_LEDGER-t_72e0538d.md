# TASK LEDGER — t_72e0538d BoothFlow Stripe wiring & go-live

Status: RUNNING (3rd dispatch). 2026-08-05.
Agent: seller. Scope: wire Stripe + deploy landing + prep CWS.

## BREAKTHROUGH (this run)
The two prior blockers said "no code exists." WRONG — the complete source was in the
Obsidian vault all along:
  /mnt/c/Users/Jeirc/Desktop/obsidian-vault/Runtime/Hermes/businesses/boothflow/
The earlier vault `find` had a grouping bug (`-iname A -o -iname B` without parens) and
timeouts. Restored 23 files to /home/ericjoye/businesses/boothflow/ (verified: full tree).

## Product (verified from source)
- BoothFlow PWA: photo booth rental operator OS. Free / Pro $29/mo / Business $59/mo.
- js/licensing.js has PAYMENT_LINKS placeholders: {{STRIPE_PRO_LINK}}, {{STRIPE_BUSINESS_LINK}}
- QA was 37/37 PASS (TEST-REPORT.md), state.yaml PASS.
- This is a SaaS/PWA, NOT a digital download -> Stripe checkout is the correct money path.

## Gates honored
- Outreach FREEZE (2026-07-17): NO sends, NO directory submissions. CWS listing = directory
  submission -> PREPARE zip + listing, do NOT submit. Deploy own landing page = allowed.
- Stripe: TEST mode only. create_checkout refuses --live without STRIPE_WRITE_KEY.
- No fabricated URLs/sales. Everything verified by command output.

## Steps
1. [x] Restore source vault -> /home/ericjoye/businesses/boothflow/ (23 files)
2. [ ] Create Stripe TEST payment links: Pro $29/mo (2900), Business $59/mo (5900)
     VERIFY: python3 create_checkout.py boothflow -> ok:true artifact
     VERIFY: curl payment link -> HTTP 200 (TEST links return 200)
3. [ ] Wire real TEST links into js/licensing.js (replace both placeholders)
     VERIFY: grep -c '{{STRIPE' js/licensing.js == 0; node -c js/licensing.js
4. [ ] Verify: node syntax all js; run tests/smoke.js (node) if runnable
     VERIFY: node -c on all 5 js files; smoke exit 0
5. [ ] Build landing/index.html from launch/landing.md copy + real checkout links + app link
     VERIFY: landing has buy.stripe.com link; link to app/index.html present
6. [ ] Deploy landing (GitHub Pages via deploy_landing.py or Vercel)
     VERIFY: check_url.py <landing> ok:true; check_url --checkout ok:true
7. [ ] Prep CWS package: zip boothflow extension + store-listing.md; DO NOT SUBMIT (freeze)
     VERIFY: zip contains manifest.json; store-listing.md present
8. [ ] Update records: stripe.json, state.yaml, LAUNCH-REPORT, journal, knowledge note
9. [ ] kanban_complete with verified URLs + artifacts

## DONE CHECKS (executable)
- test -f ~/businesses/boothflow/js/licensing.js
- grep -q buy.stripe.com ~/businesses/boothflow/js/licensing.js  (real links wired)
- node -c ~/businesses/boothflow/js/licensing.js && for each js
- check_url.py landing ok:true (HTTP 200)
- check_url.py --checkout landing ok:true
- grep -q '{{STRIPE' licensing.js == fail (no placeholders left)
- CWS: zip exists + manifest.json inside; journal log draft_ready NOT submitted
