# Memories by DD — Website Revamp

Working repository for the revamp of **[memoriesbydd.com](https://memoriesbydd.com/)** — Memories
Funeral Booklets, a UK business (Ashley Whittick) that designs and prints personalised funeral
order-of-service booklets plus digital and physical add-ons.

**Current state: a production-ready custom static site built with Vite and deployed on Netlify.**
The premium branch includes the complete responsive site, enquiry journey, SEO files, redirects,
security headers and a server-side Netlify function for Airtable. The earlier Webflow and discovery
documents remain in the repository as project history; they no longer describe the active build.

---

## Project decisions

| Decision | Choice |
|---|---|
| Platform | **Vite static site on Netlify** |
| Order model | **Enquiry-first** — guided form + tap-to-call + WhatsApp. No checkout |
| Positioning | **Lead with the cultural niche** — UK Caribbean & African families |
| Pricing | **Keep public**, restructured around packages, with CTAs |

---

## Production build

| Item | Location |
|---|---|
| Public source | `_deploy/` |
| Enquiry API | `netlify/functions/enquiry.mjs` |
| Netlify config | `netlify.toml` |
| Vite entry points | `vite.config.js` |
| Automated QA | `scripts/qa-site.mjs` |

Use Node 22 and pnpm 11. Run `pnpm install`, then `pnpm qa`. Netlify builds with `npm run build`
and publishes `dist/`. The live enquiry function requires `AIRTABLE_PAT`, `AIRTABLE_BASE_ID` and
`AIRTABLE_TABLE_ID` in Netlify environment variables; never expose those values in browser code.

The strategy and archive sections below document the research that led to this build. Treat any
references to a future Webflow or Fillout implementation as historical rather than deployment
instructions.

---

## Start here

| Read | For |
|---|---|
| **[_archive/audit/AUDIT.md](_archive/audit/AUDIT.md)** | What is wrong with the current site — 23 findings, severity-ranked |
| **[_strategy/01-SITEMAP.md](_strategy/01-SITEMAP.md)** | Proposed information architecture + redirect plan |
| **[_strategy/02-HOMEPAGE.md](_strategy/02-HOMEPAGE.md)** | Homepage content strategy, section by section |
| **[_strategy/03-FUNNEL.md](_strategy/03-FUNNEL.md)** | Conversion paths, form placement, referral tracking |
| **[_strategy/04-SEO.md](_strategy/04-SEO.md)** | Keyword strategy in three tiers + technical checklist |
| **[_strategy/05-CLIENT-ACTIONS.md](_strategy/05-CLIENT-ACTIONS.md)** | **What we need from Ashley** — blocking items |

**Phase 2 — structure, SEO and the remaining page designs:**

| Read | For |
|---|---|
| **[_strategy/06-HOMEPAGE-AUDIT.md](_strategy/06-HOMEPAGE-AUDIT.md)** | The approved homepage vs the brief — 4 commercial gaps, 1 launch blocker |
| **[_strategy/07-SEO-AND-KEYWORDS.md](_strategy/07-SEO-AND-KEYWORDS.md)** | Keyword ownership per URL, cannibalisation rules, content depth, E-E-A-T |
| ~~[_strategy/08-PAGE-BLUEPRINTS.md](_strategy/08-PAGE-BLUEPRINTS.md)~~ | ⛔ **Superseded by 12** — kept for the component mapping and schema inventory |
| **[_strategy/09-AEO-GEO.md](_strategy/09-AEO-GEO.md)** | Answer engines, generative engines, full schema inventory, AI-crawler policy |
| **[_strategy/10-PERFORMANCE.md](_strategy/10-PERFORMANCE.md)** | Core Web Vitals — measured, with the image fixes that matter most |

**Phase 3 — the client brief governs (start here):**

| Read | For |
|---|---|
| **[_strategy/11-BRIEF-RECONCILIATION.md](_strategy/11-BRIEF-RECONCILIATION.md)** | **11 conflicts** between the client brief and the strategy above, and the 8 decisions needed from Ashley |
| **[_strategy/12-SITEMAP-V2.md](_strategy/12-SITEMAP-V2.md)** | ★ **The sitemap and page structure to build from.** Supersedes 01 and 08 |

> **The client project brief (11 Aug 2026) governs.** Only the pages it names are built. Where the
> earlier strategy docs conflict with it, the brief wins — see 11 for the itemised list.

---

## The three headline findings

1. **There is not one tap-to-call or WhatsApp link on the entire website.** Both numbers are plain
   text. Most referral traffic is mobile and most funerals are arranged within 48 hours.
2. **The funnel dead-ends.** All 40 design pages say *"call us to place your order"* and link to
   `/price-list/` — a page with no button, no form and no phone link. The order form exists on the
   homepage only, in an unlabelled grey box.
3. **The niche is already in the catalogue but nowhere in the branding.** Nine designs are Caribbean
   or African, six are football clubs. UK competitors sell generic templates at ~£55/50 copies; he
   charges £122+ for done-for-you design. Culture and service are the moat, not price.

And one more worth its own line: **≈46,000 words of useful content — a 28,905-word hymn library, a
12,560-word poem library and a UK bereavement-benefits guide — sit orphaned behind an 8-word page.**
Every commercial page in the navigation averages under 350 words.

---

## Repository layout

```
_archive/
  pages/markdown/          13 pages of the old site, cleaned readable text
  audit/AUDIT.md           the full audit

_strategy/                 Phase 1 deliverables (01–05 above)

_design/
  landing-concept-02.html  the approved homepage design
  DESIGN-NOTES.md          tokens, motion system, section-by-section rationale
  img/                     20 assets

_deploy/                   what goes to Netlify — index.html + netlify.toml + img/
```

Total ≈6 MB. Everything is tracked in git; see `.gitignore`.

### Not in this repo

The bulk extracts described in earlier drafts of this file — `_archive/data/*.json`,
`redirects.csv`, `_archive/pages/html/`, `_archive/media/` (329 MB), `_archive/raw/` and
`_tools/*.ps1` — are **not** here.

This is recoverable rather than lost: **the live site is still up and unmodified, and its WordPress
REST API is open.** Everything in those folders was derived from public sources in the first place,
so it can be regenerated — see "Regenerating the archive" below.

What survives in this repo covers more than it looks like:

| Need | Where it is |
|---|---|
| All 40 design names + their categories | `_archive/pages/markdown/catalogue.md` |
| Full price matrix + all 12 packages | `_archive/pages/markdown/price-list.md` |
| The ≈46,000 words of hymns, poems and the bereavement guide | `_archive/pages/markdown/` |
| Every audit finding, with counts and file names | `_archive/audit/AUDIT.md` |

The genuine gap is **per-design detail** — 40 descriptions, specs, image sets and Vimeo IDs. That is
~40 page fetches from the live site.

---

## What the current site is

| | |
|---|---|
| Stack | WordPress on Apache, **PHP 7.4** (end-of-life), Avada + Fusion Builder, Yoast 28.2 |
| Plugins | Contact Form 7, MetaSlider, Click-to-Chat-for-WhatsApp, MonsterInsights, WooCommerce (**unused**) |
| Analytics | GA4 `G-LXY7DY8737` — **no conversion events configured** |
| Order form | Fillout `35E7XCNpsmus` — homepage only |
| Pages | 13 + 40 design pages + 4 categories |
| Designs | 40 — Standard 21, **Caribbean/African 9**, Football 6, Classic 3, 1 uncategorised |
| Imagery | 301 product images (**280 live, 21 dead**) + **119 Vimeo videos** |
| Page weight | 0.9–1.2 MB HTML per page, 36 CSS + 111 JS files |

**Contact:** 0800 023 6263 · WhatsApp 07552 91 6060 · info@memoriesbydd.com
Stanmore Place, Stanmore Innovation Centre, Howard Rd, London HA7 1BT

**Partner freephone numbers** (existing referral attribution — keep these):
Al-tayo's 0800 023 5991 · Joel Grant 0800 023 5448 · Calo's 0800 023 5797

---

## Regenerating the archive

All public sources — no credentials used. The WordPress REST API is open on this site, so the steps
below still work and are the route back to the missing extracts.

```bash
# 1. Raw JSON + sitemaps
curl .../wp-json/wp/v2/pages?per_page=100
curl .../wp-json/wp/v2/avada_portfolio?per_page=100
curl .../wp-json/wp/v2/media?per_page=100&page=1..6

# 2. Rendered HTML for all 54 URLs
curl --parallel -K _archive/data/curl-pages.cfg

# 3. Structure the content
powershell _tools/extract.ps1          # pages, designs, media, redirects
powershell _tools/enrich-images.ps1    # complete image sets incl. lazy-loaded CSS backgrounds

# 4. Media (union of library + everything referenced in HTML)
curl --parallel -K _archive/data/curl-media.cfg
```

**Two things worth knowing about the extraction:**

- The REST media library returns 542 items, but **31 assets referenced on live pages are not in it** —
  including all 10 photos of Ashley's mother Sharon, the logo, and several product images. The
  download list is the **union** of the library and everything referenced in the HTML, so nothing was
  lost. 26 of those 31 turned out to be dead on the server (`media-404.txt`).
- Gallery images are lazy-loaded **CSS backgrounds** (`data-bg` / `data-bg-url`), not `<img src>`.
  A `src`-only scrape misses roughly **two-thirds** of the product imagery. Any re-scrape must read
  those attributes, not just `<img src>` — this is the single easiest thing to get wrong.

### If you re-download the media

Check every file for valid image/video magic bytes and zero-byte results — a WordPress 404 can come
back as an HTML error page saved under an image filename. 26 assets are confirmed dead at origin
(they 404 for real), so those failures are expected, not download errors.

---

## Working across two computers

One private repo, owned by one GitHub account, with the second account added as a **collaborator**
(repo Settings → Collaborators → Add people). The two machines do not need the same account — each
signs in as its own and pushes to the same repo. Git Credential Manager keeps the credentials
separate per machine.

The routine, on either machine:

```bash
git pull        # before you start work
git push        # when you stop
```

**Deployment is git-connected.** On the current `premium` branch, Netlify builds from the **repo
root** with `npm run build` and publishes `dist`. `vite.config.js` already treats `_deploy` as the
site source directory. Leave Netlify’s Base directory blank and do not use drag-and-drop deploys —
that is how the live site previously ended up serving files older than the repository.

### Airtable enquiry setup

The custom form posts to the Netlify function at `/.netlify/functions/enquiry`; Airtable credentials
never appear in browser code. Configure these encrypted Netlify environment variables before the
form goes live:

- `AIRTABLE_PAT` — a scoped Personal Access Token with record-write access.
- `AIRTABLE_BASE_ID` — the destination base ID.
- `AIRTABLE_TABLE_ID` — the destination table ID or exact table name.

The Airtable table must contain the field names mapped in `netlify/functions/enquiry.mjs`. Referral,
design, package and UTM values are carried through automatically.

### Optional Make automation handoff

Airtable is the system of record; Make is deliberately downstream so a Make outage can never lose a
family's enquiry. Add `MAKE_WEBHOOK_URL` in Netlify only after creating a Make custom-webhook
scenario. After Airtable confirms a new record, the function sends Make a minimal event containing
the Airtable record ID and internal reference. Make can then fetch the full record with its own
Airtable connection and run notifications or proof workflows. Duplicate submissions do not trigger
the webhook, and a failed Make handoff is logged without turning a safely stored enquiry into a form
error.

Recommended Make scenario: **Custom webhook → Airtable/Get a record → Router**. Begin with a disabled
test scenario, confirm one test record follows the intended route, then enable scheduling. Never put
the Airtable personal access token or Make webhook URL in `_deploy` or other browser-delivered code.

> Production remains unchanged until the Git-connected Netlify site is explicitly published.
