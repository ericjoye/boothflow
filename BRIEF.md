# BoothFlow — The Operating System for Photo Booth Rental Businesses

**This is the "Shopify for photo booth operators" — a freemium PWA that turns scattered bookings, quotes, and gallery deliveries into one repeatable, upsell-optimized workflow.**

---

## Paying Customer

**Named buyer**: Independent photo booth rental operator running 1–3 booths, typically a solo founder or 2-person team renting out enclosed booths, 360 booths, or open-air “selfie station” setups at weddings, corporate events, birthdays, and bar mitzvahs.

**What they feel**: Every quote, booking, add-on sale, and gallery link is currently tracked in a mess of Google Calendar, spreadsheets, text threads, Venmo requests, and Instagram DMs. They lose money on unpurchased add-ons (prints, framed photos, video clips), lose leads because quotes take hours to assemble, and waste Friday nights manually sending galleries to 200 wedding guests.

**What they already use**: Google Calendar, Square or Venmo for payments, Dropbox/Google Drive for galleries, Instagram for marketing, text/WhatsApp for client comms, and a paper checklist for event-day logistics.

**What would make them NOT buy**: A generic photographer CRM (too wedding-photo-centric, misses booth-specific add-ons and quote speed), an enterprise event platform (too expensive, too complex for a solo operator), or a tool that doesn’t include instant quote generation — because quotes at events need to be assembled in 60 seconds while the client is standing in front of you.

---

## Problem

Photo booth operators sell an experience, but their back office is chaos:

1. **Slow quote generation** — pricing depends on hours, booth type, add-ons, travel fees, and event date. Most operators type these up in Google Docs or Notes, taking 30–90 minutes per lead. While they’re typing, the client is contacting the next booth.
2. **Uncaptured add-on revenue** — prints, framed photos, video clips, guest book compilations, custom backdrops, and attendant services are routinely forgotten in quotes or awkwardly reintroduced later. Industry data shows add-ons can add 20–40% to average order value, yet most operators capture none of it.
3. **Gallery delivery friction** — after an event, operators upload photos to a folder, copy a link, text it to the client, and then manually answer “can you send me the link?” for the next week. No branded gallery, no upsell prompt for prints, no automated follow-up.
4. **No repeat-booking engine** — wedding clients often rebook for 1-year anniversaries, baby showers, or corporate holiday parties. Most operators have no system to trigger “it’s been 11 months — shall we talk rebooking?”
5. **Event-day ops checklist** — operators arrive at venues without power adaptors, backdrop stands, or extra tape. There’s no pre-event checklist tied to the booking.

---

## Solution

**BoothFlow** is a mobile-first PWA purpose-built for photo booth rental operators:

- **Instant quote builder**: Pre-built templates for wedding, corporate, birthday, and bar mitzvah packages. Add-ons priced with one tap. Generate a branded quote link in under 60 seconds that the client can approve online.
- **Client & booking CRM**: Track lead status, event date, booth type, venue, client contact, and contract in one view. Calendar sync placeholder.
- **Gallery hub**: Upload event photos to a branded client gallery with optional print-order upsell. Auto-generate a shortlink to text/email to the client. Post-event follow-up sequence embedded in the gallery view.
- **Add-on catalog & upsell prompts**: Pre-configured add-ons (prints, frames, video, attendant, custom backdrop) with pricing. Auto-suggested at quote time and again when the gallery is delivered.
- **Event-day checklist**: Per-booking checklist tied to the event type. Operators can check items off on their phone at the venue.
- **Rebooking reminders**: Automated “it’s been 11 months since your wedding — time to talk anniversary photos?” prompt based on original event date.

---

## Monetization

**Model**: Freemium → Subscription  
**Price points**:
- **Free**: 3 clients/mo, basic booking, simple gallery, manual quotes
- **Pro**: $29/mo (annual $19/mo) — unlimited clients, instant quote builder with add-ons, branded gallery with print upsells, automated follow-ups, event-day checklist
- **Business**: $59/mo (annual $39/mo) — everything in Pro, multi-operator/team scheduling, multiple booth packages, client CRM history, rebooking engine

