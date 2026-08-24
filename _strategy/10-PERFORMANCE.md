# Performance & Core Web Vitals

**Why this gets its own document:** the audience is bereaved families, often older, on mobile data,
in the evening, working to a 48-hour deadline. Page speed here is not a ranking tactic — it is
whether someone in the worst week of their life can use the site at all.

All figures below are measured from `_deploy/index.html` and `_deploy/img/`, not estimated.

---

## Where we started, and where we are

| | Old WordPress site | Approved concept |
|---|---|---|
| HTML | 916 KB (homepage) | **58 KB** |
| CSS files | 36 | **1 inline block** |
| JS files | 111 | **1 inline block** |
| Inline `<style>` blocks | 21 | 1 |
| Third-party requests | Many | **1** (Google Fonts) |
| Images on homepage | 40 | 20 |

**That is a genuine, large win** — roughly a 94% reduction in HTML and the elimination of 146 render
-blocking files. The design is not the problem.

## The problem is the images

| Measured | Value |
|---|---|
| Total image weight | **2.36 MB** |
| PNG files | **10 files, 1.80 MB** |
| Images with `loading="lazy"` | **0 of 20** |
| Images with `width`/`height` | **0 of 20** |
| Images with `fetchpriority` | **0** |
| Heaviest single file | `barbados.png` — 236 KB |

So the page ships **~2.4 MB with every byte requested eagerly**, against the `02-HOMEPAGE.md` target
of **under 1 MB**. Three separate defects:

1. **No lazy loading.** All 20 images load immediately, including the four package shots and four
   process cards far below the fold. On a 4G connection that is the difference between a usable hero
   and several seconds of nothing.
2. **No `width`/`height` on any image.** The browser cannot reserve space, so every image that
   arrives shifts the layout. This is a **guaranteed CLS failure** and it is the single cheapest fix
   in this document.
3. **Product shots are PNG.** 1.8 MB across 10 files. These are photographic mockups — PNG is the
   wrong format. WebP typically saves 60–70% at visually identical quality; AVIF more.

---

## Targets

| Metric | Target | Current risk |
|---|---|---|
| **LCP** | < 2.5 s | **At risk** — hero is a 118 KB JPEG with no `fetchpriority` |
| **CLS** | < 0.1 | **Failing** — no image dimensions anywhere |
| **INP** | < 200 ms | Low risk — one small script |
| **Total page weight** | < 1 MB | **Failing — 2.4 MB** |
| **Requests** | < 30 | Passing — ~24 |
| **TTFB** | < 600 ms | Fine on Netlify CDN |

### Measure on the right device

Lighthouse on desktop broadband will say this page is fine. It is not the audience.

**Test on throttled 4G, mid-range Android, and trust field data over lab data.** Set up CrUX / real
-user monitoring at launch. A meaningful share of these visitors are on older phones on mobile data
in a hospital, a church car park or a funeral director's office.

---

## The fixes, in order of value per hour

### 1. Add `width` and `height` to all 20 images — CLS, trivial

Intrinsic dimensions, not display size. CSS keeps controlling layout.

```html
<img src="img/jamaica.png" width="1200" height="900" alt="…">
```

Fixes CLS outright. Roughly thirty minutes of work.

### 2. Lazy-load everything below the fold — weight, trivial

```html
<!-- Hero: eager, prioritised. Never lazy-load the LCP element -->
<img src="img/hero.jpeg" width="2400" height="1321" alt=""
     fetchpriority="high" decoding="async">

<!-- Everything below the fold -->
<img src="img/barbados.png" width="1200" height="900" alt="…"
     loading="lazy" decoding="async">
```

Above the fold: `hero.jpeg`, `logo.png`, and `hero-candles.jpeg` (the video poster). Those three stay
eager. **The other 17 get `loading="lazy"`.** That alone takes the initial payload from ~2.4 MB to
roughly 400 KB.

### 3. Convert to WebP with fallback — weight, high value

Expect 1.80 MB of PNG to land around 500–600 KB.

```html
<picture>
  <source srcset="img/jamaica.avif" type="image/avif">
  <source srcset="img/jamaica.webp" type="image/webp">
  <img src="img/jamaica.png" width="1200" height="900" alt="…" loading="lazy">
</picture>
```

Keep the PNGs as fallback. Netlify serves whichever the browser accepts.

### 4. Resolve the retina tension with `srcset`

`DESIGN-NOTES.md` says *"Product shots are the 600px WP variants. Re-export at 2× for retina."*
Taken literally that quadruples pixel count and makes the weight problem worse.

**`srcset` is the resolution.** Export each product shot at 600 / 1200 / 1800 and let the browser
choose:

```html
<img src="img/jamaica-600.webp"
     srcset="img/jamaica-600.webp 600w, img/jamaica-1200.webp 1200w, img/jamaica-1800.webp 1800w"
     sizes="(max-width: 700px) 90vw, 380px"
     width="1200" height="900" alt="…" loading="lazy">
```

