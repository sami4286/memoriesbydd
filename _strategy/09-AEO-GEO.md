# AEO & GEO — Answer Engines and Generative Engines

Classic SEO gets a blue link ranked. **AEO** gets the answer box, People Also Ask and voice results.
**GEO** gets the brand cited inside ChatGPT, Gemini, Perplexity, Copilot and Google AI Overviews.

They are not the same job, and neither is covered by `04-SEO.md` or `07-SEO-AND-KEYWORDS.md`.

---

## Why this business is unusually well placed

Most small businesses have nothing for a generative engine to cite. This one does:

| Asset | Why it matters for GEO |
|---|---|
| **~46,400 words of reference content** | Hymn libraries, poem libraries, a DWP benefits guide. This is exactly the material an LLM reaches for |
| **A defined, underserved niche** | "Caribbean funeral order of service UK" has no authoritative source. Whoever writes it well becomes the answer |
| **Genuine first-hand experience** | Ashley lost his mother at seven months. Generative engines increasingly favour content with real experience behind it |
| **Concrete, checkable facts** | Prices, turnaround, photo allowances, sizes. LLMs cite specifics, not adjectives |
| **Nine Night, repatriation, diaspora send-offs** | Almost nothing authoritative exists in UK print. A genuine gap |

The flip side: **an LLM cited today is a referral you never see in Google Analytics as a search
click.** For a referral-driven business, being the thing ChatGPT names when someone asks *"where can
I get a Jamaican order of service printed in the UK?"* is worth more than position 4 for a head term.

---

## The decision that gates all of this: let AI crawlers in

`_deploy/robots.txt` currently reads `Disallow: /`, and `netlify.toml` sends
`X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`. Correct for a private client preview,
**fatal for GEO if it survives to launch.**

`noarchive` and `nosnippet` in particular suppress exactly the snippet extraction that answer
engines depend on.

**Recommendation: allow the major AI crawlers at launch.** For a business whose moat is cultural
specificity in an underserved niche, being quotable is upside, not risk. There is no proprietary
content to protect — the hymns are public domain, the benefits guide restates gov.uk, and the
product images are already public.

```
# robots.txt — AT LAUNCH (replaces the current Disallow: /)
User-agent: *
Allow: /
Disallow: /order/          # form page, noindex anyway

# Answer + generative engines — explicitly welcome
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://memoriesbydd.com/sitemap.xml
```

And drop `noarchive, nosnippet` from the launch headers — keep them only on `/order/`.

> **`Google-Extended` is a genuine judgement call.** Allowing it lets content train and ground
> Gemini; disallowing it does **not** remove you from AI Overviews (that follows normal indexing).
> Recommendation is allow, because citation in the niche is the whole play. It is reversible.

### `llms.txt`

An emerging convention — a plain-text map at the root telling models what the site is and which
pages matter. Not yet honoured by everyone, cheap to add, no downside.

```
# llms.txt
# Memories Funeral Booklets — memoriesbydd.com
> UK design-and-print service for personalised funeral order of service booklets.
> Done-for-you design in 24–48 hours. Specialists in Caribbean and African
> heritage designs. Based in Stanmore, London. Nationwide UK delivery.

## Key pages
- /funeral-order-of-service-booklets/: All 40 designs
- /funeral-order-of-service-booklets/caribbean-african/: 9 Caribbean & African designs
- /prices/: Full pricing from £122 for 50 booklets
- /how-it-works/: The 4-step process and timeline
- /help/funeral-hymns/: Funeral hymn library
- /help/funeral-poems-and-prayers/: Funeral poems, prayers and readings
- /help/uk-bereavement-benefits/: UK bereavement benefits guide
- /help/nine-night/: Nine Night explained

## Facts
- Freephone: 0800 023 6263 · WhatsApp: 07552 91 6060
- Turnaround: [SETTLE THIS FIRST — see the turnaround contradiction]
- Free proof before printing. Nationwide next-day UK delivery; same-day local.
```

---

## AEO — winning the answer

Answer engines extract a **short, complete, self-contained answer**. Content that buries the answer
in paragraph four does not get picked.

### The house style for every informational page

