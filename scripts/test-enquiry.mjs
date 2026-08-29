import assert from 'node:assert/strict';
import enquiry, { config } from '../netlify/functions/enquiry.mjs';

const endpoint = 'https://memoriesbydd.com/api/enquiry';
const request = (body, method = 'POST', headers = {}) => new Request(endpoint, {
  method,
  headers: {
    'content-type': 'application/json',
    'x-memories-form': '1',
    ...headers
  },
  ...(method === 'POST' ? { body: JSON.stringify(body) } : {})
});
const status = async response => ({ status: response.status, body: await response.json(), headers: response.headers });

assert.equal(config.path, '/api/enquiry');
assert.deepEqual(config.rateLimit.aggregateBy, ['ip', 'domain']);
assert.equal((await status(await enquiry(request({}, 'GET')))).status, 405);
assert.equal((await status(await enquiry(request({}, 'GET')))).headers.get('allow'), 'POST');
assert.equal((await status(await enquiry(new Request(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' })))).status, 403);
assert.equal((await status(await enquiry(request({}, 'POST', { origin: 'https://attacker.example' })))).status, 403);
assert.equal((await status(await enquiry(request({}, 'POST', { 'content-type': 'text/plain' })))).status, 415);
assert.equal((await status(await enquiry(new Request(endpoint, { method: 'POST', headers: { 'content-type': 'application/json', 'x-memories-form': '1' }, body: '{' })))).status, 400);
assert.equal((await status(await enquiry(request({ notes: 'x'.repeat(25 * 1024) })))).status, 413);
assert.deepEqual(await status(await enquiry(request({ company_website: 'spam.example' }))).then(({ status: code, body }) => ({ status: code, body })), { status: 200, body: { ok: true } });
assert.equal((await status(await enquiry(request({ memorial_name: 'A', contact_name: 'B', phone: '07123 456789' })))).status, 422);
assert.equal((await status(await enquiry(request({ memorial_name: 'A', contact_name: 'B', phone: 'not-a-phone', privacy_consent: 'on' })))).status, 422);
assert.equal((await status(await enquiry(request({ memorial_name: 'A', contact_name: 'B', phone: '07123 456789', email: 'wrong', privacy_consent: 'on' })))).status, 422);
assert.equal((await status(await enquiry(request({ memorial_name: 'A', contact_name: 'B', phone: '07123 456789', service_type: 'Injected', privacy_consent: 'on' })))).status, 422);
assert.equal((await status(await enquiry(request({ memorial_name: 'A', contact_name: 'B', phone: '07123 456789', service_date: '2026-99-99', privacy_consent: 'on' })))).status, 422);

const originalError = console.error;
console.error = () => {};
assert.equal((await status(await enquiry(request({ memorial_name: 'A', contact_name: 'B', phone: '07123 456789', privacy_consent: 'on' })))).status, 503);
console.error = originalError;

process.env.AIRTABLE_PAT = 'pat-test-token';
process.env.AIRTABLE_BASE_ID = 'apptest123';
process.env.AIRTABLE_TABLE_ID = 'tbl-test';

const calls = [];
globalThis.fetch = async (url, options = {}) => {
  calls.push({ url: String(url), options });
  return new Response(JSON.stringify({ records: [{ id: 'rec-new' }], createdRecords: ['rec-new'] }), { status: 200 });
};

const submission = {
  memorial_name: 'Elena Grace Baptiste',
  contact_name: 'Maya Baptiste',
  phone: '07123 456789',
  email: 'Maya@Example.com',
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
assert.deepEqual(await status(await enquiry(request(submission))).then(({ status: code, body }) => ({ status: code, body })), { status: 200, body: { ok: true } });
assert.equal(calls.length, 1);
assert.equal(calls[0].options.method, 'PATCH');
assert.match(calls[0].url, /^https:\/\/api\.airtable\.com\/v0\/apptest123\/tbl-test$/);
assert.equal(calls[0].options.headers.authorization, 'Bearer pat-test-token');
const upsert = JSON.parse(calls[0].options.body);
assert.deepEqual(upsert.performUpsert, { fieldsToMergeOn: ['Name'] });
const created = upsert.records[0].fields;
assert.match(created.Name, /^WEB-[A-F0-9]{20}$/);
assert.equal(created['Deceased Full Name'], submission.memorial_name);
assert.equal(created['Family Name'], submission.contact_name);
assert.equal(created['Family Phone'], submission.phone);
assert.equal(created['Family Email'], 'maya@example.com');
assert.equal(created['Consent Confirmed'], true);
assert.match(created.Notes, /Service date: 2026-09-10/);
assert.match(created.Notes, /Family notes: Please call after 5pm\./);
assert.equal(Object.hasOwn(created, 'Person Remembered'), false);

const firstReference = created.Name;
calls.length = 0;
globalThis.fetch = async (url, options = {}) => {
  calls.push({ url: String(url), options });
  return new Response(JSON.stringify({ records: [{ id: 'rec-existing' }], updatedRecords: ['rec-existing'] }), { status: 200 });
};
assert.deepEqual(await status(await enquiry(request(submission))).then(({ status: code, body }) => ({ status: code, body })), { status: 200, body: { ok: true } });
assert.equal(calls.length, 1);
assert.equal(JSON.parse(calls[0].options.body).records[0].fields.Name, firstReference);

calls.length = 0;
process.env.MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/memories';
globalThis.fetch = async (url, options = {}) => {
  calls.push({ url: String(url), options });
  if (String(url) === process.env.MAKE_WEBHOOK_URL) return new Response('Accepted', { status: 200 });
  return new Response(JSON.stringify({ records: [{ id: 'rec-make' }], createdRecords: ['rec-make'] }), { status: 200 });
};
assert.deepEqual(await status(await enquiry(request({ ...submission, memorial_name: 'Arthur James Cole' }))).then(({ status: code, body }) => ({ status: code, body })), { status: 200, body: { ok: true } });
assert.equal(calls.length, 2);
assert.equal(calls[1].url, process.env.MAKE_WEBHOOK_URL);
assert.deepEqual(JSON.parse(calls[1].options.body), {
  event: 'website.enquiry.created',
  source: 'memoriesbydd.com',
  airtable_record_id: 'rec-make',
  reference: JSON.parse(calls[0].options.body).records[0].fields.Name
});

console.log('Enquiry function: 32 security and integration assertions passed.');
