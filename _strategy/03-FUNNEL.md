# Funnel & Form Placement

## The current funnel, traced end to end

```
Referral (word of mouth / funeral director / Instagram)
   │
   ▼
Homepage  ──►  wall of 41 thumbnails, no H1, no promise, no phone link
   │
   ▼
Design page  ──►  only CTA: "VIEW OUR PRICES AND CALL US TO PLACE YOUR ORDER"
   │
   ▼
/price-list/  ──►  ✖  DEAD END
                     no button · no form · no phone link · no email link
```

Meanwhile the order form sits on the homepage only, in an unlabelled 500px box, and there is **not a
single `tel:` or WhatsApp link on any page of the site**.

So the most likely journey is: a referred customer arrives, browses designs, is told to call, reaches
a price grid, finds no number to tap — and leaves. Anyone who does convert is almost certainly
phoning a number they got verbally from the referrer. **The website is not participating in the
sale.**

---

## The principle: three doors, everywhere

Families arranging a funeral are working to a hard deadline, usually within 48 hours, often in the
evening, frequently on a phone. They will not fill in a long form on a first visit — most want to
speak to a human. So every page must offer three parallel routes, and let the user pick:

| Door | Link | For |
|---|---|---|
| **Form** | `/order/` | Considered, detail-heavy, out-of-hours |
| **Call** | `tel:08000236263` | Urgent, wants reassurance from a person |
| **WhatsApp** | `wa.me/447552916060` | Already how he receives photos and sends proofs |

WhatsApp deserves first-class treatment, not a hidden plugin. The FAQ already tells customers to send
photos to `07552916060`, and proofs go out by WhatsApp. It is the real channel — the site should
reflect that.

---

## Placement map

| Location | Conversion action |
|---|---|
| **Header** (sticky, all pages) | `Start Your Booklet` button + tap-to-call number |
| **Mobile sticky footer bar** | `Call` · `WhatsApp` · `Start` — always on screen |
| Homepage | CTA after hero, after How-It-Works, after Packages, and in the final block |
| **Every design page** | **Primary: `Start with this design` → `/order/?design={slug}`** plus call + WhatsApp |
| Catalogue + 4 category pages | CTA block after the grid |
| **`/prices/`** | CTA inside **every** package tier (currently zero CTAs on this page) |
| `/how-it-works/` | CTA at the end |
| `/motion-obituary/`, `/banners-and-bookmarkers/` | CTA + "add this to your booklet order" |
| `/help/*` articles | Soft contextual CTA — *"We can set these hymns into your booklet for you."* |
| `/about/`, `/reviews/` | CTA at the end |
| `/funeral-directors/` | Separate trade enquiry route + dedicated number |
| **Footer** (all pages) | Full contact block: `tel:`, `mailto:`, WhatsApp, address |

### The single highest-impact change
**`Start with this design` on all 40 design pages, deep-linking to `/order/?design={slug}` with the
design pre-selected.**

Today the design page — the moment of highest intent, where someone has just fallen in love with a
booklet — pushes the user *away* to a price grid. Instead it should capture that intent immediately,
carrying the chosen design into the brief so the customer never has to re-explain what they want.

---

## Referral-specific mechanics

This is a referral business first. The funnel should be built for someone arriving with a name and a
recommendation, not a search query.

### 1. A shareable order URL
`/order/` is short enough to say out loud, text, or print on a card. This alone changes the
referral loop — Ashley can send one link instead of explaining where to look.

### 2. Keep and extend the per-partner freephone numbers
He already runs a primitive attribution system:

| Partner | Freephone |
|---|---|
| Al-tayo's Funeral Services | 0800 023 5991 |
| Joel Grant (Willesden New Testament Church of God) | 0800 023 5448 |
| Calo's Funeral Directors | 0800 023 5797 |
| Main line | 0800 023 6263 |

Keep these. Pair each with a **landing URL** (e.g. `/order/?ref=altayos`) so referral source is
attributable in GA4 for web enquiries too, not just calls. Give each partner a short URL for their
referral packs and a printed card with a QR code to it.

### 3. Referral packs for funeral directors
`/funeral-directors/` should offer a downloadable/postable pack: sample booklets, their dedicated
number, their referral URL, trade pricing. This is the growth engine — three partners today, and the
page currently does no selling at all.

---

## Form UX specification

**Build in Phase 2 — specified here so the site can be built around it.**

Current state: one Fillout form (`35E7XCNpsmus`), title "Memories Order Form", embedded in a fixed
500px frame with `dynamic-resize` enabled but a hard `height:500px` wrapper fighting it.

Requirements for the rebuild:

1. **Capture the lead before the upload.** Step 1 = name, phone, service date only. Uploading photos
   is the highest-friction step; if it comes first, partial leads are lost entirely. A name and a
   date is enough for Ashley to call back.
2. **Pre-select the design** from `?design={slug}` so the referring page's context carries through.
3. **WhatsApp as an explicit alternative** at the upload step: *"Prefer to send photos on WhatsApp?
   Tap here — we'll match them to your order."*
4. **Save and return.** Families gather photos from multiple relatives over days.
5. **Set expectations honestly** on the confirmation screen: what happens next, when they will see a
   proof, and how to reach a human now. Then follow with an email/WhatsApp confirmation.
6. **Ask only what the design needs** — photo allowance already varies per design (12 gallery photos,
   22, 23…) and that data is in `_archive/data/designs.json`. Use it to tell the customer exactly how
   many photos to send.
7. **Mobile-first, no fixed-height iframe.** Let it resize.

---

## Tracking

Currently GA4 `G-LXY7DY8737` is installed with **no conversion events configured** and no Google Ads
tag. Nothing about the funnel is measurable today.

Configure GA4 events:

| Event | Trigger |
|---|---|
| `call_click` | any `tel:` tap |
| `whatsapp_click` | any `wa.me` tap |
| `form_start` | first field interaction on `/order/` |
| `form_submit` | completed submission |
| `design_view` | design page view (with `design` slug parameter) |
| `price_view` | `/prices/` view |
| `referral_landing` | any URL with `?ref=` |

Mark `call_click`, `whatsapp_click` and `form_submit` as **key events / conversions**. Add a Google
Ads conversion tag now, even before spending, so paid search is switchable later.

Then the actual question — *which designs and which referral sources produce orders* — becomes
answerable for the first time.
