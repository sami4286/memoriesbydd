# Design Concept — Notes for the Webflow Build

**File:** `landing-concept-02.html` — open it directly in a browser (assets are in `_design/img/`).
`landing-concept-01.html` is the earlier, plainer pass; kept only for comparison.

Design language follows the **ZENkai** reference. Everything below is expressed as tokens and
reusable classes so it maps cleanly onto Webflow classes/variables.

---

## Tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#faf8f5` | Page ground (replaces white) |
| `--bg-band` | `#f4f1ec` | Alternating band (reviews section) |
| `--bg-plate` | `#ece5d9` | Tinted plate behind product shots (deepened so products read apart from cream cards) |
| `--cream` | `#faf8f5` | Cards, and text on dark |
| `--ink` | `#2a2a2a` | Dark sections + all body text (replaces black) |
| `--ink-soft` | `#343434` | Image plate inside the dark package tier |
| `--brand` | `#ca9e67` | Gold from the logo — buttons, dots, rules, stars |
| `--brand-deep` | `#b0864f` | Gold text on light grounds (contrast) |
| `--border` | `#e2ddd4` | Card borders |
| `--rule` | `#d8d2c8` | Arrow buttons, price rules |

**Type:** `Lora` headings · `Inter` body · **`Italianno`** for the script word.
**Motion:** `--ease-out: cubic-bezier(.16,1,.3,1)` for everything that travels.

---

## The four signature moves

### 1. Serif + script mixed headings
One word per heading set in Italianno at `1.5em`, `line-height:.7`, `vertical-align:-.06em`.

```html
<h2 class="h1">A Tribute <span class="sc">Worthy</span> of Them</h2>
```

Used on: *Class* (hero) · *Worthy* (story) · *Them* (ranges) · *&* (spotlight) ·
*Care* (promise) · *in* (packages) · *Deserved* (reviews) · *Conversation* (footer).

> The logo's own "Memories" script and the gold "Mum" lettering on the family photo are both
> English roundhand — so this pairing is already the brand's own handwriting, not a borrowed style.

### 2. Sentence-case serif labels
Small serif labels above each heading (`Our Story`, `Our Ranges`, `Packages`) — **not**
uppercase letterspaced gold. Understated, exactly as the reference.

### 3. Dot-and-line link — `.dlink`
The primary interaction. The dot is **vertically centred on the line** and **glides smoothly to
the right end on hover** over 0.6s.

```
rest   ⊙————————————        hover   ————————————⊙
```
Geometry: `--dot:10px`, `bottom: calc(var(--dot) / -2)` puts the dot's centre exactly on the
1px `border-bottom`; hover moves `left: 0 → calc(100% - var(--dot))`.

Context variants set the dot's inner fill so it reads correctly on any ground:
`.dlink--onDark` · `.dlink--plate` · `.dlink--card`.

Used in body sections only — **not in the nav**. The nav links already carry a bottom rule, so a
dot-line link there read as crowded.

### 3b. Nav actions — circular outline icon buttons `.iconbtn`
46px circles, 1px outline, hover lifts 2px and turns gold. Two of them:

| Button | Icon | Style |
|---|---|---|
| `tel:08000236263` | phone | neutral outline → gold on hover |
| `#order` | open book | `.iconbtn--primary`, gold outline → **fills gold** on hover |

Each has an `aria-label` plus a `.iconbtn_tip` label that fades in underneath on hover, so the
phone number and "Start your booklet" are still discoverable without permanent text competing
with the nav rule.

### 4. Asymmetry
Offset image pairs (`.story_imgs .b` drops 4.5rem), staggered product plates
(`:nth-child(even)` drops 3.25rem), staircased cards (`.pcard:nth-child(2n)` rises 2.5rem),
and the dark package tier lifted 2rem out of the row.

---

## Motion system

Declarative — add an attribute, no per-element JS.

```html
<h2 data-anim="up">…</h2>                    <!-- up | fade | right | scale -->
<div data-anim="up" style="--d:140ms">…</div> <!-- manual delay -->
<div class="plates" data-stagger="110">…</div><!-- auto-ramps children: 0,110,220,330 -->
```

- **IntersectionObserver**, `threshold .12`, `rootMargin 0 0 -8% 0`, unobserved after firing — reveals once, never replays.
- **Hero plays on load** (not on scroll) plus a 2.6s image settle from `scale(1.07) → 1`.
- **`.rmask`** wraps images: overflow hidden, inner image eases `scale(1.12) → 1`.
- **Hover motion:** plate arrows slide 6px, cards lift 6px, product images scale 1.05, footer contact rows nudge in 0.5rem.
- **Scroll indicator** — pulsing dot + drawing line, 2.8s loop.
- **`scroll-behavior:smooth`** with `scroll-padding-top:6rem` so anchors clear the sticky nav.
- **Nav** gains a soft shadow past 12px scroll; the active link's gold underline wipes in left→right and follows the section in view via a second observer.
- **`prefers-reduced-motion`** is fully honoured — everything renders visible and static.

