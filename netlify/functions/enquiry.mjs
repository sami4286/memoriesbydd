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

  const fields = {
    'Person Remembered': memorialName,
    'Service Date': optional(data.service_date),
    'Needed By': optional(data.needed_by),
    'Service Type': optional(data.service_type),
    'Collection': optional(data.collection),
    'Requested Design': optional(data.requested_design),
    'Requested Package': optional(data.requested_package),
    'Quantity': optional(data.quantity),
    'Pages': optional(data.pages),
    'Add-ons': optional(data.addons),
    'Contact Name': contactName,
    'Phone': phone,
    'Email': optional(data.email),
    'Notes': optional(data.notes),
    'Referral Code': optional(data.referral_code),
    'Source URL': optional(data.source_url),
    'UTM Source': optional(data.utm_source),
    'UTM Campaign': optional(data.utm_campaign),
    'Privacy Consent': true,
    'Status': 'New enquiry'
  };
  Object.keys(fields).forEach(key => fields[key] === undefined && delete fields[key]);

  try {
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
