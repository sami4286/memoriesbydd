# Design Items ×40 — copy

**URL pattern:** `/gallery/{slug}/` · Replaces `/menu/{slug}/`
**Source data:** `../_archive/data/designs.json` — 40 records, rebuilt 24 Aug from the live REST API.

**The problem this document solves:** the existing descriptions average **40 words** (min 29, max
56), five of them are word-for-word duplicates, and several read awkwardly. Forty pages carrying 40
words each is thin content at scale.

---

## The template

Every design item follows this, whichever tier it is in.

| Slot | Content |
|---|---|
| **Breadcrumb** | Home › Gallery › `{Range}` › `{Design}` |
| **H1** | `{Design}` Funeral Order of Service Booklet |
| **Gallery** | Cover shot first, then the package composite, then interior spreads |
| **Intro** | 1 sentence — who this design suits |
| **Description** | 120–250 words, unique |
| **Spec table** | Size · Photo allowance · Suitability · Proof time · Delivery |
| **Primary CTA** | `Order this design` → `/order/?design={slug}` |
| **Secondary** | `0800 023 6263` · `WhatsApp us` |
| **Price anchor** | From £122 for 50 → `/price-list/` |
| **Related** | 3–4 from the same range |

**Spec table wording** (constant across all 40, values from `designs.json`):

| | |
|---|---|
| Size | A5, 148 × 210mm |
| Photographs | 12 in a gallery page, plus one individual portrait |
| Suitable for | Burial, cremation or memorial service |
| Your proof | 24–48 hours |
| Delivery | Next-day UK, or same-day locally |

**Meta pattern**
- Title: `{Design} Funeral Order of Service Booklet | Memories`
- Description: `The {Design} order of service booklet — {8-word hook}. Designed by hand, your proof in 24–48 hours, from £122 for 50.`

**Schema:** `Product` + `Offer` (`priceCurrency: GBP`, `lowPrice: 122`) + `BreadcrumbList`.
**Never** `AggregateRating` — there are no per-design reviews.

---

## Tiering

Per `../_strategy/12-SITEMAP-V2.md`. All 40 URLs stay resolvable; content effort goes where search
demand is specific.

| Tier | Designs | Words | Why |
|---|---|---|---|
| **Full** | 9 Caribbean & African + 6 football | 150–250 unique | People search these by name |
| **Gallery** | 22 Standard + 3 Classic | 60–120 | Chosen visually, not searched by name |
| **Retired** | Gemini Orange | — | 301 → Black Beauty |

---

## Tier 1 — Caribbean & African (9)

Written copy below. Each keeps the flag symbolism from the original but adds what the original never
had: who it suits, and what the send-off it is made for actually involves.

### Jamaica
Green, gold and black — the colours everybody recognises, and the ones that say home without a word
being spoken. Green for the land, gold for the sun, black for the strength of the people who came
from it.

For a Jamaican send-off the booklet does more work than it does at most funerals. It is passed round
at the service, taken to the Nine Night, and kept in a drawer for years afterwards. So this design
gives you room — twelve photographs in the gallery, a full portrait on the cover, and space for a life
story that runs longer than a paragraph.

Chosen most often by families who want the flag present but not shouting: the colours run through the
borders and the gold detailing rather than covering every page.

**Meta hook** — the green, gold and black of home

### Trinidad
Red, white and black — independence, the sea that surrounds the island, and the earth it stands on.
It is a flag that suits a strong personality, and it works equally well for a man or a woman.

There is a warmth to these colours that families tell us feels right for someone who filled a room.
The red carries through the borders and the section headings, with the black grounding the type so
photographs stay the brightest thing on the page.

Good for a larger service where the booklet needs to be readable from the back of a church.

**Meta hook** — independence, fire and earth

### Barbados
Ultramarine and gold, with Neptune's trident at the centre — the sea, the sand, and a symbol of
breaking with the past. Quietly one of the most elegant flags in the Caribbean, and it makes a
restrained, dignified booklet.

The blue does most of the work here, which means photographs sit against it particularly well. If the
photographs you have are older or faded, this is the design that flatters them most.

Chosen often for a memorial service some weeks after the funeral, where the tone is more celebration
than grief.

**Meta hook** — the blue and gold of the island

### Grenada
Red, gold and green with the nutmeg — a flag with more life in it than almost any other, and a design
for someone who had the same. If your loved one was the one who got everybody dancing, this is the
one.

The gold border frames every page, and there is generous room for photographs across the years —
which matters, because these are the services where people bring pictures nobody has seen in decades.

Works for men and women equally, and reads well at a Nine Night as much as at the service.

**Meta hook** — life, vibrance and energy

### St Lucia
Blue, gold, black and white — the sea and sky, the sun, and the two peaks of the Pitons rising out of
them. One of the few flags that is genuinely a landscape, and it gives the booklet a calm that suits
a quieter service.

The design keeps a lot of white space, so it is the most understated of the Caribbean range. Families
who find the brighter flags too much usually settle here.

**Meta hook** — sea and sky, and the Pitons

### Antigua
Black, blue, white, red and gold — African ancestry, hope, and the sun rising on a new era. A flag
built out of meaning rather than decoration, and a booklet that carries some of that weight.

The rising sun motif sits well on a cover, and the black ground makes gold type look genuinely
expensive. Suits a formal service and an older congregation.

**Meta hook** — African ancestry, hope and a new era

### Dominica
Green, gold, black, white and red, with the sisserou parrot — liberty, salvation, and the blood of
those who came before. The most distinctive flag in the range and one of the most personal.

