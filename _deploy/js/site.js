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

  /* ---------- range spotlight slider ---------- */
  var RANGES = [
    { title:'Caribbean <span class="sc">&amp;</span> African',
      hero:'/img/designs/jamaica-cover.webp', heroAlt:'Jamaica funeral order of service booklet cover',
      mood:'/img/designs/jamaica-package.webp', moodAlt:'The full Jamaica package',
      b1:'Nine designs built around the flags and colours of home — Jamaica, Trinidad, Grenada, Barbados, St Lucia, Antigua, Dominica, Nigeria and Ghana, with a Rasta theme alongside them.',
      b2:'Each one is made for a send-off where heritage matters, and where the booklet is kept for years afterwards.',
      moodText:'Flag colours, gold detailing, generous photo galleries and space for a full life story.' },
    { title:'Classic',
      hero:'/img/designs/classic-one-cover.webp', heroAlt:'Classic funeral order of service booklet cover',
      mood:'/img/designs/classic-one-package.webp', moodAlt:'The full Classic package',
      b1:'Three understated designs for a traditional service — clean type, generous white space and nothing competing with the photograph.',
      b2:'Chosen most often for formal church services, and by families who want the words to carry the day.',
      moodText:'Black, white and soft grey. Formal type, a single portrait, no distractions.' },
    { title:'Football',
      hero:'/img/designs/liverpool-f-c-cover.webp', heroAlt:'Liverpool FC themed funeral order of service booklet cover',
      mood:'/img/designs/liverpool-f-c-package.webp', moodAlt:'The full Liverpool FC package',
      b1:'Arsenal, Chelsea, Tottenham, Liverpool, Manchester United and Manchester City — club colours and crest, done with restraint.',
      b2:'For the person whose Saturdays were spoken for. It says something true about them without turning the day into a matchday.',
      moodText:'Club colours, crest as the focal point, and room for the order of service and photographs.' },
    { title:'Standard',
      hero:'/img/designs/white-lilies-cover.webp', heroAlt:'White Lilies funeral order of service booklet cover',
      mood:'/img/designs/white-lilies-stack.webp', moodAlt:'The full White Lilies package',
      b1:'Twenty-two designs — florals, feathers, dominoes, satins and skies. Our widest choice of colours and moods.',
      b2:'If nothing else feels quite right, this is where most families find the one. We stock every theme in several colourways.',
      moodText:'Soft florals through to bold, masculine tones — up to 23 photographs on the larger layouts.' }
  ];

  var spot = document.getElementById('spot');
  if (spot) {
    var spHero = document.getElementById('spHero'), spMood = document.getElementById('spMood'),
        spTitle = document.getElementById('spTitle'), spB1 = document.getElementById('spBody1'),
        spB2 = document.getElementById('spBody2'), spNum = document.getElementById('spNum'),
        spMoodText = document.getElementById('spMoodText'),
        spTabs = Array.prototype.slice.call(document.querySelectorAll('#spTabs .spot_tab'));
    var si = 0;

    function showRange(i){
      si = (i + RANGES.length) % RANGES.length;
      var r = RANGES[si];
      if (!reduce) spot.classList.add('is-swap');
      setTimeout(function(){
        spHero.src = r.hero; spHero.alt = r.heroAlt;
        spMood.src = r.mood; spMood.alt = r.moodAlt;
        spTitle.innerHTML = r.title;
        spB1.textContent = r.b1; spB2.textContent = r.b2;
        spMoodText.textContent = r.moodText;
        spNum.innerHTML = '0' + (si + 1) + '<small>/0' + RANGES.length + '</small>';
        spTabs.forEach(function(t, k){ t.classList.toggle('is-on', k === si); });
        if (!reduce) spot.classList.remove('is-swap');
      }, reduce ? 0 : 320);
    }

    document.getElementById('spPrev').addEventListener('click', function(){ showRange(si - 1); });
    document.getElementById('spNext').addEventListener('click', function(){ showRange(si + 1); });
    spTabs.forEach(function(t, k){ t.addEventListener('click', function(){ showRange(k); }); });
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
