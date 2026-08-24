# SEO & Keyword Architecture

**Supersedes nothing** — this hardens `04-SEO.md` from a strategy into a per-URL assignment, and
adds the rules that stop the 61 pages competing with each other.

---

## First, an honest limit on this document

**I have no keyword volume data.** There is no Ahrefs, Semrush, Google Keyword Planner or Search
Console access in this project, and the site has no meaningful ranking history to read.

So this document does **not** contain search volumes, difficulty scores or traffic forecasts. Any
number of that kind here would be invented, and inventing them is how SEO plans end up targeting
terms nobody searches.

What it does contain is defensible without a tool:

| Assertable now | Why |
|---|---|
| **Intent** per keyword | Readable from the phrasing — "funeral hymns list" is research, "funeral booklet printing UK" is commercial |
| **Relative competition** | Verified by looking at who ranks: four named UK competitors, all template-led |
| **Product–keyword fit** | The catalogue is known — 9 Caribbean/African, 6 football, 40 total |
| **Cannibalisation risk** | A structural property of the URL set, not a data question |
| **Content gaps** | Measured — 46,400 words orphaned, commercial pages under 350 words |

### What must be validated before spending on content

Run these in a keyword tool and in GSC once the site is live, in this order:

1. **Tier 2 niche terms** — the whole strategic bet. Confirm `Jamaican funeral order of service`,
   `Caribbean funeral programme UK`, `Nigerian funeral booklet` and the seven country variants have
   non-trivial volume. If the diaspora terms are near-zero, the *positioning* still holds (it is a
   conversion and differentiation play) but the **SEO** case for 9 separate country pages weakens and
   they should consolidate into `/caribbean-african/`.
2. **`celebration of life booklets`** vs `order of service` — a genuine UK/US phrasing split worth
   measuring before committing copy.
3. **Football club terms** — `[club] funeral order of service`. Plausibly tiny but zero-competition.
   Cheap to test; also carries **trademark risk** (see the warning below).
4. **`motion obituary`** — likely a term Ashley coined. If nobody searches it, the page must target
   the description (`animated funeral tribute video`) and keep "Motion Obituary" as the brand name.

Treat every keyword below as a **hypothesis with an assigned owner page**, not a validated target.

---

## The one rule that matters: one intent per URL

61 URLs targeting overlapping terms will cannibalise without an explicit map. Every page gets one
primary intent and is forbidden from competing for another page's.

| URL | Owns | Explicitly does NOT target |
|---|---|---|
| `/` | **Brand + "who are you, can you help me"** | The head term — see below |
| `/funeral-order-of-service-booklets/` | **`funeral order of service booklets`** (Tier 1 head) | Any single culture or design |
| `/…/caribbean-african/` | **`caribbean funeral programme UK`, `african funeral order of service UK`** | Individual countries |
| `/booklets/jamaica/` | **`jamaican funeral order of service`** | Generic Caribbean terms |
| `/prices/` | **`funeral order of service printing prices`, `how much do funeral booklets cost`** | Product terms |
| `/order/` | **Nothing — `noindex`** | Everything |
| `/how-it-works/` | `how to make a funeral order of service` (commercial-adjacent) | Pricing |
| `/help/funeral-hymns/` | **`funeral hymns list`** | Booklet terms |
| `/help/funeral-poems-and-prayers/` | **`funeral poems and readings`** | Hymns |
| `/help/what-to-write-in-a-funeral-programme/` | **`what to write in a funeral programme`** | Hymns, poems |
| `/help/uk-bereavement-benefits/` | **`bereavement benefits UK`** | Anything commercial |
| `/motion-obituary/` | `animated funeral tribute video` + the brand term | Booklets |
| `/funeral-directors/` | `trade funeral stationery UK`, `white label order of service` | Consumer terms |

### The homepage deliberately does not chase the head term

Unusual, so stated plainly: `/funeral-order-of-service-booklets/` is the Tier 1 page, **not** `/`.

Three reasons. The approved `<h1>` is brand copy (*"Funeral Booklets with a Touch of Class"*) and the
client has signed it off. A category page with an exact-match `<h1>`, 40 products and category schema
is a better ranking asset for a commercial head term than a homepage that must also carry the brand
story. And it removes the homepage-vs-catalogue cannibalisation that the old site had.

The homepage still ranks for brand queries, wins the *"can they help me"* click, and carries the
internal-link authority. Its `<title>` keeps the keyword; its `<h1>` does not need to.

### Cannibalisation guard-rails

- **`/caribbean-african/` never lists country keywords in its `<h1>` or `<title>`.** It targets the
  *collective* term. Countries live one level down.
- **Design pages never target `funeral order of service booklets` bare.** Always qualified:
  `Jamaica Funeral Order of Service Booklet`.
- **`/help/*` articles never target commercial terms.** They earn the top-of-funnel visit and hand
  off with a soft CTA. If a help article starts ranking for a money term, that is a signal to build
  a commercial page, not to monetise the article.
