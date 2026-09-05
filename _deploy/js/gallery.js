/* ============================================================================
   GALLERY — the turning archive, and the range filter.

   Loaded only on /gallery/. No dependency on GSAP: the drum is a single rAF
   loop over one transform, which is cheaper and steadier than driving forty
   tweens, and it has to keep working if the vendor bundle fails.

   PROGRESSIVE ENHANCEMENT
   The markup renders as a horizontally scrolling row of covers. This file
   upgrades it to the drum by adding .is-drum. If it never runs, or the visitor
   asked for reduced motion, the scroller stands and every cover is reachable.
   ============================================================================ */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     THE DRUM
     ------------------------------------------------------------------ */
  var orbit = document.querySelector('[data-orbit]');
  var stage = orbit && orbit.querySelector('[data-orbit-stage]');
  var tiles = stage ? Array.prototype.slice.call(stage.querySelectorAll('[data-orbit-tile]')) : [];

  if (orbit && stage && tiles.length && !reduce) {
    var count = tiles.length;
    var step = 360 / count;                      /* a closed ring */
    var half = Math.tan((step / 2) * Math.PI / 180);

    var angle = 0;        /* degrees turned */
    var velocity = 0;
    var dragging = false;
    var lastX = 0;
    var lastT = 0;
    var frame = null;
    var front = -1;

    var countEl = orbit.querySelector('[data-orbit-count]');
    var nameEl = orbit.querySelector('[data-orbit-name]');
    var progressEl = orbit.querySelector('[data-orbit-progress]');

    /* The radius must agree exactly with the tile width and the angular step,
       or the covers overlap at the front and gap at the edges. Recomputed on
       resize because the tile width is breakpoint-dependent. */
    function measure() {
      var width = window.innerWidth;
      var tile = width >= 1180 ? 264 : width >= 900 ? 220 : 172;
      var gap = tile * 0.34;
      var radius = ((tile + gap) / 2) / half;
      orbit.style.setProperty('--tile', tile + 'px');
      orbit.style.setProperty('--radius', Math.round(radius) + 'px');
    }

    /* Shortest signed distance between two angles, in degrees. */
    function delta(a, b) {
      var d = (a - b) % 360;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      return d;
    }

    function render() {
      stage.style.setProperty('--turn', (-angle).toFixed(3) + 'deg');

      for (var i = 0; i < count; i++) {
        var off = Math.min(1, Math.abs(delta(i * step, angle)) / 46);
        tiles[i].style.setProperty('--a', (i * step).toFixed(3) + 'deg');
        tiles[i].style.setProperty('--off', off.toFixed(3));
      }

      var index = ((Math.round(angle / step) % count) + count) % count;
      if (index !== front) {
        if (front > -1 && tiles[front]) tiles[front].removeAttribute('data-front');
        front = index;
        tiles[front].setAttribute('data-front', '');
        if (countEl) {
          countEl.innerHTML = String(front + 1).padStart(2, '0') +
            '<small>/' + String(count).padStart(2, '0') + '</small>';
        }
        if (nameEl) {
          var label = tiles[front].querySelector('.orbit_tile_cap b');
          if (label) nameEl.textContent = label.textContent;
        }
        if (progressEl) {
          progressEl.style.setProperty('--p', (((front + 1) / count) * 100).toFixed(2) + '%');
        }
      }
    }

    /* Inertia, then a settle onto the nearest cover. Deliberately short: the
       archive should feel weighted, not flung. */
    function loop() {
      frame = null;
      if (dragging) return;

      if (Math.abs(velocity) > 0.02) {
        angle += velocity;
        velocity *= 0.94;
        render();
        frame = requestAnimationFrame(loop);
        return;
      }

      var target = Math.round(angle / step) * step;
      var gap = target - angle;
      if (Math.abs(gap) > 0.02) {
        angle += gap * 0.14;
        render();
        frame = requestAnimationFrame(loop);
        return;
      }
      angle = target;
      render();
    }

    function kick() {
      if (!frame) frame = requestAnimationFrame(loop);
    }

    function turnTo(index) {
      velocity = 0;
      /* Travel the short way round rather than unwinding through the whole ring. */
      angle += delta(index * step, angle);
      kick();
    }

    /* ---- drag ---- */
    stage.addEventListener('pointerdown', function (event) {
      dragging = true;
      velocity = 0;
      lastX = event.clientX;
      lastT = event.timeStamp;
      orbit.classList.add('is-held');
      stage.setPointerCapture(event.pointerId);
    });

    stage.addEventListener('pointermove', function (event) {
      if (!dragging) return;
      var dx = event.clientX - lastX;
      var dt = Math.max(1, event.timeStamp - lastT);
      /* 2.6px of drag per degree — tuned so a comfortable swipe moves about
         four covers rather than spinning the ring. */
      var move = -dx / 2.6;
      angle += move;
      velocity = move / dt * 16;
      lastX = event.clientX;
      lastT = event.timeStamp;
      render();
    });

    function release(event) {
      if (!dragging) return;
      dragging = false;
      orbit.classList.remove('is-held');
      if (event.pointerId !== undefined && stage.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId);
      }
      velocity = Math.max(-6, Math.min(6, velocity));
      kick();
    }
    stage.addEventListener('pointerup', release);
    stage.addEventListener('pointercancel', release);

    /* A drag must not also follow the link it started on. */
    var downX = 0;
    stage.addEventListener('pointerdown', function (e) { downX = e.clientX; }, true);
    tiles.forEach(function (tile) {
      tile.addEventListener('click', function (event) {
        if (Math.abs(event.clientX - downX) > 6) event.preventDefault();
      });
      tile.addEventListener('dragstart', function (event) { event.preventDefault(); });
    });

    /* ---- buttons and keys ---- */
    var prev = orbit.querySelector('[data-orbit-prev]');
    var next = orbit.querySelector('[data-orbit-next]');
    if (prev) prev.addEventListener('click', function () { turnTo(front - 1); });
    if (next) next.addEventListener('click', function () { turnTo(front + 1); });

    orbit.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { turnTo(front - 1); event.preventDefault(); }
      if (event.key === 'ArrowRight') { turnTo(front + 1); event.preventDefault(); }
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { measure(); render(); }, 150);
    });

    orbit.classList.add('is-drum');
    measure();
    render();
  }

  /* ------------------------------------------------------------------
     RANGE FILTER

     The homepage links in as /gallery/?range=football, so the query string is
     read on load and kept in step with the buttons afterwards.
     ------------------------------------------------------------------ */
  var grid = document.querySelector('[data-gallery-grid]');
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));

  if (grid && buttons.length) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-category]'));
    var empty = document.querySelector('[data-gallery-empty]');

    function apply(range, pushState) {
      var shown = 0;
      cards.forEach(function (card) {
        var match = range === 'all' || card.getAttribute('data-category') === range;
        card.hidden = !match;
        if (match) shown++;
      });

      buttons.forEach(function (button) {
        var on = button.getAttribute('data-filter') === range;
        button.classList.toggle('is-on', on);
        button.setAttribute('aria-pressed', String(on));
      });

      if (empty) empty.hidden = shown !== 0;

      /* Hiding cards moves everything below them. */
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();

      if (pushState && window.history && history.replaceState) {
        var url = range === 'all'
          ? window.location.pathname
          : window.location.pathname + '?range=' + encodeURIComponent(range);
        history.replaceState(null, '', url);
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        apply(button.getAttribute('data-filter'), true);
      });
    });

    var requested = new URLSearchParams(window.location.search).get('range');
    if (requested && buttons.some(function (b) { return b.getAttribute('data-filter') === requested; })) {
      apply(requested, false);
    }
  }
})();
