/* ============================================================================
   MOTION — GSAP 3.15, self-hosted (see /js/vendor/).

   WHY THIS EXISTS, AND WHAT IT MUST NOT DO
   This is a site people reach on the worst week of their lives, usually on a
   phone, usually in a hurry, often having never heard of us. Motion here is
   not decoration and it is not a showreel. It has one job: make the thing feel
   considered, so that a family trusts us with a photograph of their mother.

   The rules that follow from that:
     - Slow and heavy. 0.9-1.4s, power3/expo easing. Nothing under 0.6s.
     - Short throw. 24-40px. Nothing flies across the screen.
     - No bounce, no elastic, no overshoot. Levity reads as disrespect here.
     - No infinite loops. Nothing may compete with the words on the page.
     - Reduced motion is honoured absolutely — not softened, switched off.

   ROBUSTNESS
   The CSS hides [data-anim] only under html.has-motion. That class is set by
   an inline snippet in the head, and removed again here if GSAP is missing, so
   a failed vendor request degrades to the plain static page rather than a
   blank one. The inline snippet also removes it on a timeout, covering the
   case where this file itself never arrives.
   ============================================================================ */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* No GSAP, or the visitor asked for stillness: show everything, do nothing. */
  if (reduce || !window.gsap || !window.ScrollTrigger) {
    root.classList.remove('has-motion');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  var canSplit = !!window.SplitText;
  if (canSplit) gsap.registerPlugin(SplitText);

  var EASE = 'power3.out';
  var mobile = window.matchMedia('(max-width: 900px)').matches;

  /* Delay authored in the markup as style="--d:180ms". Kept so the existing
     hand-tuned rhythm survives the move from CSS transitions to GSAP. */
  function authoredDelay(el) {
    var value = el.style.getPropertyValue('--d').trim();
    if (!value) return 0;
    return (parseFloat(value) || 0) / (value.indexOf('ms') > -1 ? 1000 : 1);
  }

  /* fromTo, never from.

     The CSS hides [data-anim] at opacity:0 before paint so nothing flashes
     while GSAP boots. gsap.from() reads the CURRENT value as its destination,
     which in that state is zero — so a from({opacity:0}) tween animates 0 to 0
     and the element never appears. Every reveal here must therefore state both
     ends explicitly. */
  function fromVars(el) {
    var kind = el.getAttribute('data-anim');
    if (kind === 'fade') return { opacity: 0 };
    if (kind === 'scale') return { opacity: 0, scale: 0.97 };
    if (kind === 'right') return { opacity: 0, x: 28 };
    return { opacity: 0, y: mobile ? 22 : 30 };
  }

  function toVars(el) {
    var kind = el.getAttribute('data-anim');
    if (kind === 'fade') return { opacity: 1 };
    if (kind === 'scale') return { opacity: 1, scale: 1 };
    if (kind === 'right') return { opacity: 1, x: 0 };
    return { opacity: 1, y: 0 };
  }

  /* ------------------------------------------------------------------
     HEADINGS — line-by-line uncover.

     Each line sits in its own overflow-hidden mask and rises into it, so the
     words are revealed rather than moved. Reads as calm at display sizes,
     where a whole-block fade looks heavy.

     Deliberately opt-in via data-anim="lines". Auto-splitting every heading
     breaks the Italianno script spans (.sc), which carry font-size:1.5em and
     line-height:.7 and overhang their own line box in both directions.
     ------------------------------------------------------------------ */
  function splitHeadings() {
    if (!canSplit) return;

    gsap.utils.toArray('[data-anim="lines"]').forEach(function (el) {
      var split;
      try {
        split = new SplitText(el, {
          type: 'lines',
          linesClass: 'line',
          mask: 'lines',
          reduceWhiteSpace: false
        });
      } catch (error) {
        /* Any failure: leave the heading alone and visible. */
        gsap.set(el, { opacity: 1 });
        return;
      }

      gsap.set(el, { opacity: 1 });
      gsap.from(split.lines, {
        yPercent: 108,
        duration: 1.15,
        ease: 'expo.out',
        stagger: 0.085,
        delay: authoredDelay(el),
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
  }

  /* ------------------------------------------------------------------
     EVERYTHING ELSE — fade and lift on entry.
     ------------------------------------------------------------------ */
  function revealBlocks() {
    /* Groups first, so an authored stagger wins over the per-element delay. */
    gsap.utils.toArray('[data-stagger]').forEach(function (group) {
      var step = (parseFloat(group.getAttribute('data-stagger')) || 100) / 1000;
      var items = gsap.utils.toArray(group.children).filter(function (child) {
        return child.matches('[data-anim]:not([data-anim="lines"])') ||
          child.querySelector('[data-anim]:not([data-anim="lines"])');
      });
      if (!items.length) return;

      gsap.fromTo(items,
        { opacity: 0, y: mobile ? 20 : 28 },
        {
          opacity: 1, y: 0,
          duration: 1.05,
          ease: EASE,
          stagger: step,
          scrollTrigger: { trigger: group, start: 'top 84%', once: true }
        });
      items.forEach(function (item) { item.setAttribute('data-anim-done', ''); });
    });

    gsap.utils.toArray('[data-anim]:not([data-anim="lines"]):not([data-anim-done])')
      .forEach(function (el) {
        if (el.closest('.hero')) return;           /* the hero has its own timeline */
        gsap.fromTo(el, fromVars(el), Object.assign(toVars(el), {
          duration: 1.05,
          ease: EASE,
          delay: authoredDelay(el),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true }
        }));
      });
  }

  /* ------------------------------------------------------------------
     HERO — arrival, then recession.

     On load the photograph settles out of a slow scale while the headline
     uncovers over it. On scroll the two part company: the photograph slows and
     swells, the type keeps pace with the page and fades. That difference in
     rate is the whole effect — it is what makes the hero read as a space
     rather than a picture.
     ------------------------------------------------------------------ */
  function heroMotion() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var bg = hero.querySelector('.hero_bg img');
    var mid = hero.querySelector('.hero_center');
    var bottom = hero.querySelector('.hero_bottom');
    var lead = hero.querySelector('.hero_lead');
    var extra = hero.querySelectorAll('.hero_scroll, .hero_video');

    var intro = gsap.timeline({ defaults: { ease: 'expo.out' } });

    if (bg) intro.fromTo(bg, { scale: 1.09 }, { scale: 1, duration: 2.4 }, 0);
    if (lead) intro.fromTo(lead,
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 1.15, ease: EASE }, 0.45);
    if (extra.length) intro.fromTo(extra,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 1, ease: EASE, stagger: 0.12 }, 0.65);

    /* Recession. Capped at the fold — past it the hero is gone. */
    if (bg) {
      gsap.to(bg, {
        yPercent: 9,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 }
      });
    }

    var forward = [mid, bottom].filter(Boolean);
    if (forward.length) {
      gsap.to(forward, {
        yPercent: -7,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '75% top', scrub: 0.6 }
      });
    }
  }

  /* ------------------------------------------------------------------
     DEPTH — images drift inside their frames.

     .rmask is already overflow:hidden with a 1.12 scale on the image, so there
     is headroom to move into without exposing an edge. Scrubbed, so it tracks
     the page exactly and never animates on its own.
     ------------------------------------------------------------------ */
  function depth() {
    gsap.utils.toArray('.rmask').forEach(function (mask) {
      var img = mask.querySelector('img');
      if (!img) return;

      gsap.fromTo(img,
        { scale: 1.12, yPercent: -3.5 },
        {
          scale: 1.04, yPercent: 3.5, ease: 'none',
          scrollTrigger: { trigger: mask, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
        }
      );
    });

    /* Opt-in layer separation for anything the markup marks up as deeper. */
    gsap.utils.toArray('[data-depth]').forEach(function (el) {
      var rate = parseFloat(el.getAttribute('data-depth')) || 0;
      if (!rate) return;
      gsap.fromTo(el,
        { yPercent: rate * 6 },
        {
          yPercent: rate * -6, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
        }
      );
    });
  }

  /* SplitText measures text, so it must run after the webfonts land or the
     lines break against fallback metrics and the masks end up the wrong height. */
  /* SplitText measures text, so it waits on the webfonts — but only so long.
     If fonts.ready stalls (a blocked or slow Google Fonts request) the page
     must still be revealed, so the wait is raced against a deadline. Whichever
     wins, start() runs exactly once.

     motion-ready is set inside start(), not before it. Setting it earlier
     would disarm the head snippet's 2.6s safety timeout while the content was
     still hidden — the precise failure this guards against. */
  var started = false;
  function start() {
    if (started) return;
    started = true;
    root.classList.add('motion-ready');
    splitHeadings();
    revealBlocks();
    heroMotion();
    depth();
    ScrollTrigger.refresh();
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
    setTimeout(start, 1200);
  } else {
    window.addEventListener('load', start);
  }

  /* Late images change every trigger position below them. */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
