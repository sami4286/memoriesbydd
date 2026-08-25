# Copy Decks — for proofreading

One document per page. **These are the source of truth for wording.** The HTML prototypes in
`_deploy/` and the eventual Webflow build both follow these; if a document and a page disagree, the
document is right and the page needs fixing.

Structure comes from [`../_strategy/12-SITEMAP-V2.md`](../_strategy/12-SITEMAP-V2.md), which is
governed by the client brief.

---

## How to read these

| Marker | Meaning |
|---|---|
| **H1 / H2 / H3** | Heading, at that level. Only ever one H1 per page |
| **Body** | Paragraph copy |
| **CTA** | Button or link label. The arrow shows where it goes |
| **Label** | The small serif line above a heading (`Our Story`, `Packages`) |
| ⛔ | **Blocked** — needs an answer from Ashley before it can be finalised |
| ⚠️ | **Written, but flagged** — a decision was made that he should confirm |
| `[PLACEHOLDER]` | Not real copy. Must not go live |

Script words (the `Italianno` word in each heading) are marked *italic* — one per heading, per
`../_design/DESIGN-NOTES.md`.

## House style

- **British English.** *Programme* not program, *colour* not color, *personalised* not personalized.
- **Warm, calm, never clinical.** The brief's own words. No sales language, no exclamation marks.
- **Say "your loved one", not "the deceased".** Never "the body", "the product", "the deceased".
- **Second person.** *You send the photos, we do the rest.* Not *customers send photos*.
- **Plain numbers.** "24–48 hours", "£122 for 50", "12 photos" — not "fast", "affordable", "plenty".
- **En dashes** for ranges (24–48), em dashes for asides (—). Non-breaking `&pound;` before prices.
- **No fabricated anything.** No invented reviews, no guessed opening hours, no invented turnaround.

## Status

| # | Page | Doc | Copy status |
|---|---|---|---|
| 1 | Home | [01-home.md](01-home.md) | ✅ Written · built · ⚠️ 3 flags |
| 2 | Order Now | [02-order-now.md](02-order-now.md) | ✅ Written · built · ⚠️ 2 flags |
| 3 | How It Works | [03-how-it-works.md](03-how-it-works.md) | ✅ Written · not yet built |
| 4 | Hymns & Resources | — | Next. Unblocked — restructures ~45,000 existing words |
| 5 | Our Products | — | ⛔ premium wire-bound specs and pricing |
| 6 | Gallery / Catalogue | — | ⛔ positioning (is the filter heritage-led or colour-led?) |
| 7 | Price List | — | ⛔ fixed prices or "from" anchors above a quote |
| 8 | Design items ×40 | — | ⛔ positioning (which tier each design gets) |
| 9 | Tributes | — | ⛔ confirm Sharon's full name · needs real tributes |
| 10 | Blog | — | Outlines writable now; articles follow |
| 11 | Reception Halls | — | ⛔ venue seed data |
| 12 | Partners | — | ⛔ trade terms |
| 13 | Contact Us | — | ⛔ opening hours |
| 14 | Privacy Policy | — | Legal review, not copywriting |

## The three things blocking the most pages

1. **Turnaround** — directed as 24–48 hours, still unreconciled with the brief's 5 working days.
   Written throughout as the *design and proof* time, never as delivery. Needs written sign-off.
   See [`../_strategy/11-BRIEF-RECONCILIATION.md`](../_strategy/11-BRIEF-RECONCILIATION.md) C2.
2. **Pricing model** — the homepage shows £310/£515/£898 as fixed, all-in. The brief describes a
   calculated quote. These cannot both be true on the same site.
3. **Positioning** — lead with Caribbean & African, or stay general UK? Outstanding since
   `05-CLIENT-ACTIONS.md` item 8. It changes the Gallery, all 40 design items, and homepage emphasis.
