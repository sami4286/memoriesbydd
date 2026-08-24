# Homepage Content Strategy

## The problem with the current homepage

Section order today:

| # | Section | Problem |
|---|---|---|
| 1 | Slider | No headline, no promise, no CTA |
| 2 | **All 41 designs** | A wall of thumbnails under H4s reading "VIEW ROSE PETALS" |
| 3 | "View our range" + VIEW ALL | Repeats section 2 |
| 4 | **Unlabelled 500px box** | This is the order form. Nothing says so. |
| 5 | "View our great package deals" + PRICE LIST | — |
| 6 | (empty) | — |
| 7 | "Great customer service is what we stand for!" | Claim with no evidence |
| 8 | "We offer a wide range…" | Repeats section 3 |
| 9 | "Take a look at our tributes" | — |

**No `<h1>`. No value proposition. No turnaround promise. No trust signals. No prices. No phone
number. No explanation of how the service works. 916 KB of HTML.** The most important thing on the
page — the order form — is an unlabelled grey box.

---

## Replacement structure

A grieving user needs four questions answered before they will act:
*Can they help me? · How fast? · What will it cost? · What happens if I get in touch?*
The current page answers none. This one answers all four above the third scroll.

---

### 1. Hero
**One `<h1>`**, carrying the primary keyword and the niche:

> # Funeral Order of Service Booklets, Designed by Hand in 24–48 Hours
> Beautiful, personal booklets for UK families — including our Caribbean, African and
> football heritage ranges. You send the photos and details; we do the rest.

- **Primary CTA:** `Start Your Booklet` → `/order/`
- **Secondary CTA:** `Call 0800 023 6263` — a real `tel:` link
- Background: one strong lifestyle/product image, not a slider

**Trust strip immediately beneath:**
`24–48 hour design` · `Free proof before we print` · `Next-day UK delivery` ·
`WhatsApp your photos` · `Same-day local delivery`

Every one of these is already true and already stated somewhere on the current site — they are just
never surfaced where they matter.

### 2. Reassurance
One short paragraph, grief-appropriate, not sales copy. Acknowledges the moment and lowers the cost
of the next click. Adapted from the existing About page line:

> Arranging a funeral is hard, and it usually happens fast. We will guide you through it, work to
> your timescale, and show you the design before anything is printed.

### 3. How it works — 4 steps
This is the highest-value new section on the page. It removes the biggest source of hesitation:
*what actually happens if I fill this in?*

1. **Choose a design** — 40 designs across Caribbean & African, Classic, Football and Standard
2. **Send us the details** — photos, order of service, hymns. Use the form or just WhatsApp them
3. **Approve your proof** — we design it in 24–48 hours and send it by email or WhatsApp to check
4. **Delivered** — next-day UK delivery, or same-day locally

Ends in a CTA. Also links to `/how-it-works/` for the longer version.

### 4. Browse by heritage
The niche bet, made visible. Four large entry cards, **Caribbean & African first**:

| Card | Content |
|---|---|
| **Caribbean & African** | Jamaica, Trinidad, Grenada, Barbados, St Lucia, Antigua, Dominica, Nigeria, Ghana, Rasta |
| **Classic** | 3 designs |
| **Football** | Arsenal, Chelsea, Tottenham, Liverpool, Man Utd, Man City |
| **Standard** | 22 designs |

This replaces the undifferentiated 41-thumbnail wall and immediately tells the target customer
"this is for you."

### 5. Featured designs
**6–8 strongest designs only**, each linking to its own page. Use designs with complete, live
imagery — do **not** feature Nigeria, Dominica, Snow Flake or Rasta Theme until their broken hero
images are replaced (see audit B2).

### 6. Packages
Three anchored tiers drawn from the existing 12 packages, so cost is answered on the homepage:

| Tier | Example | From |
|---|---|---|
| Essential | 50 × 4-page + Motion Obituary + Motion Gallery + banner | **£310** |
| Signature | 150 × 8-page + Motion Obituary + Motion Gallery + 2 banners | **£515** |
| Full Tribute | 250 × 20-page + Motion Obituary + Motion Gallery + 2 banners | **£898** |

Each tier gets its own CTA. Link to `/prices/` for the full matrix.

### 7. Add-ons
Motion Obituary · Motion Gallery · Banners · Bookmarkers — with images and one line each. Currently
invisible on the site despite being pure-margin upsells.

> A Motion Obituary is an animated way to tell family and friends — easy to share on WhatsApp.

### 8. Ashley's story
Short excerpt + the photo of Sharon, linking to `/about/`. This is what separates him from a £55
template shop:

> I lost my mother at seven months old. What frustrated me was watching families pull out all the
> bells and whistles for a wedding, then send their loved ones off with cheap black and white
> photocopied paper. — **Ashley Whittick, founder**

### 9. Reviews & tributes
Real social proof, properly structured (the current review plugin output is unstyled). Plus the
`@memoriestributes` Instagram feed and a link to `/reviews/`.

### 10. Funeral directors
One line + link to `/funeral-directors/`:
> **Are you a funeral director?** We offer trade pricing, white-label proofs and a dedicated line.

### 11. Final CTA block
All three doors together: form, `tel:`, WhatsApp — plus the honest turnaround promise.

### 12. Footer
Full NAP (Stanmore Place, Stanmore Innovation Centre, Howard Rd, London HA7 1BT), `tel:`, `mailto:`,
WhatsApp, hours, and links to every `/help/` article.

---

## Rules for the build

- Exactly **one `<h1>`** — the hero headline
- Body copy **never** inside a heading tag
- Headings descend properly: `h1 → h2 → h3`. No `h4` used as a design-name label
- Every image gets **descriptive, specific** alt text — never the 40-word comma-spam string
- A conversion action visible at **every scroll depth**
- **Do not** render all 40 designs on the homepage — 6–8 featured, then link out
- Target **under 1 MB total page weight**, images as WebP, lazy-loaded below the fold
- Real `tel:` and `wa.me` links, not plain text

## SEO targets for this page

- **Title:** `Funeral Order of Service Booklets | Designed & Printed in 24–48 Hours | Memories`
- **Meta description:** written, unique, mentions turnaround, UK delivery and the heritage ranges
- **Primary:** funeral order of service booklets · funeral booklet printing UK
- **Secondary:** funeral programme printing · order of service printing · celebration of life booklets
- `og:locale` = `en_GB` (currently `en_US`). The existing `og:image`
  (`2020/08/Black-Beauty-300dpi-Website-Header-.jpg`) is live and archived — safe to reuse, though a
  new hero image is preferable.
