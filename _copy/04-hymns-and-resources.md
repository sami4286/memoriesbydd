# Hymns & Resources — copy

**URL:** `/hymns-and-resources/` · **~1,100 words of new copy** wrapping ~45,400 existing words
**Page in the brief:** yes. Replaces `/hymns-poems/`, `/poems-prayers/`, `/funeral-arrangements/` and
the empty `/support-2/` shell.

**Why this page is the biggest opportunity on the site:** it holds content Memories already owns —
28,929 words of hymns, 12,586 of poems and prayers, 3,853 on bereavement benefits — all of it
currently unreachable from the navigation, sitting behind a 40-word page. Someone searching "funeral
hymns" is two to five days from needing a booklet.

---

## Meta

| Field | Copy |
|---|---|
| **Title** | Funeral Hymns, Poems & Readings \| Free Resources \| Memories |
| **Meta description** | Funeral hymns, poems, prayers and readings to choose from, plus a plain-English guide to UK bereavement benefits. Free to use, from Memories Funeral Booklets. |

**Schema:** `CollectionPage` + `BreadcrumbList`; `Article` on each child.

---

## 1. Hub header

**Label** — Resources
**H1** — Hymns, Readings and *Guidance*

**Body** — Choosing what goes into a service is one of the hardest parts of arranging a funeral, and
most people are doing it for the first time. Everything here is free to use, whether or not you order
a booklet from us. Take what helps.

---

## 2. The four sections

| Card | H3 | Body | CTA |
|---|---|---|---|
| Hymns | **Funeral hymns** | The hymns most often sung at UK funerals, with full words you are welcome to use. Browse by mood, or by tradition. | `Browse hymns` |
| Poems | **Poems, prayers and readings** | Poems, prayers, psalms and readings for a service or a graveside — including shorter pieces for a child or grandchild to read. | `Browse poems and readings` |
| Guidance | **What to write in a funeral programme** | The wording families ask us about most: the running order, a life story, a tribute, and acknowledgements. | `Read the guide` |
| Practical | **UK bereavement benefits and support** | What financial help exists after a death, who qualifies, and how to claim it. Plain English, no jargon. | `Read the guide` |

**Soft CTA below the cards** — We can set any of these into your loved one's booklet for you, laid
out properly, at no extra cost. → `/order/`

> That soft CTA is the whole commercial point of this page. One line, no pressure. It should appear
> once per child page too, never twice.

---

## 3. Child page — Funeral hymns

**H1** — Funeral Hymns
**Intro** — These are the hymns we are asked for most often. Each one includes the full words, so you
can read them before you decide, and we can set any of them into your booklet with the verses laid
out for guests to sing along.

**Answer-first block** *(for answer engines — see `../_strategy/09-AEO-GEO.md`)*

> **What hymns are usually sung at a funeral?**
> The most requested funeral hymns in the UK are *How Great Thou Art*, *Amazing Grace*, *The Old
> Rugged Cross*, *Blessed Assurance* and *Abide with Me*. Most services include two or three — one
> at the start, one after the tribute, and one at the end. Full words for each are below.

**Grouping** — split the 28,929-word library into browsable children rather than one page:

| Sub-page | Contains |
|---|---|
| Traditional hymns | *Abide with Me*, *The Old Rugged Cross*, *Rock of Ages*, *Nearer, My God, to Thee* |
| Gospel and worship | *Total Praise*, *Going Up Yonder*, *Take Me to the King*, *His Eye Is on the Sparrow* |
| Best known | *Amazing Grace*, *How Great Thou Art*, *Great Is Thy Faithfulness*, *Blessed Assurance* |
| Hymns of comfort | *It Is Well with My Soul*, *What a Friend We Have in Jesus*, *Precious Lord, Take My Hand* |
| Songs of hope | *I'll Fly Away*, *Soon and Very Soon*, *Because He Lives*, *When the Roll Is Called Up Yonder* |

**Per-hymn template**
- H2 — hymn title
- One line on where it usually sits in a service and what it feels like to sing
- Full verses
- *"We can set this hymn into your booklet with the words laid out for guests."*

**Footer line** — Not sure what to choose? Tell us a little about your loved one and we will suggest
a few. → `tel:`

