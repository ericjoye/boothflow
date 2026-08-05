# BoothFlow Buyer Drill
**Date:** 2026-07-03  
**Tester:** TESTER  
**Product:** BoothFlow v0.1

## Commands / Outputs
```bash
$ cd /home/ericjoye/businesses/boothflow
$ node tests/smoke.js

=== BoothFlow v0.1 — Smoke Tests ===

  PASS: Utils module loaded
  PASS: State module loaded
  PASS: Licensing module loaded
  PASS: UI module loaded
  PASS: App module loaded
  PASS: Default tier is free
  PASS: Can add client up to free limit
  PASS: Invalid license rejected
  PASS: License activation upgrades tier
  PASS: Clients CRUD
  PASS: Bookings CRUD
  PASS: Quotes + share tokens
  PASS: Gallery with follow-up flag
  PASS: Checklist item toggle persists
  PASS: Rebook prompt CRUD
  PASS: Public quote lookup works

=== Results ===
Passed: 37
Failed: 0
ALL TESTS PASSED (37/37)
```

```bash
$ grep -rE 'sk_live|sk_test|AKIA[0-9A-Z]{16}|api_key\s*=\s*["\'][^"\']{8,}["\']|password\s*=\s*["\'][^"\']{4,}["\']' .
# No matches
```

## Browser Verification
- Loaded via Chrome CDP: `file:///home/ericjoye/businesses/boothflow/index.html`
- Landing page renders with calculator and feature grid
- Upgrade screen shows plan cards and license activation form
- Invalid key rejected with exact message: `Invalid key. Try BOOTHFLOW-PRO-2026 or BOOTHFLOW-BUSINESS-2026`
- Valid Pro/Business keys activate tier and show license status
- Remove License returns to Free

## Verdict
PASS — pay-path exists, fulfillment unlocks features, and forgery is rejected.
