(() => {
  const form = document.querySelector('#tribute-form');
  if (!form) return;
  const steps = [...form.querySelectorAll('.form-step')];
  const label = document.querySelector('[data-step-label]');
  const bar = document.querySelector('[data-progress-bar]');
  let index = 0;
  const query = new URLSearchParams(location.search);
  const set = (name, value) => { const field = form.elements.namedItem(name); if (field && value) field.value = value; };
  set('source_url', location.href); set('referral_code', query.get('ref')); set('utm_source', query.get('utm_source')); set('utm_campaign', query.get('utm_campaign'));
  set('collection', query.get('collection'));

  const show = next => {
    index = Math.max(0, Math.min(steps.length - 1, next));
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    if (label) label.textContent = `Step ${index + 1}`;
    if (bar) bar.style.width = `${((index + 1) / steps.length) * 100}%`;
    form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };
  const validate = () => {
    const required = [...steps[index].querySelectorAll('[required]')];
    const invalid = required.find(field => !field.checkValidity());
    if (invalid) { invalid.reportValidity(); invalid.focus(); return false; }
    return true;
  };
  form.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => { if (validate()) show(index + 1); }));
  form.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', () => show(index - 1)));

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!validate()) return;
    const status = form.querySelector('[data-form-status]');
    const data = Object.fromEntries(new FormData(form).entries());
    data.addons = [...form.querySelectorAll('input[name="addons"]:checked')].map(el => el.value).join(', ');
    const endpoint = window.MEMORIES_AIRTABLE_ENDPOINT;
    if (endpoint) {
      status.textContent = 'Sending your enquiry…';
      try {
        const response = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
        if (!response.ok) throw new Error('Request failed');
        form.innerHTML = '<div class="form-success"><span>Thank you</span><h2>Your enquiry is safely with us.</h2><p>A member of the Memories team will contact you personally. If the service is very soon, please call <a href="tel:08000236263">0800 023 6263</a>.</p></div>';
      } catch { status.textContent = 'We could not send that online. Please call 0800 023 6263 or use WhatsApp and we will help immediately.'; }
      return;
    }
    const subject = encodeURIComponent(`Funeral booklet enquiry — ${data.memorial_name || 'new request'}`);
    const body = encodeURIComponent(`Person remembered: ${data.memorial_name}\nService date: ${data.service_date || 'Not set'}\nNeeded by: ${data.needed_by || 'Not set'}\nService: ${data.service_type || 'Not set'}\nCollection: ${data.collection || 'Not sure'}\nQuantity: ${data.quantity}\nPages: ${data.pages}\nAdd-ons: ${data.addons || 'None'}\n\nContact: ${data.contact_name}\nPhone: ${data.phone}\nEmail: ${data.email || 'Not provided'}\n\nNotes: ${data.notes || 'None'}`);
    status.textContent = 'Opening your email app so you can send the enquiry securely…';
    location.href = `mailto:info@memoriesbydd.com?subject=${subject}&body=${body}`;
  });
  show(0);
})();
