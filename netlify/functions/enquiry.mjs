const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  }
});

const text = (value, max = 2000) => String(value ?? '').trim().slice(0, max);
const optional = value => {
  const cleaned = text(value);
  return cleaned || undefined;
};
const airtableFormulaValue = value => String(value).replaceAll('\\', '\\\\').replaceAll("'", "\\'");
const line = (label, value) => optional(value) ? `${label}: ${text(value)}` : undefined;

export default async request => {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed' });

  let data;
  try {
    data = await request.json();
  } catch {
    return json(400, { error: 'Invalid request' });
  }

  // A filled honeypot is treated as a successful submission without storing spam.
  if (text(data.company_website, 200)) return json(200, { ok: true });

  const memorialName = text(data.memorial_name, 180);
  const contactName = text(data.contact_name, 180);
  const phone = text(data.phone, 80);
  if (!memorialName || !contactName || !phone || !data.privacy_consent) {
    return json(422, { error: 'Please complete the required fields' });
  }

  const token = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID;
  if (!token || !baseId || !tableId) {
    console.error('Airtable enquiry function is missing required environment variables.');
    return json(503, { error: 'Enquiry service is not configured' });
  }

  const email = optional(data.email);
  const reference = `WEB-${Date.now().toString(36).toUpperCase()}-${memorialName.replace(/[^a-z0-9]/gi, '').slice(0, 8).toUpperCase() || 'CASE'}`;
  const notes = [
    line('Service date', data.service_date),
    line('Needed by', data.needed_by),
    line('Service type', data.service_type),
    line('Design collection', data.collection),
    line('Requested design', data.requested_design),
    line('Requested package', data.requested_package),
    line('Quantity', data.quantity),
    line('Pages', data.pages),
    line('Add-ons', data.addons),
    line('Family notes', data.notes),
    line('Referral code', data.referral_code),
    line('UTM source', data.utm_source),
    line('UTM campaign', data.utm_campaign),
    line('Source URL', data.source_url)
  ].filter(Boolean).join('\n');

  // These names match the production Cases table. Less structured enquiry
  // details are retained in Notes until a studio member completes the case.
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
    // Treat a repeated submission as success instead of creating a duplicate.
    const identityField = email ? 'Family Email' : 'Family Phone';
    const identityValue = email || phone;
    const formula = `AND({Deceased Full Name}='${airtableFormulaValue(memorialName)}',{${identityField}}='${airtableFormulaValue(identityValue)}')`;
    const duplicateCheck = await fetch(`https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableId)}?maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`, {
      headers: { authorization: `Bearer ${token}` }
    });
    if (!duplicateCheck.ok) {
      const detail = await duplicateCheck.text();
      console.error(`Airtable duplicate check failed (${duplicateCheck.status}): ${detail.slice(0, 500)}`);
      return json(502, { error: 'Enquiry could not be stored' });
    }
    const existing = await duplicateCheck.json();
    if (existing.records?.length) return json(200, { ok: true, duplicate: true });

    const airtable = await fetch(`https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableId)}`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ records: [{ fields }], typecast: true })
    });
    if (!airtable.ok) {
      const detail = await airtable.text();
      console.error(`Airtable rejected enquiry (${airtable.status}): ${detail.slice(0, 500)}`);
      return json(502, { error: 'Enquiry could not be stored' });
    }
    return json(200, { ok: true });
  } catch (error) {
    console.error('Airtable request failed:', error instanceof Error ? error.message : error);
    return json(502, { error: 'Enquiry could not be stored' });
  }
};
