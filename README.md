# BoothFlow — Photo Booth Operator OS

BoothFlow is a zero-dependency PWA for photo booth rental operators. It provides an instant quote calculator, booking CRM, gallery delivery with shareable links, event checklists, and a rebooking engine.

## Requirements

- A modern web browser with PWA/service worker support
- Node.js is only needed for smoke tests

## Quick Start

1. Open `index.html` in a browser.
   - Example: `python3 -m http.server 8080` from this directory, then visit `http://localhost:8080`.

2. Use the landing page quote calculator immediately without signing up.

3. Open the app from the bottom navigation to create clients, bookings, quotes, galleries, checklists, and rebooking prompts.

## Demo License Keys

- `BOOTHFLOW-PRO-2026`
- `BOOTHFLOW-BUSINESS-2026`

Enter a key in **Upgrade > Activate License Key** to change tiers. Remove it in the same screen to return to Free.

## Stripe Test Mode

- Replace Stripe placeholders in `js/licensing.js` with real test links.
- In test mode, Stripe Checkout can remain external; the app still keeps all data in `localStorage`.

## Data

- v0.1 stores data in browser `localStorage` only.
- Use **Settings > Reset All Data** to clear state and license.

## Smoke Tests

Run from this directory:

```bash
node tests/smoke.js
```

## Project Structure

- `index.html` — app shell
- `manifest.json` — PWA manifest
- `sw.js` — service worker cache shell
- `css/styles.css` — mobile-first styles
- `js/utils.js` — shared helpers
- `js/state.js` — localStorage persistence and CRUD
- `js/licensing.js` — freemium tier gating
- `js/ui.js` — view renderers
- `js/app.js` — controllers, routing, and flows
- `tests/smoke.js` — Node-based smoke tests

## Known Limits

- No real file uploads; galleries accept photo URLs.
- No backend sync or auth.
- No invoice/Square/Venmo payment processing.