**Why this model**:
- Recurring operational value: booking, galleries, and follow-ups happen every single month.
- $29/mo is less than one hour of photo booth rental revenue ($150–500/event, 2–6 events/mo for solo operators).
- Undercuts generic event/CRM tools starting at $40–99/mo while offering deeper booth-specific functionality.
- Free tier hooks operators during their first 3 bookings — by then they’ve experienced the quote speed and gallery value.

---

## First Dollar Path

1. **Week 1**: Build a landing page with a free “Instant Photo Booth Quote Calculator” embedded widget. No signup required — just pick package, add-ons, get a branded estimate. Capture email at the bottom.
2. **Week 2–3**: Post the calculator link in Instagram/TikTok photo booth communities, local wedding vendor Facebook groups, and r/photobooth. Drive traffic with a “how to price a photo booth wedding package” blog/YouTube script.
3. **Week 4**: Offer the full PWA to calculator users for free during beta. Convert to Pro ($29/mo) after 3 bookings inside the app. Upsell to Business ($59/mo) once they add a second operator.
4. **Channel**: Organic social + vendor community seeding. No cold outreach needed; operators congregate in visible Instagram/FB groups and actively search for “photo booth pricing” and “photo booth management software.”

**Path to first dollar**: 50 calculator users → 20 free signups → 5 beta users doing 3+ bookings → 2 convert to paid at $29 = **$58/mo MRR by end of month 1**.

---

## MVP Scope

**Must have for v0.1**:
- Landing page with embedded instant quote calculator (lead capture)
- Free-tier PWA: client list, basic booking form, simple gallery upload + shareable link
- Pro-tier paywall: quote builder with add-ons, branded gallery, event checklist, automated follow-up prompt
- Stripe integration for $29/$59 monthly + annual plans
- Mobile-first responsive design

**Explicitly out of scope for v0.1**:
- Real payment processing for client invoices/contracts (use existing Square/Venmo)
- Hardware/camera integration with booth machines
- Multi-tenant team features beyond simple operator count
- Native mobile apps (PWA sufficient)

---

## Quality Bar

A venue owner or operator should be able to:
1. Build a branded quote in under 60 seconds from their phone at a tasting/consultation.
2. Convert that quote to a booking in one click.
3. Upload event photos to a branded gallery the morning after the event.
4. Text the gallery link to the client with one tap.
5. See a print-order upsell prompt inside the gallery that the client can complete without calling.

**Pass condition**: 3 paying beta users within 30 days of launch, each doing ≥2 events/month in BoothFlow.

---

## Tech Approach

- Zero-dep SPA/PWA: single HTML/CSS/JS app with hash routing
- localStorage for data persistence in v0.1; no backend required
- Stripe Checkout for subscriptions (monthly/annual)
- Shareable quote links via URL hash state
- Gallery as password-protected or tokenized route
- Deploy to any static host; offline-capable for event-day use

---

## Risks

1. **Market fragmentation**: Photo booth operators vary widely (enclosed booths, 360 booths, open-air selfie stations). Must support multiple “booth types” without overcomplicating.
2. **Seasonality**: Wedding/event industry peaks May–October. Revenue may look lumpy if MRR is tracked naively; annual prepay helps smooth this.
3. **Competitor emergence**: Generalist event tools (HoneyBook, Dubsado) could add photo-booth-specific templates. Differentiation must stay purpose-built depth vs. breadth.
4. **Gallery hosting cost**: Unlimited photo storage at scale becomes expensive. Start with client-uploaded external links or low-cost object storage; don’t promise unlimited storage in free tier.

---

## Definition of Done

- [ ] `BRIEF.md` and `state.yaml` written
- [ ] `context/avatar.md` with named buyer profile and 🟢/🟡/🔴 tags
- [ ] `context/language-bank.md` seeded with real buyer quotes from photo booth communities
- [ ] BRIEF passes Iron Rule check: specific paying customer, price point, first-dollar path, monetization rationale
- [ ] Vertical confirmed different from all existing `~/businesses/` products
- [ ] Ready for BUILDER handoff
