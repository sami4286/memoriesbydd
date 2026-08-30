import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..', '_deploy');
const phone = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 3.5 10 7.8 8.3 9.6c.9 2.1 2.5 3.7 4.6 4.6l1.8-1.7 4.3 2.8-.7 3.3c-.2 1-1.2 1.8-2.3 1.7C9.3 19.7 4.2 14.5 3.6 7.9c-.1-1.1.6-2.1 1.7-2.3l1.9-.4Z"/></svg>';
const message = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.6a8 8 0 0 1-11.8 7l-4.2 1.1 1.1-4a8 8 0 1 1 14.9-4.1Z"/><path d="M8.4 8.1c.5 2.8 2.7 5 5.5 5.5"/></svg>';
const header = `<header class="site-header" data-header><div class="nav-shell"><a class="brand brand--gold" href="/"><span class="brand-mark" aria-hidden="true">M</span><span class="brand-name"><b>Memories</b><small>by DD · Funeral Booklets</small></span></a><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle><span></span><span></span><span></span><i>Menu</i></button><nav class="site-nav" id="site-nav" aria-label="Main navigation" data-nav><a href="/designs/">Designs</a><a href="/how-it-works/">How it works</a><a href="/prices/">Prices</a><a href="/tributes/">Our story</a><a class="nav-phone contact-icon" href="tel:08000236263" aria-label="Call Memories BY DD">${phone}</a><a class="nav-cta" href="/order.html">Create a funeral booklet <span>↗</span></a></nav></div></header>`;
const footer = `<footer class="footer"><div class="wrap"><div class="footer-top"><a class="footer-brand" href="/"><img src="/img/logo.png" alt="Memories by DD" width="246" height="246"></a><p>Funeral order of service booklets and tributes, made with care in London and delivered throughout the UK.</p><div class="footer-contact-icons"><a class="contact-icon" href="tel:08000236263" aria-label="Call Memories BY DD">${phone}</a><a class="contact-icon" href="https://wa.me/447552916060" aria-label="Message Memories BY DD">${message}</a></div></div><div class="footer-grid"><div><h3>Explore</h3><a href="/designs/">Funeral booklet designs</a><a href="/how-it-works/">How it works</a><a href="/prices/">Funeral booklet prices</a><a href="/hymns-and-resources/">Hymns &amp; resources</a><a href="/tributes/">Our story</a></div><div><h3>Studio</h3><a href="/contact/">Contact</a><a href="mailto:info@memoriesbydd.com">Email us</a><a href="/partners/">For funeral directors</a><a href="/order.html">Create a funeral order of service</a></div><address><h3>London</h3>Stanmore Place<br>Stanmore Innovation Centre<br>Howard Rd, London HA7 1BT</address></div><div class="footer-bottom"><span>© 2026 Memories by DD</span><span>Nationwide UK delivery</span><a href="/privacy-policy/">Privacy</a></div></div></footer>`;
const mobile = `<div class="mobile-actions" aria-label="Quick actions"><a class="contact-icon" href="tel:08000236263" aria-label="Call Memories BY DD">${phone}</a><a class="contact-icon" href="https://wa.me/447552916060" aria-label="Message Memories BY DD">${message}</a><a href="/order.html">Create</a></div>`;

const htmlFiles = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const location = path.join(directory, entry.name);
  return entry.isDirectory() ? htmlFiles(location) : entry.name.endsWith('.html') ? [location] : [];
});
const withClass = (attributes, className) => {
  if (/\bclass="/.test(attributes)) return attributes.replace(/\bclass="([^"]*)"/, (_, classes) => `class="${classes.includes(className) ? classes : `${classes} ${className}`.trim()}"`);
  return `${attributes} class="${className}"`;
};

let count = 0;
for (const file of htmlFiles(root)) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<header class="site-header"[\s\S]*?<\/header>/i, header);
  html = html.replace(/<footer class="footer"[\s\S]*?<\/footer>/i, footer);
  html = html.replace(/<div class="mobile-actions"[\s\S]*?<\/div>/i, mobile);
  html = html.replace(/<a([^>]*href="tel:[^"]+"[^>]*)>[\s\S]*?<\/a>/gi, (_, attrs) => `<a${withClass(attrs.replace(/\saria-label="[^"]*"/gi, ''), 'contact-icon')} aria-label="Call Memories BY DD">${phone}</a>`);
  html = html.replace(/<a([^>]*href="https:\/\/wa\.me\/[^"]+"[^>]*)>[\s\S]*?<\/a>/gi, (_, attrs) => `<a${withClass(attrs.replace(/\saria-label="[^"]*"/gi, ''), 'contact-icon')} aria-label="Message Memories BY DD">${message}</a>`);
  html = html.replace(/>Begin a tribute</gi, '>Create a funeral booklet');
  html = html.replace(/>Start your booklet</gi, '>Create a funeral order of service');
  html = html.replace(/>Start a booklet</gi, '>Create a funeral order of service');
  html = html.replace(/>Start your enquiry</gi, '>Request a funeral booklet quote');
  html = html.replace(/>Begin with the essentials</gi, '>Create your funeral booklet');
  html = html.replace(/\bWhatsApp\b/g, 'secure message');
  if (file.endsWith(`${path.sep}how-it-works${path.sep}index.html`) && !html.includes('What image quality is best for print?')) {
    const moreAnswers = '<details><summary>What image quality is best for print?</summary><p>Original digital JPEG or PNG files are best, ideally around 300 dpi at the size they will be printed. If only an older or lower-quality photograph exists, send it anyway; we will explain what can be improved and never silently print a poor result.</p></details><details><summary>What if we do not have many photographs?</summary><p>A meaningful booklet does not require a large gallery. One strong portrait, careful typography, a favourite colour, a reading and a short life story can create a complete and personal tribute.</p></details><details><summary>Can a funeral director order for the family?</summary><p>Yes. Funeral directors, churches and celebrants can send the material, receive an unbranded proof when agreed, or invite the family into the proofing conversation.</p></details><details><summary>Can I request changes or order more copies later?</summary><p>Changes are welcomed during proofing. After approval and print, further edits are treated as a new revision; approved artwork may be retained for reprints in line with the family’s privacy preferences.</p></details>';
    html = html.replace('</details></div></div></section></main>', `</details>${moreAnswers}</div></div></section></main>`);
  }
  fs.writeFileSync(file, html);
  count += 1;
}
console.log(`Standardised navigation, footer and contact icons across ${count} pages.`);