**Verified in headless Chrome:** the hero receives `.is-in` on load, and auto-stagger injected the
expected ramps (plates 0/110/220/330, process cards 0/120/240/360, packages 0/130/260).

---

## Sections

| # | Section | Reference it follows |
|---|---|---|
| 1 | Nav — logo left, centred menu on a rule, two icon buttons right | ZENkai nav |
| 2 | Hero — centred heading, lead bottom-left, video bottom-right | ZENkai hero |
| 3 | Story — label, offset image pair, script heading, `.dlink` | "A New *Rhythm* of Living" |
| 4 | Ranges — 4 staggered portrait plates | "Curated *Classics* Reimagined" |
| 5 | Spotlight — `01/04`, image left, copy, mood image, arrows | "Warm Japandi" slider |
| 6 | Promise — dark band, 2×2 staircased cream cards | "Our Promise of *Quality*" |
| 7 | Packages — plate per tier, dark featured tier lifted | new, in the same language |
| 8 | Reviews — editorial pull-quote with working rotator | "Warm Japandi" structure |
| 9 | Footer — dark, script heading, contact rows, link columns | ZENkai footer |
| — | Mobile bar — Call / WhatsApp / Start | from the funnel audit |

### Hero layout
Three zones, matching the reference: **centred display heading**, **lead paragraph + trust dots
bottom-left**, **video card bottom-right**, with the scroll indicator between them.

The image is `img/hero.jpeg` — supplied by Sami as `iloveimg-compressed/AdobeStock_135534675.jpeg`
(10000 × 5503, 839 KB) and downscaled here to **2400 × 1321 at 120 KB**, which is the largest size
the hero can actually use. `object-position: center`, settling from `scale(1.08) → 1` over 3s on load.

**The scrim is inverted from the usual pattern, on purpose.** Measured brightness across the image
runs `45 / 77 / 113 / 74 / 66 / 22` top→bottom, so the *brightest* band sits exactly where the
centred headline goes. A conventional radial (light centre, dark edges) would have washed the type
out. The radial is therefore **darkest through the middle** (.50 → .30 outward) and the corners stay
open so the photograph still reads.

Contrast measured on the actual composited render at 1440 × 900, sampling background pixels only:

| Zone | Background | Contrast vs cream type |
|---|---|---|
| Headline band | `rgb(61,52,39)` | **11.5 : 1** |
| Bottom-left lead | `rgb(36,34,32)` | **15.0 : 1** |
| Bottom-right video card | `rgb(82,59,38)` | **9.8 : 1** |

All three clear WCAG AAA (7:1), and the backgrounds are warm mid-darks rather than crushed black,
so the image is still visible behind the type.

`alt` is deliberately empty — it is a decorative background sitting behind the headline.
The previous hero (`hero-booklet.jpeg`) is no longer referenced and is not shipped.

### Hero video card
242px, 16/9, thin cream border going gold on hover, with a circular play button that fills gold.
The poster runs a slow 18s drift (`heroVideoDrift`) so it reads as ambient video.

**It is poster-driven, not an embed — deliberately.** Every one of his 119 Vimeo previews returns
**403** to embedding, tested with and without a `memoriesbydd.com` referer, and the oEmbed API
returns 404. They are private or domain-locked. So the card currently links out to the Vimeo page.
See "Still to do" — this needs resolving before launch or the videos break site-wide.

### Range cards — portrait, single booklet cover
Cards are **3:4 portrait**, full-bleed, each showing **one upright booklet cover** rather than the
wide package composite.

Finding those took a pixel scan, because the filenames don't tell you what's inside. Sampling the
subject bounding box across the library separates two families cleanly:

| Family | Subject | What it is |
|---|---|---|
| `*-sq1`, `*-Square1` | 96% × 81%, ratio **1.19** | two-page **spread** — wrong shape for a portrait card |
| `*-sq4/5/6`, `*-Square5` | ~72% × ~96%, ratio **0.74** | single **upright cover** — what we want |
| `*7-1` | 52% × 57%, ratio 0.91 | small item, probably the bookmark |

Selected: `ssquare5-1` (Caribbean & African) · `sq4` (Classic) · `Arsenal-Square5` (Football) ·
`White-Lillies-sq6-1` (Standard).