Dominican services are often smaller and closer, and this design is built for that: fewer, larger
photographs rather than a crowded gallery, and space for words from more than one person.

> ⛔ **Do not publish yet.** Six of Dominica's seven images are 404 on the live site, including the
> hero. Needs a full re-export. `05-CLIENT-ACTIONS.md` item 1.

**Meta hook** — liberty, salvation and the blood of heroes

### Nigeria
Green and white — the forests and the fields, and peace between them. Simple, confident, and unlike
the Caribbean flags it works best when given room rather than decoration.

For a Nigerian send-off the booklet often has to hold a great deal: several tributes, a long life
story, contributions from family here and at home. This design takes the extra pages without looking
crowded.

> ⛔ **Do not publish yet.** Six of seven images are 404, including the hero. Needs a full re-export.

**Meta hook** — the green and white of home

### Ghana
Red, gold and green with the black star — the blood of those who fought, the mineral wealth, the land,
and the star of African freedom. Deep, rich tones that photograph beautifully in print.

The black star is the detail families comment on most, and it sits well small — on the cover, on
section dividers, and on a matching bookmark.

Suits a large service, and pairs naturally with a pull-up banner in the same colours.

**Meta hook** — the black star of African freedom

> **Rasta Theme** is the tenth design in this range. Its hero image is 404 on the live site, so copy
> is deferred until artwork exists.

---

## Tier 1 — Football (6)

> ## ⛔ HOLD — do not write or publish these six
>
> Arsenal, Chelsea, Tottenham, Liverpool, Manchester United and Manchester City club names, crests
> and colours are **registered trade marks**, and Premier League clubs enforce them actively.
>
> `../_strategy/07-SEO-AND-KEYWORDS.md` flags this. Writing optimised copy targeting
> "*[club]* funeral order of service" is precisely how an unlicensed product gets noticed.
>
> **A legal view is needed before any copy is written for these six pages.** If they are not
> licensed, the likely outcome is descriptive-only copy ("red and white club colours") with no club
> name, crest or badge — which changes both the product and the SEO case entirely.

---

## Tier 2 — Standard and Classic (25)

These keep their existing descriptions from `designs.json`, lightly edited: leading stray full stops
removed, "WHITE LILLIES" corrected to "White Lilies", and obvious typos fixed (St Lucia's original
reads "Sain Lucian").

**Five need rewriting because they are duplicates.** Written below.

### Classic One
The quietest booklet we make. Black type on cream, a single portrait on the cover, and nothing else
competing for attention. No border, no motif, no colour.

Chosen for formal church services and by families who feel that anything decorative would be wrong
for the person they are burying. It is also the design most often chosen for men.

Four pages is usually enough; the layout is built so a short service does not look thin.

### Classic Two
Classic One with a gold rule. The same restraint — cream stock, formal type, one portrait — but a
thin gold line frames the cover and each interior page, which lifts it without making it ornate.

The middle of the three: more presence than Classic One, less than Classic Three. This is the one
most families pick when they cannot decide.

### Classic Three
The most formal of the three. A deeper cream, a heavier cover, and a full gold border with the
portrait set into it.

Built for a long service in a large church — a full order of service, several hymns with all verses
printed, two or three tributes and a proper life story. It carries sixteen or twenty pages without
looking padded.

> ⚠️ Classic Three's hero image is `Design-two-comp.png`, which appears to be **Classic Two's**
> artwork. Confirm before publishing. `05-CLIENT-ACTIONS.md` item 3.

### Rose & Sleek
Soft rose against charcoal — the only design in the range that pairs a floral with something genuinely
dark, which is why it suits people who would have found a pure floral too sweet.

Not part of the Classic range despite sharing its restraint. Chosen most often for women, and
particularly for a mother or grandmother where the family want warmth without pastel.

Generous photograph allowance, and the charcoal makes older photographs look considered rather than
faded.

### Black Beauty
Gold on black — the most striking booklet we make, and the one families choose when they want the
booklet itself to feel like an occasion.

The gold is used properly: type, borders and dividers, against a deep black ground that makes a
single portrait on the cover look like a framed photograph. It suits a large celebration of life
rather than a quiet service.

Chosen across the whole range of services, and one of our most requested designs.

> **Gemini Orange is retired.** It carried the same description and the same hero image as Black
> Beauty, had no category, and never appeared in the catalogue. 301 → `/gallery/black-beauty/`.

---

## Working assumptions

| Assumption | Basis |
|---|---|
| Tiering by search specificity | `../_strategy/12-SITEMAP-V2.md`; depends on positioning sign-off |
| Nine Night / send-off context is accurate | Written from the audit's cultural findings. **Ashley must check every cultural claim** |
| Spec values as returned by the live API | `designs.json`, fetched 24 Aug |
| Football copy deferred pending legal | Trademark risk |

## What blocks these pages

| # | Item | Type |
|---|---|---|
| 1 | **Football trademark position** | 🔴 6 pages cannot be written |
| 2 | **Nigeria, Dominica, Snow Flake, Rasta Theme hero images 404** | 🔴 4 pages cannot publish |
| 3 | **Cultural claims need Ashley's review** | 🔴 I am not the authority on a Jamaican send-off |
| 4 | Classic Three hero may be Classic Two's artwork | ⛔ |
| 5 | Golden Ocean hero is Rose & Sleek's artwork | ⛔ |
| 6 | Positioning sign-off — determines tiering | ⛔ |
