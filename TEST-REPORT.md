# BoothFlow QA — Test Report
**Product:** BoothFlow PWA MVP  
**Tester:** TESTER (Hermes)  
**Date:** 2026-07-03  
**Task:** t_4646748b  
**Slug:** boothflow  

---

## Environment
- OS: WSL (Windows Subsystem for Linux)
- Browser: Chrome via CDP MCP
- Node: 3.11.15
- Test server: `python3 -m http.server 19090` from `/home/ericjoye/businesses/boothflow`

---

## Feature QA
| Feature | Test | Result |
|---|---|---|
| Landing page | Load `index.html` via HTTP | Renders hero, calculator, feature grid |
| Instant quote calculator | Select package/extra hours/add-ons | Total recalculates |
| Public quote route | Open `#public-quote/<token>` | Renders quote lines + Convert to Booking |
| Client CRM | Add/view/delete client | Persists in `localStorage` |
| Booking CRM | Add booking with calculator | Balance = total - deposit |
| Quote builder | Save quote with add-ons | Token generated; share link copied |
| Gallery hub | Create gallery with photo URL | Gallery row appears with count |
| Follow-up | Send Follow-Up from gallery detail | `followUpSent` flips true |
| Event checklist | Add checklist + toggle item | Count updates; item `done` persists |
| Rebooking engine | Add prompt + update status | Prompt list updates |
| PWA manifest | Load `/manifest.json` | Returns JSON with name/display/icons |
| Service worker | Load `/sw.js` | Cache shell + offline fallback present |
| Upgrade page | Open `#upgrade` | Plans, license form, activate/remove buttons |

---

## Paywall Verification
- Invalid key `FAKE-KEY` → rejected
- Valid key `BOOTHFLOW-PRO-2026` → tier upgrades to Pro
- Valid key `BOOTHFLOW-BUSINESS-2026` → tier upgrades to Business
- Free limit blocks 4th client
- Quote builder blocked on Free with upgrade toast
- Checklist blocked on Free with upgrade toast

---

## Edge Cases
- Empty required fields → toast error, no save
- Missing public quote token → "Quote not found" rendered
- Special chars in names → escaped via `BFUI.esc`
- License removal → state/seed data remains intact

---

## Final Verdict
**PASS**

Every feature in the `Definition of done` works as described. The license gate enforces limits, valid keys unlock paid features, invalid keys are rejected, and the product is sellable as a v0.1 PWA MVP.
