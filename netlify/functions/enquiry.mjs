const MAX_BODY_BYTES = 24 * 1024;
const MAX_KEYS = 30;
const ALLOWED_SERVICE_TYPES = new Set(['Burial', 'Cremation', 'Memorial', 'Not sure']);
const ALLOWED_COLLECTIONS = new Set(['Caribbean & African', 'Classic', 'Football', 'Signature Florals', 'Bespoke']);
const ALLOWED_QUANTITIES = new Set(['50', '100', '150', '250', '500']);
const ALLOWED_PAGES = new Set(['4 pages', '8 pages', '12 pages', '16 pages', '20 pages']);
const ALLOWED_ADDONS = new Set(['Pull-up banner', 'Motion obituary', 'Motion gallery', 'Bookmarks']);

const json = (status, body, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
    'referrer-policy': 'no-referrer',
    'x-content-type-options': 'nosniff',
    ...headers
  }
});

const scalar = value => typeof value === 'string' || typeof value === 'number' ? String(value) : '';
const text = (value, max = 2000) => scalar(value).replaceAll('\0', '').trim().slice(0, max);
const singleLine = (value, max) => text(value, max).replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ');
const optional = (value, max) => {
  const cleaned = singleLine(value, max);
  return cleaned || undefined;
};
const note = (value, max = 3000) => text(value, max)
  .replace(/\r\n?/g, '\n')
  .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
  .replace(/\n{3,}/g, '\n\n');
const line = (label, value, max) => {
  const cleaned = note(value, max);
  return cleaned ? `${label}: ${cleaned}` : undefined;
};
const allowedOptional = (value, allowed) => !value || allowed.has(value);
const consented = value => value === true || value === 'true' || value === '1' || value === 'on';
const requestOrigin = request => new URL(request.url).origin;
const validSourceUrl = (value, origin) => {
  try {
    const url = new URL(singleLine(value, 1000));
    return url.origin === origin ? `${url.origin}${url.pathname}${url.search}`.slice(0, 1000) : undefined;
  } catch {
    return undefined;
  }
};
const stableReference = async (memorialName, identity) => {
  const key = `${memorialName.toLocaleLowerCase('en-GB')}|${identity.toLocaleLowerCase('en-GB').replace(/\s+/g, '')}`;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
  const hex = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  return `WEB-${hex.slice(0, 20).toUpperCase()}`;
};

const notifyMake = async ({ recordId, reference }) => {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  if (!webhookUrl) return;
  try {
    const url = new URL(webhookUrl);
    if (url.protocol !== 'https:' || !(url.hostname === 'make.com' || url.hostname.endsWith('.make.com'))) {
      console.error('Make handoff is configured with an invalid webhook URL.');
      return;
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        event: 'website.enquiry.created',
        source: 'memoriesbydd.com',
        airtable_record_id: recordId,
        reference
      }),
      signal: AbortSignal.timeout(3500)
    });
    if (!response.ok) console.error(`Make handoff failed (${response.status}). The Airtable record remains safe.`);
  } catch (error) {
    console.error('Make handoff failed; the Airtable record remains safe:', error instanceof Error ? error.message : error);
  }
};