⚠️ **All of them sit on a grey studio backdrop** (`#a8a8a8`→`#dbdbdb` gradient) — there are no
cut-out or white-background single covers anywhere in his library. So the cards are full-bleed and
the grey backdrop becomes the card ground, which reads as a deliberate lookbook treatment rather
than a fight with the asset. If Ashley can export covers on white or transparent, the cards can
switch to a tinted plate to match the rest of the page.

### Promise cards — the 2/4 overlap fix
Cards 2 and 4 sit in the right column and are raised with `margin-top:-2.5rem`. Previously the grid
stretched them (`align-items` default), so each raised card grew 2.5rem taller and card 2's bottom
collided with card 4's top — they read as one block. Adding **`align-items:start`** to `.pcards`
stops the stretch, so all four are separate with the 1.75rem gap intact.

The stagger uses `margin-top`, not `transform`, because `[data-anim].is-in{transform:none}` would
otherwise wipe a transform-based offset the moment the reveal fired.

**Card / image separation.** The plate behind each product was `#f2efe9` against a `#faf8f5` card —
barely 3 values apart, so the product melted into the card. The plate is now `--bg-plate:#ece5d9`
with a `1px rgba(42,42,42,.09)` hairline. Verified computed: card `rgb(250,248,245)` vs plate
`rgb(236,229,217)`. The same deeper plate + hairline is applied to the package tiers.

### Range spotlight — now a working slider
Four ranges (Caribbean & African, Classic, Football, Standard), each with its own cover, package
image, title with script word, two paragraphs and a "Mood" line. Driven by **prev/next arrows,
four named tabs, and a counter** — the tabs let someone jump straight to a range instead of
clicking through. Content cross-fades via `.is-swap` (opacity + 12px rise, 320ms).

Verified by driving it headlessly: `01/04 → 02/04 → 03/04 → tab[3]=04/04 → prev=03/04`, with the
hero image, title and counter all updating in step.

### Reviews — rebuilt
Cards are gone. Now a two-column editorial pull-quote: left is the label, script heading, `01/03`
counter, arrows and dots; right is a single large italic quote above a hairline rule with a gold
Italianno quote mark. **The rotator works** — arrows and dots cross-fade between three reviews and
update the counter.

The candle image is still used, at `opacity:.2`, behind the dark Promise band.

---

## Carried over from the audit

Non-negotiables from `_strategy/03-FUNNEL.md`, all present:

- Real `tel:08000236263` links — **3** (nav icon button, footer, mobile bar)
- Real `wa.me/447552916060` links — **2** (footer, mobile bar)
- Mobile sticky bar: Call · WhatsApp · Start
- A conversion action at every scroll depth; every package tier has its own CTA
- Exactly one `<h1>`, clean `h2`/`h3` descent, descriptive alt text throughout
- `lang="en-GB"`, no `maximum-scale` lock

---

## Still to do

- ⚠️ **Vimeo videos are all 403.** His 119 Motion Gallery / Motion Obituary previews refuse to embed —
  tested with and without a `memoriesbydd.com` referer, plus oEmbed (404). They are private or
  domain-restricted. Two consequences: the hero video card is poster-driven for now, and **the new
  Webflow domain must be added to Vimeo's allowlist (or the videos made public/unlisted) before
  launch**, otherwise every design page loses its previews. Needs Ashley's Vimeo account access.
- **Not visually verified since the ZENkai rebuild** — image review is capped for the session. Verified by driving the page headlessly instead: 22 assets resolve, braces balance 311/311, one `<h1>`, no JS errors, both sliders cycle correctly, nav logo computes to 75px, footer logo `filter:none`, and the card/plate colours are measurably distinct. Please eyeball it in a browser.
- **Ask Ashley for single booklet covers on white or transparent** — see "Range cards" above. It would let the range cards and the spotlight use the same tinted-plate treatment as the rest of the page.
- The hero heading sits over a cream product shot. It reads well behind the double scrim, but if it feels heavy, the candle image is the lighter-touch alternative.
- Confirm the family photo caption naming **Sharon Delrose Patricia Whittick** with Ashley before this goes anywhere public.
- Testimonials are placeholders — real quotes needed (`_strategy/05-CLIENT-ACTIONS.md`, item 9).
- Spotlight and reviews arrows are static; wire them up in Webflow.
- Product shots are the 600px WP variants. Re-export at 2× for retina.
- The plates use `mix-blend-mode:multiply` to sit the mockups on the tinted ground — if any product art gets a true transparent background, drop the blend.
