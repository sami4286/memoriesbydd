# Order Now — copy

**URL:** `/order/` · **Built:** `_deploy/order.html` · **~340 words** (excluding the form)
**Indexing:** `noindex, follow` — a form page has no search job.

**Why this page matters more than its word count suggests:** `03-FUNNEL.md` calls it *"the single
most valuable structural change"* — a URL short enough to say out loud, text, WhatsApp, or print on a
card with a QR code in a funeral director's referral pack. Every conversion CTA on the site points
here.

---

## Meta

| Field | Copy |
|---|---|
| **Title** | Start Your Booklet \| Memories Funeral Booklets |
| **Meta description** | Tell us about your loved one and we will design their order of service booklet. Or call 0800 023 6263 — we would much rather you did. |

---

## 1. Header

**Label** — Order Now
**H1** — Start Your *Booklet*

**Body** — Take a deep breath — there is no rush. Tell us as much or as little as you know today, and
we will guide you through the rest. Nothing is printed until you have seen it and said yes.

> The opening echoes the Typeform welcome screen the brief specifies ("Take a deep breath — there's
> no rush") so the page and the form feel like one conversation rather than a handoff.

### Three doors — deliberately above the form

| Door | Label | Sub-label |
|---|---|---|
| Phone | **0800 023 6263** | Freephone · speak to a person |
| WhatsApp | **WhatsApp us** | Send photos straight from your phone |
| Form | **Fill in the form** | Step by step, save as you go |

> This ordering is a deliberate conversion decision, not decoration. Families arranging a funeral are
> usually working to a hard deadline and most want a human first. The old site put an unlabelled
> form embed on the homepage and hid both phone numbers as plain text — the exact opposite. If the
> phone gets more use than the form, that is a success, not a leak.

---

## 2. The form

The live page embeds the **20-screen Typeform** specified in the client brief, section 2.

> ## ⚠️ Do not rewrite the form
>
> The brief is explicit: *"The developer must preserve all question wording, capitalisation,
> punctuation, emphasis, helper text and field types"*, and every label *"must be reproduced
> identically in Typeform without deviation."*
>
> **The 20 screens are therefore NOT reproduced or edited in this document.** The client brief is
> the source of truth for them. Proofread them there, not here.
>
> The prototype shows only the welcome screen, quoted verbatim from the brief, so the tone is
> visible:
>
> > **You're not alone in this.**
> > Take a deep breath — there's no rush. We'll guide you step by step, and you can always come back
> > to add or adjust details later.
> > **Button:** Click to start

### Build requirements (not copy)

- **No fixed-height iframe.** The old Fillout embed had `dynamic-resize` on and a hard `height:500px`
  wrapper fighting it. Let it resize.
- **`?design={slug}`** pre-selects the design and displays it, so someone arriving from a design page
  never re-explains what they want.
- **`?ref={partner}`** captures referral source for per-partner GA4 attribution.
- **Save and return** — the brief requires it. Families gather photos from relatives over days.
- **WhatsApp offered again at the upload step.** Photo upload is the highest-friction moment; this is
  our recommendation, **not** in the brief. *"Prefer to send photos on WhatsApp? Tap here — we'll
  match them to your order."*

---

## 3. What happens next *(aside)*

**H2** — What happens next

1. We read what you have sent and call or message you back the same day.
2. Your design is drawn up and a proof comes to you in 24–48 hours, by email or WhatsApp.
3. You ask for changes until it is right. Nothing goes to print without your yes.
4. We print and deliver — to your home, the church, or your funeral director.

> ⚠️ **"call or message you back the same day"** is a service promise nobody has confirmed. If Ashley
> cannot reliably do same-day, soften it to *"as soon as we can, usually the same day."* Flagged
> because a missed callback is exactly the failure this page exists to prevent.
>
> ⚠️ Step 2 says proof in 24–48 hours. Step 4 gives no timescale, so the **production time is
> absent** — see the turnaround note in `../_strategy/11-BRIEF-RECONCILIATION.md`.

---

## 4. Worth knowing *(aside)*

**H2** — Worth knowing

- You do not need everything ready. Start with a name and a date.
- Photos can come later, by WhatsApp, from whoever has them.
- Your proof is free, and nothing is printed until you have approved it.
- You can save the form and come back to it.

> ✅ **Corrected 25 Aug.** This bullet originally read *"Your proof is free. You only pay once you are
> happy."* That contradicted the brief, which states an order *"will not enter production until all
> items have been received"* **including full payment at the time of ordering** — so it promised
> payment after approval, which is the opposite of the actual terms. Rewritten to keep the
> reassurance without the false claim.
>
> ⛔ **Payment terms still need stating somewhere.** If payment is taken up front, a family should
> learn that before they start a 20-screen form, not at the end. Recommend one honest line here or in
> the express notice. Needs Ashley's confirmation of the actual terms.

---

## 5. If the funeral is very soon *(aside — express notice)*

**H2** — If the funeral is very soon

**Body** — Tell us the date and we will be honest with you about what is possible. We will not take
an order we cannot deliver in time.

**Body** — Where a service falls inside our standard turnaround, the order is handled as an express
job and carries a **50% surcharge**. We will always tell you this and confirm the total before
anything is agreed.

> The brief requires *"clear express-order language and the 50% surcharge rule before form
> submission"*, so this sits above the form on mobile and beside it on desktop.
>
> ⛔ Wording needs Ashley's sign-off. An undisclosed or buried surcharge on a bereavement purchase is
> a consumer-protection problem, not a content preference. The figure is the brief's.
>
> ⚠️ *"We will not take an order we cannot deliver in time"* is a strong commitment. It is the right
> thing to say and the right thing to mean — confirm he stands behind it.

---

## 6. Footer

**H2** — Rather Just *Talk*?

**Body** — Whichever way is easiest for you. If you would rather speak to someone first, please
call — we would much rather you did.

| Row | Label | Sub-label |
|---|---|---|
| Phone | 0800 023 6263 | Freephone |
| WhatsApp | 07552 91 6060 | WhatsApp your photos |
| Email | info@memoriesbydd.com | Email us |

*Address and columns as per Home.*

---

## Summary of what blocks this page

| # | Item | Type |
|---|---|---|
| 1 | **"You only pay once you are happy"** contradicts the brief's payment terms | 🔴 Commercial |
| 2 | Express surcharge wording needs sign-off | ⛔ Legal |
| 3 | "call or message you back the same day" unconfirmed | ⛔ Service promise |
| 4 | Production timescale absent from step 4 | ⛔ Accuracy |
| 5 | Typeform must be built with the brief's verbatim wording | Build |
| 6 | Opening hours missing from footer | ⛔ Data |
