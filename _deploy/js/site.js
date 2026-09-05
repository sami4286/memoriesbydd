(function(){
  /* Behaviour only. All motion lives in motion.js. */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* ---------- nav state ----------
     NOTE: this block previously did querySelector(link.getAttribute('href'))
     across every .nav_link to build a scrollspy. Those hrefs are page paths
     ("/our-products"), which are not valid CSS selectors, so querySelector
     threw a SyntaxError on the first link. Being inside this IIFE, the throw
     took everything below it with it — the range spotlight slider and the
     reviews rotator have both been dead on the live site since the nav moved
     from in-page anchors to real pages. Do not reintroduce a selector built
     from an href without checking it is a hash first. */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function(){ nav.classList.toggle('is-stuck', window.scrollY > 12); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Current page, matched on the partial's data-nav attribute rather than on
     the href, so the markup stays the single source of truth. */
  var path = window.location.pathname.replace(/\/+$/, '') || '/';
  var slug = path === '/' ? '' : path.split('/').filter(Boolean)[0];
  Array.prototype.forEach.call(document.querySelectorAll('.nav_link'), function(link){
    var target = link.getAttribute('data-nav');
    if (target && target === slug) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* In-page anchors still get a scrollspy — hash links only. */
  var hashLinks = Array.prototype.slice.call(document.querySelectorAll('.nav_link'))
    .filter(function(link){ return (link.getAttribute('href') || '').charAt(0) === '#'; });
  if (hashLinks.length) {
    var targets = hashLinks.map(function(link){
      try { return document.querySelector(link.getAttribute('href')); }
      catch (error) { return null; }
    });
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        var i = targets.indexOf(entry.target);
        if (i < 0) return;
        hashLinks.forEach(function(link){ link.classList.remove('is-active'); });
        hashLinks[i].classList.add('is-active');
      });
    }, { threshold: 0.2, rootMargin: '-15% 0px -65% 0px' });
    targets.forEach(function(t){ if (t) spy.observe(t); });
  }

  /* ---------- reviews rotator ---------- */
  var REVIEWS = [
    { q:'We sent the photos over on WhatsApp on the Sunday and had the proof back Monday evening. I could not believe how quickly it came together — and it was exactly what she deserved.',
      n:'Placeholder — client to supply', p:'Family, North London' },
    { q:'Everyone at the service asked where we had them made. The banner at the reception was the thing my dad would have loved most.',
      n:'Placeholder — client to supply', p:'Family, Birmingham' },
    { q:'Ashley talked me through everything. I had no idea where to start and he made it feel manageable from the first phone call.',
      n:'Placeholder — client to supply', p:'Family, Harrow' }
  ];
  var tq = document.getElementById('tq'), tname = document.getElementById('tname'),
      tplace = document.getElementById('tplace'), tnum = document.getElementById('tnum'),
      quote = document.querySelector('.tquote'),
      dots = Array.prototype.slice.call(document.querySelectorAll('#tdots .tdot'));
  var ti = 0;

  function showReview(i){
    ti = (i + REVIEWS.length) % REVIEWS.length;
    var r = REVIEWS[ti];
    if (!reduce) { quote.style.opacity = '0'; quote.style.transform = 'translateY(10px)'; }
    setTimeout(function(){
      tq.textContent = r.q; tname.textContent = r.n; tplace.textContent = r.p;
      tnum.innerHTML = '0' + (ti + 1) + '<small>/0' + REVIEWS.length + '</small>';
      dots.forEach(function(d, k){ d.classList.toggle('is-on', k === ti); });
      if (!reduce) { quote.style.opacity = '1'; quote.style.transform = 'none'; }
    }, reduce ? 0 : 220);
  }
  if (quote) {
    quote.style.transition = 'opacity .45s cubic-bezier(.16,1,.3,1), transform .45s cubic-bezier(.16,1,.3,1)';
    document.getElementById('tprev').addEventListener('click', function(){ showReview(ti - 1); });
    document.getElementById('tnext').addEventListener('click', function(){ showReview(ti + 1); });
    dots.forEach(function(d, k){ d.addEventListener('click', function(){ showReview(k); }); });
  }
})();
