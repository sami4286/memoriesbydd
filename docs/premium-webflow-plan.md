# Memories by DD — Premium Webflow plan

## Direction

Build a calm, editorial funeral-stationery experience in Webflow using the existing cream, black and muted-gold identity. The current Webflow draft is native and editable, remains unpublished, and uses the live sites as references rather than copying their layouts wholesale.

Webflow draft: `https://memories-by-dd----premium-redesign.design.webflow.com/`

## Homepage sequence

1. Compact navigation: logo, Booklets, Prices, How it works, About, Reviews and Contact.
2. Hero: “Funeral Booklets with a Touch of Class”, a concise proof/turnaround promise, and the candle hero used once as the cinematic visual.
3. Brand story: “A Tribute Worthy of Them” with the ribbon-bound booklet image.
4. Motion gallery: the dedicated candle/motion-gallery artwork used once in its correct context.
5. Booklet families: Caribbean & African, Classic, Football and Standard, each represented by its own catalogue image.
6. Process: Choose, Send, Approve, Delivered.
7. Packages and pricing.
8. Reviews and trust signals.
9. Final contact CTA and legal footer.

## Asset map

- `logo.png`: navbar and footer only.
- `hero.jpeg`: homepage hero only.
- `hero-candles.jpeg`: motion-gallery preview only.
- `booklet-ribbon.jpeg`: brand-story/editorial section only.
- `single-caribbean.jpg`: Caribbean & African category.
- `single-classic.jpg`: Classic category.
- `single-football.jpg`: Football category.
- `single-standard.jpg`: Standard category.
- Theme PNGs (`jamaica.png`, `barbados.png`, `arsenal.png`, `classic-one.png`, `white-lilies.png`, `angel-wings.png`, `domino-effect.png`, `godfather.png`): individual catalogue/CMS cards, not decorative backgrounds.
- `sharon.jpg`: founder/story section only, subject to final content approval.

## Recommended sitemap

- `/` — Home
- `/funeral-booklets` — Booklet overview and category gateway
- `/funeral-booklets/caribbean-african`
- `/funeral-booklets/classic`
- `/funeral-booklets/football`
- `/funeral-booklets/standard`
- `/packages-prices`
- `/how-it-works`
- `/motion-galleries`
- `/about`
- `/reviews`
- `/contact`
- `/funeral-directors`
- `/faq`
- `/delivery-turnaround`
- `/terms`
- `/privacy`

Webflow CMS collections should be used for Booklet Designs, Categories, Packages, Reviews and FAQs so the owner can update content without touching layout code.

## SEO priorities

Primary commercial topic: personalised funeral booklets and order of service printing in the UK.

Homepage title: `Memorial Stationery & Funeral Booklets | Memories by DD`

Homepage description: `Personalised funeral booklets, order of service stationery and memorial keepsakes, thoughtfully designed in the UK with calm one-to-one support.`

Core landing-page targets:

- Funeral booklets UK
- Personalised order of service funeral
- Funeral booklet printing
- Memorial stationery
- Caribbean funeral booklets
- African funeral booklets
- Football funeral order of service
- Funeral motion gallery

Implementation checklist:

- One unique H1 per page and descriptive H2 hierarchy.
- Descriptive image alt text based on the product/category, not keyword stuffing.
- Canonicals, Open Graph image, favicon and Webflow-generated sitemap enabled.
- LocalBusiness/Organization, Product/Offer, FAQPage and BreadcrumbList schema where applicable.
- Clean redirects from valuable WordPress URLs to the closest new Webflow URL.
- Compress large images to modern WebP/AVIF variants while retaining originals.
- Connect Google Search Console, GA4 and conversion events for phone, email and enquiry CTA clicks.
- Keep CLS low by setting image dimensions; defer below-the-fold media; target Core Web Vitals green on mobile.

## Current Webflow status

- Native editable Webflow homepage created.
- Cream/black/gold design system and responsive typography applied.
- Compact responsive navbar created with working one-page anchors and populated About dropdown.
- Correct asset placement applied; catalogue images are unique and balanced across two columns.
- Primary buttons have a gold outline, gold-filled hover state and 200ms transition.
- Desktop, 667px and 393px layouts checked.
- Homepage SEO title, meta description and Open Graph mirroring saved.
- Site intentionally remains unpublished pending review.

## Next build pass

1. Add native process, packages/pricing and reviews sections.
2. Create the Booklet Designs CMS and migrate the full catalogue.
3. Build category and design templates.
4. Add inquiry/contact form and final contact details.
5. Add restrained scroll-reveal interactions and reduced-motion fallbacks.
6. Final accessibility, SEO, link and device QA.
7. Publish only after explicit approval.
