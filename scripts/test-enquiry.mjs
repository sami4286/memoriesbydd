import assert from 'node:assert/strict';
import enquiry from '../netlify/functions/enquiry.mjs';

const request = (body, method = 'POST') => new Request('https://memoriesbydd.com/.netlify/functions/enquiry', {
  method,
  headers: { 'content-type': 'application/json' },
  ...(method === 'POST' ? { body: JSON.stringify(body) } : {})
});
const status = async response => ({ status: response.status, body: await response.json() });

assert.equal((await status(await enquiry(request({}, 'GET')))).status, 405);
assert.equal((await status(await enquiry(new Request('https://memoriesbydd.com/', { method: 'POST', body: '{' })))).status, 400);
assert.deepEqual(await status(await enquiry(request({ company_website: 'spam.example' }))), { status: 200, body: { ok: true } });
assert.equal((await status(await enquiry(request({ memorial_name: 'A', contact_name: 'B', phone: '1' })))).status, 422);
const originalError = console.error;
console.error = () => {};
assert.equal((await status(await enquiry(request({ memorial_name: 'A', contact_name: 'B', phone: '1', privacy_consent: 'on' })))).status, 503);
console.error = originalError;

process.env.AIRTABLE_PAT = 'test-token';
process.env.AIRTABLE_BASE_ID = 'app-test';
process.env.AIRTABLE_TABLE_ID = 'tbl-test';

const calls = [];
globalThis.fetch = async (url, options = {}) => {
  calls.push({ url: String(url), options });
  return options.method === 'POST'
    ? new Response(JSON.stringify({ records: [{ id: 'rec-new' }] }), { status: 200 })
    : new Response(JSON.stringify({ records: [] }), { status: 200 });
};

const submission = {
  memorial_name: "Elena Grace Baptiste",
  contact_name: 'Maya Baptiste',
  phone: '07123 456789',
  email: 'maya@example.com',
  service_date: '2026-09-10',
  service_type: 'Burial',
  collection: 'Caribbean & African',
  quantity: '100',
  pages: '12 pages',
  addons: 'Bookmarks',
  notes: 'Please call after 5pm.',
  source_url: 'https://memoriesbydd.com/order.html',
  privacy_consent: 'on'
};
assert.deepEqual(await status(await enquiry(request(submission))), { status: 200, body: { ok: true } });
assert.equal(calls.length, 2);
assert.match(calls[0].url, /filterByFormula=/);
const created = JSON.parse(calls[1].options.body).records[0].fields;
assert.equal(created['Deceased Full Name'], submission.memorial_name);
assert.equal(created['Family Name'], submission.contact_name);
assert.equal(created['Family Phone'], submission.phone);
assert.equal(created['Family Email'], submission.email);
assert.equal(created['Consent Confirmed'], true);
assert.match(created.Notes, /Service date: 2026-09-10/);
assert.match(created.Notes, /Family notes: Please call after 5pm\./);
assert.equal(Object.hasOwn(created, 'Person Remembered'), false);

calls.length = 0;
globalThis.fetch = async (url, options = {}) => {
  calls.push({ url: String(url), options });
  return new Response(JSON.stringify({ records: [{ id: 'rec-existing' }] }), { status: 200 });
};
assert.deepEqual(await status(await enquiry(request(submission))), { status: 200, body: { ok: true, duplicate: true } });
assert.equal(calls.length, 1);

calls.length = 0;
process.env.MAKE_WEBHOOK_URL = 'https://hook.example.test/memories';
globalThis.fetch = async (url, options = {}) => {
  calls.push({ url: String(url), options });
  if (String(url) === process.env.MAKE_WEBHOOK_URL) return new Response('Accepted', { status: 200 });
  return options.method === 'POST'
    ? new Response(JSON.stringify({ records: [{ id: 'rec-make' }] }), { status: 200 })
    : new Response(JSON.stringify({ records: [] }), { status: 200 });
};
assert.deepEqual(await status(await enquiry(request({ ...submission, memorial_name: 'Arthur James Cole' }))), { status: 200, body: { ok: true } });
assert.equal(calls.length, 3);
assert.equal(calls[2].url, process.env.MAKE_WEBHOOK_URL);
assert.deepEqual(JSON.parse(calls[2].options.body), {
  event: 'website.enquiry.created',
  source: 'memoriesbydd.com',
  airtable_record_id: 'rec-make',
  reference: JSON.parse(calls[1].options.body).records[0].fields.Name
});

console.log('Enquiry function: 14 assertions passed.');