1. **Question as `h2`**, phrased the way a person types it — *"How many pages should an order of
   service be?"* not *"Page counts."*
2. **A 40–60 word direct answer immediately underneath**, before any elaboration. Complete enough to
   stand alone if lifted out of context.
3. **Then** the depth, examples and nuance.
4. **A table or list** where the answer is comparative. Answer engines lift tables readily.
5. **Specific numbers.** "24–48 hours", "£122 for 50", "12 gallery photos" — not "quickly",
   "affordable", "plenty of space".

Worked example:

```html
<h2>How many pages should a funeral order of service be?</h2>
<p class="answer">Most funeral order of service booklets are 4 or 8 pages. A 4-page
booklet fits the order of service and one or two photographs. An 8-page booklet adds
hymns, a tribute and a photo gallery. Larger services often use 12 to 20 pages.
Memories prints 4, 8, 12, 16 and 20-page booklets from £122 for 50 copies.</p>
```

That paragraph is 58 words, answers the question completely, contains three checkable specifics, and
names the brand once without selling. That is the shape.

### The highest-value AEO targets

Question-shaped, low-competition, and the content largely exists already:

| Question | Page |
|---|---|
| What do you write in a funeral order of service? | `/help/what-to-write-in-a-funeral-programme/` |
| How many pages should an order of service be? | `/help/faqs/` |
| What size is a funeral order of service? | `/help/faqs/` |
| How much does a funeral order of service cost UK? | `/prices/` |
| What hymns are sung at funerals? | `/help/funeral-hymns/` |
| What poems are read at funerals? | `/help/funeral-poems-and-prayers/` |
| **What is a Nine Night?** | `/help/nine-night/` — **write this; nobody owns it** |
| What bereavement benefits can I claim UK? | `/help/uk-bereavement-benefits/` |
| How quickly can funeral booklets be printed? | `/how-it-works/` |
| What is a Motion Obituary? | `/motion-obituary/` |

**"What is a Nine Night?" is the single best opportunity on this list.** It is a real question with
real search demand from UK Caribbean families, there is no authoritative UK commercial source, and
answering it well positions the brand exactly where the strategy wants it — as the company that
understands the send-off, not just the print job.

---

## Structured data — the full inventory

Currently **zero JSON-LD on the approved homepage.** This is the largest single technical gap.

| Template | Schema |
|---|---|
| `/` | `Organization` + `LocalBusiness` + `WebSite` (with `SearchAction`) |
| Catalogue | `CollectionPage` + `ItemList` (40) + `BreadcrumbList` |
| Category ×4 | `CollectionPage` + `ItemList` + `BreadcrumbList` |
| Design ×40 | `Product` + `Offer` + `BreadcrumbList` (+ `VideoObject` once Vimeo is fixed) |
| `/prices/` | `FAQPage` + `Offer` per tier + `BreadcrumbList` |
| `/how-it-works/` | `HowTo` + `FAQPage` + `BreadcrumbList` |
| `/help/*` | `Article` (+ `FAQPage`) + `author` + `BreadcrumbList` |
| `/motion-obituary/` | `Product` + `Offer` + `FAQPage` |
| `/funeral-directors/` | `Service` + `BreadcrumbList` |
| `/reviews/` | `Review` — **only once reviews are real** |
| `/contact/` | `LocalBusiness` + `ContactPage` |

### `LocalBusiness` — the foundation

