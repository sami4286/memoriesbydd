# Memories by DD — SEO strategy

Prepared 29 August 2026. This is the separate SEO handoff for the premium rebuild.

## Positioning

The commercial focus is **personalised funeral order of service booklet design and printing in the UK**, supported by heritage-aware designs, transparent pricing, a 24–48-hour first proof, a real designer and nationwide delivery.

The site should lead with usefulness and trust, not broad “celebration of life” language that could describe any funeral supplier. Each page has one clear search intent and one primary action.

## Launch sitemap and metadata

| URL | Primary search intent | Recommended title | H1 direction |
|---|---|---|---|
| `/` | funeral order of service booklets | Funeral Order of Service Booklets \| Memories by DD | A beautiful way to honour a life |
| `/funeral-order-of-service-booklets/` | funeral booklet printing UK | Funeral Order of Service Booklets & Printing \| Memories | Funeral booklets, made to be kept |
| `/gallery/` | funeral booklet designs | Funeral Booklet Designs & Gallery \| Memories by DD | A starting point that feels like them |
| `/how-it-works/` | how to make a funeral order of service | How to Make a Funeral Order of Service \| Memories | Begin with what you know |
| `/prices/` | funeral order of service printing prices | Funeral Booklet Prices & Packages \| Memories by DD | Clear choices, before you commit |
| `/hymns-and-resources/` | funeral hymns, readings, programme wording | Funeral Hymns, Poems & Readings \| Free Resources | Hymns, readings and guidance |
| `/tributes/` | Memories by DD story / trust | In Loving Memory \| Our Story \| Memories by DD | Why Memories exists |
| `/partners/` | trade funeral booklet printing | For Funeral Directors \| Trade Booklet Printing \| Memories | A design partner families can trust |
| `/contact/` | contact Memories by DD | Contact Memories by DD \| Funeral Booklets London & UK | Begin in whatever way feels easiest |
| `/order.html` | order/enquiry conversion | Start Your Funeral Booklet \| Memories by DD | Tell us what you know |

`/order.html` is `noindex,follow`: it is a conversion form, not a useful search landing page. The privacy notice is also excluded from the XML sitemap.

## Information architecture

Primary navigation:

1. Designs
2. How it works
3. Prices
4. Resources
5. Telephone
6. Begin a tribute

Footer-only routes: Our story, funeral directors, contact and privacy. Call, WhatsApp and Start remain visible on mobile.

## Search-content growth plan

### Cluster 1 — funeral programme planning

- What goes in a funeral order of service?
- Funeral order of service wording examples
- How many pages should a funeral booklet have?
- How many photographs should a funeral booklet include?
- How to write a short life story for a funeral

Every article should link naturally to `/how-it-works/`, `/prices/` and the enquiry route.

### Cluster 2 — hymns, readings and faith

- Best-known funeral hymns in the UK
- Gospel funeral hymns
- Short funeral readings for a child to read
- Non-religious funeral readings
- Funeral acknowledgements wording

Split large hymn libraries into focused, genuinely useful pages. Do not publish dozens of thin pages or copyrighted lyrics without checking rights.

### Cluster 3 — heritage and culturally specific services

- Jamaican funeral order of service booklets
- Ghanaian funeral booklet designs
- Caribbean funeral and Nine Night stationery
- How culture and faith shape a funeral programme

These pages must contain real cultural context and distinct imagery. Changing only a flag or colour is not enough to justify an indexable page.

### Cluster 4 — trade partnerships

- Order of service printing for funeral directors
- White-label funeral booklet design
- Church funeral programme printing

Publish specific trade terms only after the offer is approved. Clarity converts better than “contact us for details.”

## On-page rules

- One descriptive, concise title and one visible H1 per page.
- Put the direct answer to the page’s main question near the top.
- Use the phrases families naturally use—“funeral booklet,” “order of service,” “funeral programme”—without repeating them mechanically.
- Every image gets a factual alt description; decorative images use empty alt text.
- Internal links describe their destination. Avoid repeated “learn more.”
- Do not publish fake testimonials, locations, awards or review schema.
- Price statements use “from” until every quantity and add-on has been confirmed.
- Treat “24–48 hours” as the **first proof** promise, never total delivery time.

Google recommends concise, descriptive titles, clear main headings and avoiding boilerplate or keyword stuffing: [title link guidance](https://developers.google.com/search/docs/appearance/title-link).

## Structured data

- Home: `Organization`, `LocalBusiness`, and the core `Service`.
- Contact: `LocalBusiness` with consistent name, address and phone.
- Booklet/service pages: `Service` plus `BreadcrumbList`.
- Resources hub: `CollectionPage`; articles use `Article` only when an author and reviewed content exist.
- Product/package schema only after prices, availability and product definitions are stable.
- Never add `Review` or `AggregateRating` until reviews are genuine and visible on the page.

Follow Google’s [LocalBusiness documentation](https://developers.google.com/search/docs/appearance/structured-data/local-business) and [structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

## Technical SEO

- Keep one canonical HTTPS hostname: `https://memoriesbydd.com`.
- 301 old WordPress URLs to the closest new destination; do not send every retired page to home.
- Keep redirects for at least a year and preferably indefinitely. See Google’s [site move guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).
- Submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools. The sitemap contains only canonical, indexable URLs, following [Google’s sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- Monitor 404s and redirect chains after launch.
- Preserve image dimensions to prevent layout shift.
- Target good real-user Core Web Vitals for LCP, INP and CLS; see [Google Search guidance](https://developers.google.com/search/docs/appearance/core-web-vitals).
- Do not add analytics until consent behaviour and the privacy notice match the actual setup.

## Launch checklist

- [ ] Confirm all displayed prices and package contents.
- [ ] Confirm 24–48 hours means first proof after essential content is received.
- [ ] Confirm the business/trading legal name and the published Stanmore address.
- [ ] Confirm whether partner names and trade terms may be published.
- [ ] Connect the production domain and force HTTPS.
- [ ] Test every redirect from the old sitemap.
- [ ] Verify canonical URLs and robots directives on every template.
- [ ] Submit sitemap and request indexing for the core commercial pages.
- [ ] Connect Airtable through a server-side endpoint; never expose an Airtable token in browser code.
- [ ] Update the privacy notice before that integration goes live.
- [ ] Configure conversion events: phone click, WhatsApp click, enquiry start, form step completion and successful submission.
- [ ] Collect real customer feedback with written permission; add it only after verification.

## Phase-two pages, not launch filler

A blog, reception-hall directory and 40 individual design pages can become strong acquisition channels, but only when they have real content or data. Empty directories and 40-word design pages create thin-content risk. Build them from an Airtable/CMS source once venue records, unique design descriptions and maintenance ownership are ready.