- **One canonical per intent.** The four category pages are real indexable pages; any filter
  combination (`?colour=`, `?pages=`) is `noindex` or canonicalised to the category.

---

## Tier 1 — Head terms (credibility, page 2–3 realistically)

**Pages:** `/funeral-order-of-service-booklets/` · `/prices/` · `/`

| Keyword | Owner |
|---|---|
| funeral order of service booklets | `/funeral-order-of-service-booklets/` |
| funeral booklet printing UK | `/funeral-order-of-service-booklets/` |
| order of service printing | `/funeral-order-of-service-booklets/` |
| funeral programme printing | `/funeral-order-of-service-booklets/` |
| how much do funeral booklets cost | `/prices/` |
| funeral order of service prices UK | `/prices/` |

Against Devine, Funeral Stationery 4U, Utterly Printable and instantprint — all with more authority
and cheaper products — the realistic play is **service depth, real reviews, page speed and schema**,
not out-publishing a volume printer. Do not budget content hours here expecting rankings; budget
them expecting the pages to convert the traffic that arrives from elsewhere.

## Tier 2 — The niche (the actual bet)

**Pages:** `/caribbean-african/` + 9 country design pages + 6 football design pages.

| Keyword pattern | Owner |
|---|---|
| caribbean funeral programme UK · african funeral order of service UK | `/caribbean-african/` |
| jamaican / trinidadian / grenadian / bajan / st lucian / antiguan / dominican funeral order of service | respective design page |
| nigerian · ghanaian funeral booklet / programme | respective design page |
| rasta / rastafarian funeral order of service | `/booklets/rasta-theme/` |
| nine night order of service | `/help/nine-night/` (new article) |
| repatriation funeral order of service UK | `/caribbean-african/` |
| [arsenal…man city] funeral order of service | respective design page |

**Three hard prerequisites** — all from `05-CLIENT-ACTIONS.md`, none of them SEO work:

1. **Nigeria and Dominica have dead hero images** (86% of their imagery 404s). Promoting a page whose
   product shot is broken wastes the ranking. Blocked on Ashley.
2. **Eight designs share duplicated copy** — `classic-one/two/three` + `rose-and-sleek` are
   word-for-word identical; `black-beauty`/`gemini-orange` share copy *and* hero image. Duplicate
   pages do not rank, and Google will pick one and ignore the rest.
3. **Unique cultural context per page.** The flag symbolism already written is a start, but two
   sentences will not rank. Each country page needs genuine substance — what the send-off
   traditionally involves, Nine Night timing, repatriation practicalities.

> ⚠️ **Football designs carry trademark risk.** "Arsenal", "Chelsea", club crests and colours are
> registered marks, and Premier League clubs enforce actively. Six products and six target keywords
> are built on them. This is a **legal question to settle before optimising those pages**, not an SEO
> question — get a view on whether these are licensed, defensible as descriptive use, or a liability.
> Ranking page 1 for "Arsenal funeral order of service" is exactly how an unlicensed product gets
> noticed. Flagging it because nobody else has.

## Tier 3 — Informational (cheapest wins, already written)

He already owns ~46,400 words. It is hidden, not missing.

| Keyword | Owner | Status |
|---|---|---|
| funeral hymns list · hymns for a funeral | `/help/funeral-hymns/` | **28,905 words exist** — orphaned |
| funeral poems and readings | `/help/funeral-poems-and-prayers/` | **12,560 words exist** — orphaned |
| what to write in a funeral programme | `/help/what-to-write…/` | **Exists as broken raw HTML** on `/faqs/` |
| bereavement benefits UK · bereavement support payment | `/help/uk-bereavement-benefits/` | **3,815 words exist** — orphaned |
| how many pages in an order of service | `/help/faqs/` | Partial |
| order of service paper size · A5 booklet folding | `/help/faqs/` | Partial |
| nine night — what to expect | `/help/nine-night/` | **Write** — nobody in UK print owns this |

Two structural jobs before this tier earns anything:

**Split the libraries.** A 28,905-word single page targeting "funeral hymns" is one URL competing for
hundreds of queries. Break it into a hub plus children — `/help/funeral-hymns/` as the browsable
index, with sub-pages by theme (traditional, Caribbean, gospel, modern) and, where a hymn has real
standalone demand, per-hymn pages. Same for poems. This turns two orphaned pages into a genuine
content cluster.

**Rescue the FAQ block.** Nine ready-written H2 topics are currently rendering as literal broken
markup on `/faqs/` because someone pasted HTML with smart quotes into the editor. That is the single
cheapest SEO win available on the entire site — the content is written, it just needs pasting into
real fields.

### Why Tier 3 is the referral flywheel, not a vanity play

Someone searching "funeral hymns" is **2–5 days from needing a booklet**. That is the whole argument
for this tier: it is not traffic for its own sake, it is reaching the customer *before* the funeral
director recommends someone else. Every `/help/` article carries one soft, contextual CTA —
*"We can set these hymns into your booklet for you"* — and nothing more aggressive.

---

## Content depth targets