export default async request => {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed' }, { allow: 'POST' });

  const origin = requestOrigin(request);
  const suppliedOrigin = request.headers.get('origin');
  const fetchSite = request.headers.get('sec-fetch-site');
  if ((suppliedOrigin && suppliedOrigin !== origin) || (fetchSite && !['same-origin', 'same-site', 'none'].includes(fetchSite))) {
    return json(403, { error: 'Request not allowed' });
  }
  if (request.headers.get('x-memories-form') !== '1') return json(403, { error: 'Request not allowed' });

  const contentType = request.headers.get('content-type') || '';
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) return json(415, { error: 'Content type must be application/json' });
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return json(413, { error: 'Request is too large' });

  let data;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return json(413, { error: 'Request is too large' });
    data = JSON.parse(raw);
  } catch {
    return json(400, { error: 'Invalid request' });
  }
  if (!data || Array.isArray(data) || typeof data !== 'object' || Object.keys(data).length > MAX_KEYS) {
    return json(400, { error: 'Invalid request' });
  }

  // A filled honeypot is treated as a successful submission without storing spam.
  if (singleLine(data.company_website, 200)) return json(200, { ok: true });

  const memorialName = singleLine(data.memorial_name, 180);
  const contactName = singleLine(data.contact_name, 180);
  const phone = singleLine(data.phone, 40);
  const email = optional(data.email, 254)?.toLocaleLowerCase('en-GB');
  if (!memorialName || !contactName || !phone || !consented(data.privacy_consent)) {
    return json(422, { error: 'Please complete the required fields' });
  }
  if (!/^[\d+().\-\s]{6,40}$/.test(phone) || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email))) {
    return json(422, { error: 'Please check your contact details' });
  }

  const serviceType = optional(data.service_type, 40);
  const collection = optional(data.collection, 80);
  const quantity = optional(data.quantity, 10);
  const pages = optional(data.pages, 20);
  const addons = optional(data.addons, 300);
  const addonValues = addons ? addons.split(',').map(value => value.trim()).filter(Boolean) : [];
  const serviceDate = optional(data.service_date, 10);
  const neededBy = optional(data.needed_by, 10);
  const validDate = value => {
    if (!value) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
  };
  if (!allowedOptional(serviceType, ALLOWED_SERVICE_TYPES)
    || !allowedOptional(collection, ALLOWED_COLLECTIONS)
    || !allowedOptional(quantity, ALLOWED_QUANTITIES)
    || !allowedOptional(pages, ALLOWED_PAGES)
    || addonValues.some(value => !ALLOWED_ADDONS.has(value))
    || !validDate(serviceDate)
    || !validDate(neededBy)) {
    return json(422, { error: 'Please check the enquiry details' });
  }

  const token = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID;
  if (!token || !baseId || !tableId || !/^pat[a-zA-Z0-9._-]+$/.test(token) || !/^app[a-zA-Z0-9]+$/.test(baseId)) {
    console.error('Airtable enquiry function is missing or has invalid required environment variables.');
    return json(503, { error: 'Enquiry service is not configured' });
  }

  const identity = email || phone;
  const reference = await stableReference(memorialName, identity);
  const notes = [
    line('Service date', serviceDate, 10),
    line('Needed by', neededBy, 10),
    line('Service type', serviceType, 40),
    line('Design collection', collection, 80),
    line('Requested design', optional(data.requested_design, 120), 120),
    line('Requested package', optional(data.requested_package, 120), 120),
    line('Quantity', quantity, 10),
    line('Pages', pages, 20),
    line('Add-ons', addons, 300),
    line('Family notes', data.notes, 3000),
    line('Referral code', optional(data.referral_code, 120), 120),
    line('UTM source', optional(data.utm_source, 120), 120),
    line('UTM campaign', optional(data.utm_campaign, 120), 120),
    line('Source URL', validSourceUrl(data.source_url, origin), 1000)
  ].filter(Boolean).join('\n');

  const fields = {
    'Name': reference,
    'Deceased Full Name': memorialName,
    'Family Name': contactName,
    'Family Phone': phone,
    'Family Email': email,
    'Consent Confirmed': true,
    'Submitted By': 'Website enquiry',
    'Notes': notes || 'Submitted through the website enquiry form.'
  };
  Object.keys(fields).forEach(key => fields[key] === undefined && delete fields[key]);

  try {
    // Airtable upserts on the deterministic reference, making simultaneous retries idempotent.
    const airtable = await fetch(`https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableId)}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        performUpsert: { fieldsToMergeOn: ['Name'] },
        records: [{ fields }],
        typecast: true
      }),
      signal: AbortSignal.timeout(8000)
    });
    if (!airtable.ok) {
      console.error(`Airtable rejected an enquiry (${airtable.status}).`);
      return json(502, { error: 'Enquiry could not be stored' });
    }
    const stored = await airtable.json().catch(() => ({}));
    const recordId = stored.records?.[0]?.id;
    if (recordId && stored.createdRecords?.includes(recordId)) await notifyMake({ recordId, reference });
    return json(200, { ok: true });
  } catch (error) {
    console.error('Airtable request failed:', error instanceof Error ? error.message : error);
    return json(502, { error: 'Enquiry could not be stored' });
  }
};

export const config = {
  path: '/api/enquiry',
  rateLimit: {
    windowLimit: 6,
    windowSize: 60,
    aggregateBy: ['ip', 'domain']
  }
};
