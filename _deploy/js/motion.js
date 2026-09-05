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
    /* An object settling onto a surface, rather than sliding in from nowhere. */
    if (kind === 'settle') return { opacity: 0, y: 24, scale: 0.985 };
    return { opacity: 0, y: mobile ? 22 : 30 };
  }

  function toVars(el) {
    var kind = el.getAttribute('data-anim');
    if (kind === 'fade') return { opacity: 1 };
    if (kind === 'scale') return { opacity: 1, scale: 1 };
    if (kind === 'right') return { opacity: 1, x: 0 };
    if (kind === 'settle') return { opacity: 1, y: 0, scale: 1 };
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

    gsap.utils.toArray('[data-anim="lines"]:not(.chap_h)').forEach(function (el) {
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
     WORDS — a step finer than lines.

     For the one heading on a page that should feel authored. Words rise out
     of their own masks a beat apart, slower and shorter than a line reveal
     because there are more of them.

     Opt-in via data-anim="words", and never used on a heading carrying an
     Italianno .sc span — that face overhangs its box in both directions and a
     per-word mask shears it. Line masks have the padding to absorb it; word
     masks, being narrower, do not.
     ------------------------------------------------------------------ */
  function splitWords() {
    if (!canSplit) return;

    gsap.utils.toArray('[data-anim="words"]').forEach(function (el) {
      var split;
      try {
        split = new SplitText(el, { type: 'words', wordsClass: 'word', mask: 'words' });
      } catch (error) {
        gsap.set(el, { opacity: 1 });
        return;
      }

      gsap.set(el, { opacity: 1 });
      gsap.from(split.words, {
        yPercent: 112,
        duration: 0.95,
        ease: 'expo.out',
        stagger: 0.045,
        delay: authoredDelay(el),
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
  }

  /* ------------------------------------------------------------------
     FIRST-LOAD VEIL

     Shown once per session. Built here rather than in the markup so that a
     visitor without JS never meets it, and torn down on a hard timeout so a
     failure part-way through cannot leave anyone looking at a blank screen.

     It never blocks: the page behind is already rendered, the veil takes no
     pointer events, and it starts lifting as soon as the fonts settle. On a
     site people reach in a hurry, an animation that delays a phone number by
     even half a second is not worth having.
     ------------------------------------------------------------------ */
  function veil() {
    var KEY = 'mbdd-seen';
    try {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, '1');
    } catch (error) {
      return;   /* private mode: skip rather than show it on every page */
    }

    var el = document.createElement('div');
    el.className = 'veil';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<img src="/img/logo-mark.webp" alt="" width="360" height="360">';
    document.body.appendChild(el);

    var done = false;
    function lift() {
      if (done) return;
      done = true;
      el.classList.add('is-gone');
      setTimeout(function () { el.remove(); }, 700);
    }

    /* Whichever comes first: the fonts settling, or 1.1s. */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () {
      setTimeout(lift, 420);
    });
    setTimeout(lift, 1100);
  }

  /* ------------------------------------------------------------------
     EVERYTHING ELSE — fade and lift on entry.
     ------------------------------------------------------------------ */
  function revealBlocks() {
    /* Groups first, so an authored stagger wins over the per-element delay. */
    gsap.utils.toArray('[data-stagger]').forEach(function (group) {
      var step = (parseFloat(group.getAttribute('data-stagger')) || 100) / 1000;
      var items = gsap.utils.toArray(group.children).filter(function (child) {
        var generic = '[data-anim]:not([data-anim="lines"]):not([data-anim="words"])';
        return child.matches(generic) || child.querySelector(generic);
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

    gsap.utils.toArray('[data-anim]:not([data-anim="lines"]):not([data-anim="words"]):not([data-anim-done])')
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
     CHAPTERS — the shared opening.

     Every chapter reveals in the same order: index label, then the rule drawn
     left to right, then the heading lines rising. One grammar across the whole
     page is what stops it reading as a stack of unrelated modules, and the
     drawn rule is the verb they have in common — in How It Works that same
     gesture becomes the content itself.
     ------------------------------------------------------------------ */
  function chapters() {
    gsap.utils.toArray('[data-chapter]').forEach(function (section) {
      var label = section.querySelector('.chap .label');
      var rule = section.querySelector('.chap_rule');
      var heading = section.querySelector('.chap_h');

      var tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 80%', once: true } });
      if (label) tl.fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, ease: EASE }, 0);
      if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0.1);

      if (heading && canSplit) {
        var split;
        try {
          split = new SplitText(heading, {
            type: 'lines', linesClass: 'line', mask: 'lines', reduceWhiteSpace: false
          });
        } catch (error) {
          gsap.set(heading, { opacity: 1 });
          return;
        }
        gsap.set(heading, { opacity: 1 });
        tl.from(split.lines, { yPercent: 108, duration: 1.15, ease: 'expo.out', stagger: 0.085 }, 0.35);
      } else if (heading) {
        tl.fromTo(heading, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.1, ease: EASE }, 0.35);
      }
    });
  }

  /* ------------------------------------------------------------------
     STEPS — the rule-draw as subject.

     Four lines drawn in order, first call to delivery, each with its text
     following a beat behind. This is the only place the shared gesture is
     also the content, which is why the section needs no pictures.
     ------------------------------------------------------------------ */
  function steps() {
    var wrap = document.querySelector('[data-steps]');
    if (!wrap) return;

    var items = gsap.utils.toArray(wrap.querySelectorAll('.step'));
    var tl = gsap.timeline({ scrollTrigger: { trigger: wrap, start: 'top 80%', once: true } });

    items.forEach(function (item, i) {
      var at = i * 0.18;
      tl.fromTo(item.querySelector('.step_rule'), { scaleX: 0 },
        { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, at);
      tl.fromTo(
        [item.querySelector('.step_n'), item.querySelector('h3'), item.querySelector('p')],
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.95, ease: EASE, stagger: 0.06 }, at + 0.25);
    });

    var end = wrap.querySelector('.steps_end');
    if (end) tl.fromTo(end, { scaleX: 0 },
      { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, items.length * 0.18);
  }  /* ------------------------------------------------------------------
     02 · OUR STORY — the dedication.

     The account rises line by line, the site's heading grammar at reading
     size: it is being told. The last sentence does not travel — it fades up
     in place once the account has settled, because a dedication is not
     announced, it is found to be there.

     Triggered once and never scrubbed. Nothing here performs, and no line is
     left half-shown while somebody is reading it.
     ------------------------------------------------------------------ */
  function storyMotion() {
    var story = document.querySelector('#story');
    if (!story) return;

    var block = story.querySelector('.story_ded:not(.story_ded--last)');
    var last = story.querySelector('.story_ded--last');
    var go = story.querySelector('.story_go');
    if (!block) return;

    var tl = gsap.timeline({
      scrollTrigger: { trigger: story.querySelector('.story_in'), start: 'top 78%', once: true }
    });

    var split = null;
    if (canSplit) {
      try {
        split = new SplitText(block, {
          type: 'lines', linesClass: 'line', mask: 'lines', reduceWhiteSpace: false
        });
      } catch (error) { split = null; }
    }

    var settled;
    if (split) {
      gsap.set(block, { opacity: 1 });
      tl.from(split.lines, { yPercent: 108, duration: 1.15, ease: 'expo.out', stagger: 0.11 }, 0);
      settled = 0.11 * (split.lines.length - 1) + 0.7;
    } else {
      tl.fromTo(block, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.1, ease: EASE }, 0);
      settled = 0.8;
    }

    if (last) tl.fromTo(last, { opacity: 0 }, { opacity: 1, duration: 1.4, ease: 'power2.inOut' }, settled);
    if (go) tl.fromTo(go, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, ease: EASE }, settled + 0.9);
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
  veil();

  var started = false;
  function start() {
    if (started) return;
    started = true;
    root.classList.add('motion-ready');
    chapters();
    steps();
    splitHeadings();
    splitWords();
    revealBlocks();
    heroMotion();
    storyMotion();
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