A phone downloads the 600w file; a retina desktop gets 1200w. Nobody pays for pixels they cannot see.

### 5. Google Fonts is the only third party — and it blocks rendering

Three families are loaded: **Lora** (4 variants), **Inter** (3 weights), **Italianno** (1). The
stylesheet is render-blocking, and `preconnect` reduces but does not remove the round trip.

Two options, in order of preference:

**Self-host.** Subset to Latin, serve `.woff2` from the same origin. Removes an external domain
entirely, removes the blocking stylesheet, and is more robust. Costs ~100–150 KB of font files,
cached hard.

**Or keep Google Fonts** but make it non-blocking and cut the payload — `Italianno` is used for a
handful of single words, so subset it aggressively; drop any Lora/Inter weight not actually used.

`display=swap` is already set, which is correct — text renders immediately in the fallback. **Make
sure the fallback stack is metrically close** or the swap itself causes a layout shift, which
reintroduces the CLS problem fix 1 just solved.

### 6. Per-template weight budget

Design pages are the risk — 40 pages, each with a full gallery.

| Template | Budget | Note |
|---|---|---|
| `/` | < 900 KB | After fixes 1–4 |
| Design page | **< 800 KB** | Gallery must be lazy + `srcset`. Load 1 hero, defer the rest |
| Catalogue (40 cards) | **< 1.2 MB** | Thumbnails only, max 400w, lazy. Consider pagination |
| Category | < 900 KB | |
| `/prices/` | < 400 KB | Mostly text |
| `/help/*` | **< 300 KB** | Text. These must be the fastest pages on the site |

> **The catalogue is the one to watch.** The old site's homepage and contact page each rendered all
> 41 designs and paid the full image cost (audit E3). Do not reproduce that: thumbnails, lazy, and
> paginate or virtualise past ~24 cards.

### 7. Vimeo — do not embed 119 iframes

Design pages carry 3 Vimeo previews each. A Vimeo iframe pulls ~500 KB+ of player JS before anyone
presses play.

**Use a poster-and-click façade** — exactly what the approved hero already does. Load a static poster
image; instantiate the real player only on click. Keeps 3 videos per page nearly free.

This is also the workaround if the 403 embed problem (`05-CLIENT-ACTIONS.md`) is not resolved: the
façade degrades to a link out, which is the current homepage behaviour.

---

## Accessibility — carried forward

Already right in the approved design, and worth protecting:

| | |
|---|---|
| ✅ `lang="en-GB"` | |
| ✅ No `maximum-scale` lock | Audit E2 fixed — pinch-zoom works |
| ✅ `prefers-reduced-motion` fully honoured | Everything renders static |
| ✅ Hero contrast measured at **9.8:1 to 15:1** | Clears WCAG AAA |
| ✅ `aria-label` on all icon buttons and slider controls | |
| ✅ Decorative images have empty `alt` | Correct, not lazy |

Still to verify before launch:

- [ ] **Keyboard operation of both sliders** — spotlight and reviews. Arrows and tabs are `<button>`s,
      which is the right start; confirm focus order and visible focus rings
- [ ] **Slider live regions** — content that swaps without a page change needs `aria-live` or a
      status announcement, or screen-reader users get silent changes
- [ ] **Tap-target size** on the mobile bar — 44×44px minimum. Critical for older users
- [ ] **Focus visible** throughout, not just on hover
- [ ] Real screen-reader pass (NVDA or VoiceOver) on the finished homepage

---

## Build-stage rules for the remaining templates

So the same defects are not designed in 10 more times:

1. **Never ship an `<img>` without `width`, `height` and `alt`.**
2. **Only the LCP image is eager.** Everything else `loading="lazy"`.
3. **`srcset` on every content image.** No exceptions for product shots.
4. **No web font added without deleting one.** Three families is already the ceiling.
5. **No third-party script without a stated reason** — that includes chat widgets and review embeds.
   GA4 is the one agreed exception.
6. **Budget check before merge.** If a template exceeds its budget, it does not ship.
7. **The `/help/` pages stay text.** They are the top-of-funnel volume play and must be instant.

---

## Priority summary

| # | Fix | Effort | Impact |
|---|---|---|---|
| 1 | `width`/`height` on 20 images | 30 min | **Fixes CLS** |
| 2 | `loading="lazy"` on 17 images | 20 min | **2.4 MB → ~400 KB initial** |
| 3 | `fetchpriority="high"` on hero | 2 min | LCP |
| 4 | PNG → WebP/AVIF | 2 hrs | ~1.2 MB saved |
| 5 | `srcset` at 3 widths | 4 hrs | Mobile weight |
| 6 | Self-host fonts | 3 hrs | Removes the last third party |
| 7 | Vimeo façade | Per template | Prevents 500 KB/video |
| 8 | Real-user monitoring | 1 hr | Tells you if any of this worked |

**Items 1–3 are under an hour combined and take the homepage from a certain Core Web Vitals failure
to a likely pass.** They should happen before the page is shown to anyone else.
