# Contact Us — copy

**URL:** `/contact/` · **~500 words** · Replaces `/contact-us-2/`

**What the current page does wrong:** shows the address and both phone numbers as **plain text** —
no `tel:`, no `wa.me` — then dumps all 41 catalogue thumbnails below it. Contact Form 7 is installed
but not used. Audit A5.

---

## Meta

| Field | Copy |
|---|---|
| **Title** | Contact Us \| Memories Funeral Booklets \| 0800 023 6263 |
| **Meta description** | Call 0800 023 6263 free, WhatsApp 07552 91 6060, or email info@memoriesbydd.com. Based in Stanmore, London, printing for families across the UK. |

**Schema:** `ContactPage` + `LocalBusiness` + `BreadcrumbList`

---

## 1. Header

**Label** — Contact
**H1** — Talk to *Someone*

**Body** — There is no call centre and no ticket system. You will speak to the person who designs your
booklet. If we miss you, we will call back.

---

## 2. The three ways

| Route | Label | Sub-label |
|---|---|---|
| **Phone** | 0800 023 6263 | Freephone from UK landlines and mobiles |
| **WhatsApp** | 07552 91 6060 | Best for sending photographs |
| **Email** | info@memoriesbydd.com | For anything that needs writing down |

**Below** — Opening hours: ⛔ `[HOURS]`

**Body** — If you are calling about a service in the next few days, say so first and we will deal with
it straight away.

> ⛔ **Opening hours are not stated anywhere** — not on the current site, not in the brief. They are
> needed here, in the footer, and in `LocalBusiness` schema. An invented value would propagate into
> Google Business Profile and send a bereaved family to a phone nobody answers. **Blocked.**
>
> ⚠️ "Freephone from UK landlines and mobiles" — 0800 numbers have been free from UK mobiles since
> 2015, so this is accurate. Worth saying, because many people still assume otherwise and hesitate.
>
> ⚠️ "we will call back" is a service promise. Confirm.

---

## 3. Contact form

**H2** — Send Us a *Message*

**Intro** — For anything that is not urgent. If it is urgent, please call.

**Fields**
- Your name
- Phone number
- Email
- Is there a date for the service? *(optional — if yes, tell us and we will prioritise)*
- How can we help?
- *File upload (optional)* — a photograph, or a booklet you have seen and liked

**Button** — `Send message`

**Confirmation** — Thank you. We have your message and will come back to you today if you sent it
during the day, and first thing tomorrow otherwise. If you need us sooner, please call 0800 023 6263.

**Privacy line** — We use your details only to answer your enquiry. See our Privacy Policy.

> This is a **general enquiry** form, deliberately short. It is not the order journey — anyone ready
> to order goes to `/order/` and the 20-screen Typeform. Keep them separate; a family who just wants
> to ask a question should not meet a 20-step form.
>
> ⛔ Confirmation wording contains a response-time promise. Confirm before publishing.

---

## 4. Where we are

**H2** — Where We *Are*

**Address**
Memories Funeral Booklets
Stanmore Place, Stanmore Innovation Centre
Howard Rd
London HA7 1BT

**Body** — We are in Stanmore, north-west London. Visits are by arrangement — please call first, as
we are often out delivering.

**Body** — We print for families across the whole of the UK, with same-day delivery locally and
next-day nationwide.

**Map** — embedded, with a link to directions

> **NAP must match Google Business Profile and the footer character for character.**
> `../_strategy/07-SEO-AND-KEYWORDS.md` flags the missing GBP as the biggest local-SEO gap on the
> site — this address is the anchor for fixing it.
>
> ⚠️ "Visits are by arrangement" and "often out delivering" are inferences from it being an
> innovation-centre address rather than a shop. Confirm — if there is a walk-in space, say so.

---

## 5. For funeral directors

**H2** — Funeral Directors and *Churches*

**Body** — If you are enquiring on behalf of a family, or about trade terms, there is a separate route.

**CTA** — `For funeral directors` → `/partners/`

---

## 6. Common questions

**Can I send photographs on WhatsApp?**
Yes, and most families do. Send them to 07552 91 6060 with the name of your loved one and we will
match them to your order.

**Do I need an appointment?**
No. Call or message any time and we will take it from there. If you would like to visit, please ring
first.

**How quickly will you reply?**
⛔ `[RESPONSE TIME]` — needs confirming rather than promising.

**Do you print outside London?**
Yes. We deliver across the UK, next-day as standard, and same-day if you are near Stanmore.

---

## 7. Closing

**H2** — Whenever You Are *Ready*

**Body** — Even if you are only thinking about it, call. There is no obligation and we would rather
answer a question early than have you worrying about it.

**CTAs** — `0800 023 6263` · `WhatsApp us` · `Start Your Booklet` → `/order/`

---

## Working assumptions

| Assumption | Basis |
|---|---|
| Enquiry form kept separate from the order Typeform | Different intent, different length |
| Visits by arrangement | Address is an innovation centre, not a shop |
| 0800 free from mobiles | True since 2015 |
| No catalogue thumbnails on this page | The current page dumps all 41. Audit E3 |

## What blocks this page

| # | Item | Type |
|---|---|---|
| 1 | **Opening hours** | 🔴 Needed here, in the footer, and in schema |
| 2 | **Response-time promises** ×2 | ⛔ Confirm or soften |
| 3 | Is there a visitable premises? | ⛔ |
| 4 | Google Business Profile does not exist yet | ⛔ Biggest local-SEO gap |
| 5 | Contact form built and routed | Build |