> **Reconcile with the form.** The brief pre-loads a 21-option hymn dropdown "in order of frequency"
> on Typeform screen 9. Those 21 must be the same titles, spelled the same way, as the ones here —
> otherwise the form offers hymns the library does not have. The five groups above are built from
> that list.

---

## 4. Child page — Poems, prayers and readings

**H1** — Funeral Poems, Prayers and Readings
**Intro** — A reading gives someone in the family a way to take part when speaking feels like too
much. These are the pieces families choose most often, grouped by who tends to read them.

**Answer-first block**

> **What poems are read at funerals?**
> The most read funeral poems in the UK include *Do Not Stand at My Grave and Weep*, *Death Is
> Nothing at All*, *Remember Me* and *Footprints*. Psalm 23 is the most common scripture reading.
> Most services include one or two, often read by a grandchild or a close friend.

**Grouping** — Poems · Prayers and blessings · Psalms and scripture · **Short readings for a child to
read** · Non-religious readings

> That fourth group is worth calling out separately. Families ask for it constantly and almost nobody
> organises a library that way.

---

## 5. Child page — What to write in a funeral programme

**H1** — What to Write in a Funeral Programme
**Intro** — There is no single correct way to write an order of service, but there is a shape most
follow. This is that shape, with wording you can copy and change.

**Sections** — What goes on the front cover · The running order, line by line · Writing a life story
· Writing a tribute · Acknowledgements and thank-yous · What goes on the back cover

**Answer-first block**

> **What do you write in a funeral order of service?**
> A funeral order of service usually contains the front cover with their name and dates, the running
> order of the service, the words to any hymns, the readings, a short life story, and
> acknowledgements thanking those who helped. Most are four or eight pages.

**Includes example wording for:** the cover, the running order, a short life story, a longer life
story, acknowledgements, and the committal.

> Built from the nine FAQ topics currently rendering as **literal broken markup** on `/faqs/` because
> someone pasted HTML with smart quotes into the editor. The content is written; it needs rescuing,
> not writing.

---

## 6. Child page — UK bereavement benefits and support

**H1** — UK Bereavement Benefits and Support
**Standfirst** — What help is available after a death, who can claim it, and how. Last checked:
`[DATE]`.

**Intro** — Money is the last thing anyone wants to think about, and it arrives at the worst possible
time. This is a plain-English summary of what UK support exists. It is a guide, not advice — always
check the current rules on GOV.UK before you rely on anything here.

**Sections** — Bereavement Support Payment · Funeral Expenses Payment · Who counts as next of kin ·
The BB1 form and how to fill it in · What to do in the first week · Where to get free help
(Citizens Advice, Cruse, the funeral director)

**Closing line** — If you are worried about the cost of the funeral, tell us. We will work to your
budget and be straight with you about what things cost.

> ## ⚠️ Highest-risk content on the site
>
> This page gives guidance on **DWP benefits and the BB1 form**. Wrong figures mean a bereaved
> person loses money they were entitled to.
>
> - **A visible "last checked" date is not optional.** DWP rates change annually.
> - **Cite and link GOV.UK** on every claim.
> - **Never state a benefit amount** without a source and a date.
> - The existing 3,853 words are from 2020 and are **almost certainly out of date**. They must be
>   checked line by line before republishing, not carried across.
> - Add a named author and a plain disclaimer. See E-E-A-T in `../_strategy/07-SEO-AND-KEYWORDS.md`.

---

## Working assumptions

Applied here so the copy could be written through rather than left blank:

| Assumption | Basis |
|---|---|
| Resources stay free and open to non-customers | It is the top-of-funnel play; gating it destroys the point |
| Hymn library splits into 5 themed children | 28,929 words on one URL cannot rank for hundreds of queries |
| The brief's 21 hymns are a subset of the library | Otherwise the form offers what the site cannot supply |

## What blocks this page

| # | Item | Type |
|---|---|---|
| 1 | **Bereavement benefit figures must be re-verified against GOV.UK** | 🔴 Accuracy / harm |
| 2 | Named author for the guidance pages | ⛔ E-E-A-T |
| 3 | "at no extra cost" for setting hymns — confirm | ⚠️ Commercial |
| 4 | Hymn titles reconciled with the Typeform dropdown | Build |
