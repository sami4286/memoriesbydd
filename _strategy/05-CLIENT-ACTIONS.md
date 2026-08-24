# Content Actions Needed From Ashley

Everything here needs the client's own material or a decision — it cannot be fixed by design or
development. **These block the new site's product pages**, so they are worth starting now, in
parallel with design.

Machine-readable version: **`_archive/data/design-qa.csv`** (one row per design).

---

## 1. Replace broken product images — URGENT (7 designs, 21 dead files)

These files return **404 on the live site right now**. They cannot be recovered from the server, so
original artwork or fresh exports are needed. Four designs have a **dead hero image**, meaning the
main product shot is a broken image on the live site today.

| Design | Dead | Hero dead? | Needed |
|---|---|---|---|
| **Nigeria** | 6 of 7 (86%) | **YES** | Full reshoot/re-export — page is effectively image-less |
| **Dominica** | 6 of 7 (86%) | **YES** | Full reshoot/re-export — page is effectively image-less |
| **Snow Flake** | 3 of 7 (43%) | **YES** | Hero + 2 gallery images |
| **Rasta Theme** | 1 of 8 (12%) | **YES** | Hero image (`Rasta-Comp.png`) |
| Antigua | 2 of 6 | No | 2 gallery images |
| Honey Comb | 2 of 8 | No | 2 gallery images |
| Manchester City | 1 of 7 | No | 1 gallery image |

**Nigeria and Dominica matter most** — they are two of the nine Caribbean/African designs, the exact
range the new site will lead with.

**Also dead site-wide:**
- `dpd.png` and `uber.png` — delivery-partner logos, broken on **all 40 design pages**. Need fresh
  logos, or drop them and state delivery in text
- `memories3.png` — logo, broken on `/support-2/`
- `candle-vid.mp4`, `smarthpone-user-1024x552-1.png`

Full list: `_archive/data/media-404.txt` · page mapping: `_archive/data/broken-images.csv`

---

## 2. Rewrite duplicated design copy (8 designs)

Duplicate text cannot rank, and it reads as careless to a customer comparing designs.

**Word-for-word identical — 4 designs share one paragraph:**
`classic-one` · `classic-two` · `classic-three` · `rose-and-sleek`
> *"This memories booklet is more masculine, still holding its sophistication and elegance. There is
> plenty of space for hymns, the order of service and a selection of photos."*

Each needs its own description explaining what actually differs between Classic One, Two and Three —
and Rose & Sleek is not even in the Classic range.

**Word-for-word identical — plus the same hero image:**
`black-beauty` · `gemini-orange` — see item 4, this is really a duplicate-product problem.

**Templated near-duplicates** (same sentence, product name swapped) — lower priority but worth
differentiating:
- `rose-petals` / `victorian-colours` — *"Consider your loved ones send off in capable hands…"*
- `golden-ocean` / `ghana` — *"striking, deep and full of character with its rich tones…"*

---

## 3. Confirm three mismatched product images

Each of these appears to show **another design's artwork**:

| Design | Currently shows | Suspected correct |
|---|---|---|
| **Golden Ocean** | `rose-n-sllek-header.png` | Rose & Sleek's artwork — Golden Ocean's own hero is needed |
| **Snow Flake** | `Floral-Wreath-sq6.jpg` | Floral Wreath's asset — and it is dead (see item 1) |
| **Classic Three** | `Design-two-comp.png` | Looks like Classic **Two's** artwork — please confirm |

---

## 4. Decide what to do with "Gemini Orange"

`/menu/gemini-orange/` is live and in the XML sitemap, but:
- it has the **same description** as Black Beauty
- it uses the **same hero image** as Black Beauty
- it has **no category assigned** — which is why it never appears on `/catalogue/`

It looks like an unfinished draft that got published. **Either** give it its own artwork, copy and
category, **or** retire it (it would 301 to Black Beauty). Please confirm which.

---

## 5. Supply missing specifications (3 designs)

| Design | Missing |
|---|---|
| **Godfather** | Photo Allowance, Suitability |
| **Acrylic Splashes** | Photo Allowance |
| **Rasta Theme** | Photo Allowance |

Every other design states these, and the new site will show them consistently on each product page.
The order form will also use photo allowance to tell customers exactly how many photos to send.

---

## 6. Approve naming and category changes

- **38 of 40 designs** have `VIEW ` stuck in front of the name (e.g. "VIEW JAMAICA"). This will be
  stripped on migration — please confirm the clean names are right
- **"WHITE LILLIES"** is misspelled — correcting to **"White Lilies"**
- **"World Themes"** → proposed **"Caribbean & African"**. More human, matches the actual designs,
  and matches how customers search. **Needs your sign-off** — this is the category the new site leads
  with
- **"football"** category is lowercase while the others are capitalised — will be normalised

---

## 7. Confirm the three headline packages

The new homepage and `/prices/` will lead with three anchored tiers drawn from your existing 12
packages. Proposed:

| Tier | Contents | Price |
|---|---|---|
| **Essential** | 50 × 4-page booklets, 1 Motion Obituary, Motion Gallery (20 pics), 1 banner | **£310** |
| **Signature** | 150 × 8-page booklets, 1 Motion Obituary, Motion Gallery (40 pics), 2 banners | **£515** |
| **Full Tribute** | 250 × 20-page booklets, 1 Motion Obituary, Motion Gallery (60 pics), 2 banners | **£898** |

The full price matrix stays published below. **Please confirm these are the three you want to lead
with** — they are the anchors most customers will judge you on.

---

## 8. Positioning sign-off

The new site will lead with **"beautiful order of service booklets for UK Caribbean and African
families"**, with Classic, Football and Standard ranges alongside.

The reasoning: 9 of your 40 designs are Caribbean or African, your competitors sell generic templates
at roughly a third of your price, and there is no UK company owning this space. Competing on price
against template shops is not winnable; competing on cultural specificity and done-for-you service is.

This does **not** turn away other customers — the Classic and Standard ranges stay fully visible.
But it does decide what the homepage says first. **Please confirm you are comfortable leading with
it.**

---

## 9. Material we would like (nice to have, high value)

| Item | Why |
|---|---|
| **Photos of finished booklets in real hands / at services** | Every current image is a flat mockup. Real-world photos convert far better |
| **2–3 customer stories or quotes** (with permission) | You collect reviews but they are buried and unstructured |
| **A photo of you** | The founder story is your strongest differentiator and currently has no face |
| **Turnaround truth-check** | The site says both "24–48 hours" and "4–5 day turnaround". Which applies to what? We must not promise wrongly |
| **Delivery partners** | Are DPD and Uber still used? Their logos are broken sitewide |
| **Trade terms for funeral directors** | The FAQ says rates are negotiable. A stated offer converts far better than "email us" |

---

## Priority order

| Priority | Items |
|---|---|
| **Blocking the build** | 1 (Nigeria, Dominica, Snow Flake, Rasta), 5, 6, 8 |
| **Blocking SEO** | 2, 3, 4 |
| **Blocking launch** | 7, and the turnaround truth-check in 9 |
| **Post-launch** | rest of 9 |