The old site's problem was inverted: 46,400 words hidden, commercial pages averaging under 350.

| Template | Target | Note |
|---|---|---|
| Homepage | 600–900 | Currently ~700 in the approved design — fine |
| Catalogue | 400–600 | Plus 40 product cards |
| Category (×4) | 700–1,200 | `/caribbean-african/` toward the top — it is the bet |
| Design page (×40) | 350–600 | **Unique.** 8 currently duplicated |
| `/prices/` | 700–1,000 | Full matrix + what is included + what affects price |
| `/how-it-works/` | 600–900 | The highest-anxiety page; answer everything |
| `/help/` articles | 1,200+ | Depth is the whole point here |
| `/funeral-directors/` | 600–900 | A stated trade offer, not "email us" |

Word counts are a floor for *substance*, not a target to pad to. A 400-word design page that
genuinely explains who a design suits beats 800 words of restated specs.

---

## E-E-A-T on a grief topic

Funeral content sits next to YMYL. `/help/uk-bereavement-benefits/` in particular gives guidance on
**DWP benefits and the BB1 form** — get that wrong and a bereaved person loses money.

| Signal | Action |
|---|---|
| **Experience** | Ashley's story is the strongest asset on the site. It belongs on `/about/`, excerpted on `/`, and bylined on the help articles |
| **Expertise** | Author box on every `/help/` article: who wrote it, why they know |
| **Authoritativeness** | Real reviews, Google Business Profile, links from the three partner funeral directors |
| **Trust** | Complete NAP, visible pricing, honest turnaround, a named person to speak to |
| **Accuracy** | Bereavement-benefits figures **must carry a "last checked" date** and cite gov.uk. DWP rates change annually |
| **Non-negotiable** | No fabricated reviews. See `06-HOMEPAGE-AUDIT.md` |

**The turnaround contradiction is an E-E-A-T problem, not just a copy problem.** The live design
pages say *"4-5 days"* while the strategy and approved homepage say *"24–48 hours"* — I verified this
on `/menu/jamaica/`. Publishing both across 61 pages is a trust failure with real consequences on a
funeral deadline. Settle it before writing page copy: most likely *24–48 hours to proof, 4–5 days to
delivered*, but that needs Ashley to confirm, and then it must be stated the same way everywhere.

---

## Technical checklist

**Per page**
- [ ] Unique `<title>`, 50–60 chars, primary keyword front-loaded
- [ ] Unique meta description, 140–160 chars, with a reason to click (turnaround, free proof)
- [ ] Exactly one `<h1>`; clean `h2`/`h3` descent; **no body copy inside headings**
- [ ] Descriptive alt text — **remove the 40-word comma-spam string everywhere** (audit C7)
- [ ] Canonical, self-referencing
- [ ] Internal links: every `/help/` article → a relevant design + `/order/`

**Site-wide**
- [ ] `og:locale` = `en_GB`
- [ ] `en-GB` spelling — fix **"WHITE LILLIES" → "White Lilies"**
- [ ] **Strip the `VIEW ` prefix from 38 of 40 design names**
- [ ] Normalise `football` → `Football`; rename `World Themes` → `Caribbean & African`
- [ ] All 301s applied, `/menu/{slug}` → `/booklets/{slug}` — **the redirect map needs rebuilding**
      (`redirects.csv` is not in this repo; the 40 slugs are recoverable from `catalogue.md` plus the
      live sitemap)
- [ ] XML sitemap excludes redirecting URLs — the three `/slide-page/*` entries today
- [ ] `/order/` and any filter states set `noindex`
- [ ] `robots.txt` rewritten at launch — it currently `Disallow: /` for the private preview

**Off-site**
- [ ] **Google Business Profile** for Stanmore Place, HA7 1BT — the biggest missing local signal.
      Unlocks the map pack for "order of service printing London"
- [ ] Consistent NAP across GBP, footer and schema — the footer is currently missing the phone
- [ ] Links from the three partner funeral directors — the easiest relevant links available
- [ ] Instagram `@memoriestributes` linked and consistent

---

## Sequencing

| Phase | Work | Gate |
|---|---|---|
| **0** | Settle the turnaround truth. Settle the football trademark question | Both block copy |
| **1** | Build the structure: 61 URLs, titles, descriptions, H1s, schema, 301s, GBP | No new content needed |
| **2** | Rescue the FAQ block; un-orphan and split `/help/*` | Cheapest wins, content exists |
| **3** | Rewrite 8 duplicate design descriptions; replace broken Nigeria/Dominica imagery | Unblocks Tier 2 |
| **4** | Build `/caribbean-african/` + per-country cultural depth | The differentiated bet |
| **5** | Add-on pages; `/help/nine-night/`; real reviews → GBP + `/reviews/` | Compounding |

**GA4 conversion events must be configured before Phase 1 ships** (`03-FUNNEL.md`) — `call_click`,
`whatsapp_click`, `form_submit` as key events. Otherwise none of the above is attributable and the
only question worth answering — *which designs and which referral sources produce orders* — stays
unanswerable.