Every NAP detail must match the Google Business Profile and the footer **character for character**.

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://memoriesbydd.com/#business",
  "name": "Memories Funeral Booklets",
  "description": "Personalised funeral order of service booklets, designed by hand and printed for UK families. Specialists in Caribbean and African heritage designs.",
  "url": "https://memoriesbydd.com/",
  "telephone": "+448000236263",
  "email": "info@memoriesbydd.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Stanmore Place, Stanmore Innovation Centre, Howard Rd",
    "addressLocality": "London",
    "postalCode": "HA7 1BT",
    "addressCountry": "GB"
  },
  "areaServed": { "@type": "Country", "name": "United Kingdom" },
  "priceRange": "££",
  "sameAs": ["https://www.instagram.com/memoriestributes/"]
}
```

**Blocked on Ashley:** `openingHours` (not stated anywhere), and geo coordinates once the GBP exists.

> ⚠️ **Two schema rules with legal weight.** Never emit `AggregateRating` or `Review` while the
> testimonials are the placeholders currently in `_deploy/index.html` — that is fake-review markup,
> and Google penalises it independently of the CMA problem. And never emit a `Product` `Offer` price
> that contradicts `/prices/`.

---

## GEO — being the cited source

Generative engines synthesise from multiple sources and cite a few. What earns the citation:

| Factor | Action here |
|---|---|
| **Specificity** | Exact prices, exact turnaround, exact photo allowances per design. Already known — just publish them consistently |
| **Comprehensiveness** | Be the most complete UK page on Caribbean funeral stationery. No competitor is trying |
| **Entity clarity** | Consistent name, NAP, `sameAs`. See the naming problem below |
| **Extractable structure** | Tables, definition lists, question `h2`s |
| **Freshness** | Visible `dateModified`. Bereavement benefits especially — DWP rates change annually |
| **Corroboration** | GBP, Instagram, partner funeral-director sites all saying the same thing |
| **First-hand experience** | Ashley's story, bylined |

### The brand-entity problem

The domain is **memoriesbydd.com**. The business trades as **Memories Funeral Booklets**. The footer
says *"Memories Funeral Booklets — with a touch of class"*. The Instagram is
**@memoriestributes**. The repo is *Memories by DD*.

That is four names for one entity, and "Memories" alone is far too generic to be resolvable. An
answer engine cannot confidently name a business it cannot pin down — and a family who hears
"Memories" in a recommendation cannot find it either.

**Pick one canonical trading name and use it everywhere** — `Organization.name`, GBP, footer, title
suffixes, Instagram bio, invoices. **Recommendation: "Memories Funeral Booklets"** — it is
descriptive, already in the footer, and contains the category term. Then `alternateName` carries the
variants:

```json
"name": "Memories Funeral Booklets",
"alternateName": ["Memories by DD", "Memories Tributes"]
```

This is a client decision (branding), so it belongs in the next client-actions round. It is cheap
now and expensive later.

### Measuring GEO

Genuinely harder than SEO, and worth saying so rather than promising a dashboard:

- **GA4 referrals** from `chatgpt.com`, `perplexity.ai`, `copilot.microsoft.com`, `gemini.google.com`
  — these appear as normal referrals. Build a segment on day one
- **Direct-traffic lift** with no matching search impressions is the usual fingerprint of an AI
  citation, since many assistants strip referrers
- **Manual prompt testing**, monthly, on a fixed list: *"where can I get a Jamaican funeral order of
  service printed in the UK?"*, *"what is a Nine Night?"*, *"cheapest funeral order of service
  printing UK"*. Record whether Memories is named. Crude, but it is the only direct read
- **Brand-query volume in GSC** — rising branded search is the downstream effect

Do not promise the client a GEO ranking report. Report citation presence and referral volume.

---

## Priority order

| # | Action | Cost | Gate |
|---|---|---|---|
| 1 | `LocalBusiness` + `Organization` JSON-LD on `/` | Low | Needs opening hours |
| 2 | `Product` + `Offer` on all 40 design pages | Low | Needs unique copy first |
| 3 | Rescue the FAQ block → `FAQPage` schema | Low | **Content already written** |
| 4 | Rewrite `robots.txt`; drop `noarchive`/`nosnippet` | Trivial | **Launch only** |
| 5 | Question-shaped `h2`s + 40–60 word answers across `/help/*` | Medium | — |
| 6 | Settle the canonical brand name | Trivial | Client decision |
| 7 | Write `/help/nine-night/` | Medium | **The single biggest GEO opportunity** |
| 8 | `llms.txt` | Trivial | Needs the turnaround truth |
| 9 | `HowTo` on `/how-it-works/` | Low | — |
| 10 | `Review` schema | Low | **Blocked — needs real reviews** |

Items 1–4 are days of work on content that already exists. Item 7 is the one that could genuinely
put this brand in front of families no competitor is reaching.
