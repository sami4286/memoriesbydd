# Reception Hall Directory — copy

**URL:** `/reception-halls/` · **~750 words** · New page, and a **new B2B revenue product**.

**What it is:** a CMS-managed directory of reception venues, filterable by UK region, mirrored in
Airtable. Venues pay an annual listing fee. Families see relevant halls during the order journey when
they confirm a reception or wake.

**Two audiences on one page** — a grieving family looking for somewhere to hold a wake, and a venue
owner deciding whether to pay for a listing. The family comes first; the venue pitch sits below.

---

## Meta

| Field | Copy |
|---|---|
| **Title** | Funeral Reception Venues & Wake Halls by Region \| Memories |
| **Meta description** | Find a hall for a funeral reception, wake or Nine Night near you. Capacity, location and contact details for venues across the UK. |

**Schema:** `ItemList` of `LocalBusiness` per venue + `BreadcrumbList`

---

## 1. Header

**Label** — Reception Halls
**H1** — Somewhere to Gather *Afterwards*

**Body** — After the service, people want to sit down together, eat something and tell stories. Finding
a hall at short notice is one more thing to arrange in a week that is already full.

**Body** — These are venues used for funeral receptions, wakes and Nine Nights across the UK. Choose
your region to see what is near you. Contact them directly — we do not take a booking fee and we are
not an agent.

> That last sentence matters. Families should know exactly what this page is and is not, especially
> since venues pay to appear on it.

---

## 2. Region filter

**H2** — Find a Venue Near *You*

**Filter** — London · South East · South West · East of England · West Midlands · East Midlands ·
Yorkshire & Humber · North West · North East · Wales · Scotland · Northern Ireland

**Empty state** — No venues listed in this region yet. We are adding them as we go — call us on
0800 023 6263 and we may know somewhere anyway.

> The empty state will be doing a lot of work at launch. Be honest rather than showing a blank grid.

---

## 3. Listing card

Fields per venue, from the brief:

| Field | Example |
|---|---|
| Venue name | `[VENUE NAME]` |
| Location | Town, region |
| Capacity | Seats 120 · standing 180 |
| Suitable for | Reception · wake · Nine Night · repast |
| Facilities | Kitchen · own catering allowed · parking · step-free access · licensed bar |
| Contact | Phone · email |
| Website | Link |

**Card CTA** — `Contact this venue`

**Recommended additions** — *"Own catering allowed"* and *"Step-free access"* as filterable
facilities. Both are asked about constantly and neither is in the brief's field list. Catering rules
decide most Caribbean and African receptions, and step-free access matters at a funeral more than at
almost any other event.

---

## 4. Detail page per venue

**H1** — `{Venue name}`, `{Town}`
**Sections** — Photographs · About the venue (150 words, venue-supplied) · Capacity and layout ·
Facilities · Where it is, with a map · How to enquire

**Standing line** — Listings are paid for by the venue. We do not inspect venues and we cannot
recommend one over another — please visit before you book.

> ⛔ That disclaimer is not optional. This is paid placement shown to bereaved families; the
> commercial relationship must be visible. **Legal review recommended** on the exact wording.

---

## 5. Guidance for families

**H2** — What to Look for in a *Hall*

| H3 | Body |
|---|---|
| **Capacity, honestly estimated** | Funerals draw more people than families expect, and more than were at the service. Count the service congregation and add a third. |
| **Can you bring your own food?** | Many families cater themselves, or want a specific caterer. Ask before anything else — it rules venues in or out faster than price. |
| **How long do you have it for?** | Receptions run long. Check the finish time and what happens if you overrun. |
| **Getting in and out** | Older relatives, wheelchairs, and people arriving straight from the graveside. Step-free access and parking matter more than décor. |
| **A Nine Night is not a reception** | If you are holding a Nine Night, say so when you enquire. It runs later, it is louder, and not every venue is set up for it. |

> The last card is the one no competitor will have written. It is small, and it is exactly the kind of
> detail that tells a Caribbean family this site was built with them in mind.

---

## 6. For venue owners

**H2** — List Your *Venue*

**Body** — Families arranging a funeral are looking for a hall with days to spare, and they rarely
know where to start. A listing here puts your venue in front of them at the moment they are deciding.

**Body** — We show your listing to families in your region during the order process, and on this
directory. You deal with the enquiry directly — we do not take commission on your booking.

**What a listing includes**
- Your venue on the regional directory and in the order journey
- A detail page with photographs, capacity, facilities and a map
- Direct enquiries by phone and email — no commission
- Edit your details any time by emailing us

**Price** — ⛔ `[ANNUAL LISTING FEE]`

**CTA** — `Enquire about listing` → `[VENUE ENQUIRY]`

> ⛔ No fee is stated anywhere in the brief. Needed before this section can go live.
> ⛔ A venue enquiry route is needed — a separate form, not the family order Typeform.
> ⚠️ *"no commission"* is inferred from the annual-fee model. Confirm.

---

## 7. Closing CTA

**H2** — Still Looking?

**Body** — Tell us the area and roughly how many people, and we will tell you what we know. We hear
where families end up.

**CTAs** — `0800 023 6263` · `WhatsApp us`

---

## The SEO opportunity nobody has costed

Regional landing pages — `/reception-halls/london/`, `/reception-halls/birmingham/` — would target
genuinely valuable queries ("funeral reception venues London", "wake venues near me") with almost no
competition from funeral printers.

**But that adds URLs**, and the brief requires written approval for any page added. Flagging it as an
opportunity, not building it. It also only works once there are enough venues per region for a page to
be worth landing on — probably five or more.

---

## Working assumptions

| Assumption | Basis |
|---|---|
| Families come first, venue pitch below | It is a family-facing site; paid listings must not lead |
| No commission on bookings | Inferred from the annual-fee model |
| Paid-placement disclosure is mandatory | Consumer fairness |
| Regions as the 12 standard UK regions | Brief says "all UK regions" without listing them |

## What blocks this page

| # | Item | Type |
|---|---|---|
| 1 | **Venue seed data** — nothing to list | 🔴 Page is empty without it |
| 2 | **Annual listing fee** | ⛔ |
| 3 | Paid-placement disclosure wording | ⛔ Legal review |
| 4 | Venue enquiry route | ⛔ Build |
| 5 | Renewal and listing-management rules | ⛔ Brief asks the developer to advise |
| 6 | Regional landing pages need approval | ⚠️ Adds URLs |
