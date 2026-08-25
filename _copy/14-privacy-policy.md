# Privacy Policy — copy brief, not copy

**URL:** `/privacy-policy/` · Keeps the existing slug. Footer only, not in the nav.

> ## This document is deliberately not finished copy
>
> A privacy policy is a **legal document**, not a page I should write and hand over as done. Getting
> it wrong exposes the client to regulatory risk, and the new site processes considerably more
> personal data than the current one.
>
> What follows is what the policy **must cover** based on what the site actually does, so a lawyer or
> a compliance service can produce it quickly and accurately. The existing 2,572-word policy is a
> starting point but it is out of date in several material ways.

---

## Why it cannot simply be carried over

The current policy predates everything the brief introduces. The new site processes:

| New processing | Introduced by |
|---|---|
| **Typeform submissions** — name, phone, email, service date, venue | Brief section 2 |
| **Uploaded photographs of the deceased and family** | Screens 4, 5, 11, 12 |
| **Uploaded documents** — tributes, eulogies | Screens 11, 12 |
| **Airtable as the central data store** | Brief section 4 |
| **Make or Zapier** passing data between systems | Brief section 3 |
| **Canva API** receiving order content | Brief section 3 |
| **Avaza** project records | Brief section 3 |
| **Gmail** — automated quotes and a five-email after-sales sequence over three months | Brief section 5 |
| **Placeit or Adobe Express** for mockup generation | Brief section 3 |
| **GA4** with conversion events | `03-FUNNEL.md` |
| **Reception hall venue contact data** | Brief section 6 |

Several of these are **new data processors in new jurisdictions**. The policy must name them.

---

## What the policy must cover

### 1. Who we are
Identity and contact details of the controller — Memories Funeral Booklets, the Stanmore address,
info@memoriesbydd.com. ⛔ Confirm the **registered legal entity name**, which may differ from the
trading name.

### 2. What we collect
- Contact details: name, phone, email, postal address
- Order details: service date, venue, interment location
- **Photographs and documents** uploaded by the customer
- **Details of the deceased**: full name, nickname, dates of birth and death
- Website analytics and referral source

### 3. The special-category question
> ⛔ **This needs a proper legal answer, not my guess.**
>
> UK GDPR protects the personal data of **living** individuals, so information about a deceased person
> is generally out of scope. But the data here is not that simple: a family photograph identifies
> **living** relatives, a tribute names living family members, and the fact of a bereavement is
> information about the living customer. Religious content — hymns, prayers, scripture — may reveal
> religious belief, which **is** special-category data under Article 9.
>
> **Get a view on this.** It affects the lawful basis, retention, and whether explicit consent is
> needed at upload.

### 4. Lawful basis
Contract for fulfilling an order; legitimate interests for service improvement; **consent** for
marketing — specifically the five-email after-sales sequence, which needs its own opt-in and cannot
ride on the order.

### 5. Who we share it with
Name every processor: Typeform, Airtable, Make or Zapier, Canva, Avaza, Google (Gmail, Analytics),
Placeit or Adobe Express, the print supplier, and the delivery carrier. State where each stores data
and whether it leaves the UK.

### 6. Retention
⛔ `[RETENTION PERIODS]` — needs deciding. Specifically:

- How long uploaded photographs are kept. Families often want reprints years later, which argues for
  long retention — but that must be stated, justified and consented to, not assumed.
- How long Airtable order records are kept.
- What happens to Canva designs.
- The brief says designs are held on file for reprints, so **retention is a product feature**. It has
  to be reflected honestly here.

### 7. Rights
Access, rectification, erasure, restriction, portability, objection, and how to exercise them.
Plus the right to complain to the ICO, with the ICO's details.

### 8. Cookies and analytics
GA4, the conversion events in `03-FUNNEL.md`, and the consent mechanism.

> ⛔ **A cookie banner is required and does not currently exist.** GA4 needs consent before it fires.
> This is a build item as much as a policy item.

### 9. Marketing
The five-email sequence over three months after delivery, its opt-in, and how to unsubscribe.

> ⚠️ **Worth flagging to Ashley on tone as much as compliance.** A marketing email arriving three
> months after a funeral could land badly if it feels like selling. The brief describes step 5 as an
> "anniversary touch-point", which can be done kindly — but consent must be genuine and unsubscribing
> must be effortless.

### 10. Venue data
Reception hall listings hold business contact data, and named individuals at those venues. Covered
separately from customer data.

---

## Page copy that does need writing

Two short, human pieces, separate from the legal text:

**A plain-English summary at the top of the policy**

> **The short version.** We use your details to design and deliver your booklet, and to answer your
> questions. We keep your photographs so we can reprint if you ask us to later. We do not sell your
> information to anyone. If you want your data deleted, email us and we will do it.

**A privacy line at the point of upload**, on the order form

> Your photographs are used only to design your booklet. We keep them so you can order reprints
> later, and you can ask us to delete them at any time.

> These two are the only parts of this page most people will read. Worth getting right, and they
> should be checked against whatever the lawyer produces so the plain-English version does not
> promise something the policy contradicts.

---

## What blocks this page

| # | Item | Type |
|---|---|---|
| 1 | **Legal review** — this must not be written by me or by the client from a template | 🔴 |
| 2 | **Registered legal entity name** | ⛔ |
| 3 | **Special-category data question** — photographs, religious content | ⛔ Legal |
| 4 | **Retention periods**, especially for photographs | ⛔ |
| 5 | **Cookie consent banner does not exist** | ⛔ Build + compliance |
| 6 | Marketing consent for the after-sales sequence | ⛔ |
| 7 | Full processor list confirmed once the stack is final | ⛔ |

**Recommendation:** brief a solicitor or a compliance service with the processor table above once the
tech stack is locked. It is a small cost against the exposure of a homemade policy on a site handling
photographs of people's dead relatives.
