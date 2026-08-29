(() => {
  const form = document.querySelector('#tribute-form');
  if (!form) return;
  const steps = [...form.querySelectorAll('.form-step')];
  const indicators = [...document.querySelectorAll('[data-step-indicator]')];
  const label = document.querySelector('[data-step-label]');
  const bar = document.querySelector('[data-progress-bar]');
  let index = 0;
  const query = new URLSearchParams(location.search);
  const set = (name, value) => { const field = form.elements.namedItem(name); if (field && value) field.value = value; };
  set('source_url', location.href); set('referral_code', query.get('ref')); set('utm_source', query.get('utm_source')); set('utm_campaign', query.get('utm_campaign'));
  set('requested_design', query.get('design')); set('requested_package', query.get('package'));
  const collectionNames = {
    'caribbean-african': 'Caribbean & African',
    classic: 'Classic',
    football: 'Football',
    standard: 'Signature Florals'
  };
  const requestedCollection = query.get('collection');
  set('collection', collectionNames[requestedCollection] || requestedCollection);

  const show = (next, shouldScroll = true) => {
    index = Math.max(0, Math.min(steps.length - 1, next));
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('is-current', i === index);
      if (i === index) indicator.setAttribute('aria-current', 'step');
      else indicator.removeAttribute('aria-current');
    });
    form.dataset.currentStep = String(index + 1);
    if (label) label.textContent = `Step ${index + 1}`;
    if (bar) bar.style.width = `${((index + 1) / steps.length) * 100}%`;
    if (shouldScroll) form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
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
    const endpoint = window.MEMORIES_AIRTABLE_ENDPOINT || '/.netlify/functions/enquiry';
    const submit = form.querySelector('.form-submit');
    status.textContent = 'Sending your enquiry securely…';
    if (submit) { submit.disabled = true; submit.setAttribute('aria-busy', 'true'); }
    try {
      const response = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Request failed');
      form.innerHTML = '<div class="form-success"><div class="form-success-mark" aria-hidden="true">✓</div><span>Enquiry received</span><h2>It is safely with us.</h2><p>A member of the Memories studio will read what you shared and contact you personally. If the service is very soon, you can call us now.</p><div class="form-success-actions"><a href="tel:08000236263">Call 0800 023 6263</a><a href="index.html">Return home</a></div></div>';
    } catch {
      status.textContent = 'We could not send that online. Please call 0800 023 6263 or use WhatsApp and we will help immediately.';
      if (submit) { submit.disabled = false; submit.removeAttribute('aria-busy'); }
    }
  });
  show(0, false);
})();
