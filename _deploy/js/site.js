(() => {
  const root = document.documentElement;
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentY = window.scrollY;
  let targetY = currentY;
  let raf = 0;

  requestAnimationFrame(() => document.body.classList.add('is-ready'));
  window.addEventListener('pageshow', () => document.body.classList.remove('is-leaving'));

  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
    const length = document.documentElement.scrollHeight - window.innerHeight;
    root.style.setProperty('--scroll-progress', length > 0 ? `${(window.scrollY / length) * 100}%` : '0%');
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const closeNav = () => {
    toggle?.classList.remove('is-open');
    nav?.classList.remove('is-open');
    header?.classList.remove('menu-active');
    document.body.classList.remove('nav-open');
    toggle?.setAttribute('aria-expanded', 'false');
  };
  toggle?.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    toggle.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-active', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !nav?.classList.contains('is-open')) return;
    closeNav();
    toggle?.focus();
  });
  document.addEventListener('click', event => {
    if (!nav?.classList.contains('is-open') || header?.contains(event.target)) return;
    closeNav();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 820) closeNav(); });

  // Derive section names from visible headings so landmark names never drift
  // away from the copy speech-recognition and screen-reader users can see.
  document.querySelectorAll('section').forEach((section, index) => {
    if (section.hasAttribute('aria-label') || section.hasAttribute('aria-labelledby')) return;
    const heading = section.querySelector('h1, h2');
    if (!heading) return;
    if (!heading.id) heading.id = `section-heading-${index + 1}`;
    section.setAttribute('aria-labelledby', heading.id);
  });

  const reveals = [...document.querySelectorAll('.reveal, .reveal-image')];
  if (reduced || !('IntersectionObserver' in window)) reveals.forEach(el => el.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // Supporting pages use the same restrained entrance language as the homepage.
  // Content remains readable before JavaScript; motion only adds a short settling pass.
  const softRevealTargets = [...document.querySelectorAll(
    '.content-page .page-hero h1, .content-page .page-hero-copy, .content-page .page-lead > *, .content-page .editorial-card, .content-page .design-card, .content-page .catalogue-piece, .content-page .catalogue-card, .content-page .design-view, .content-page .contact-list > *, .content-page .prose > *, .content-page .referral-grid article, .content-page .faq details, .content-page .page-cta-grid > *'
  )].filter(el => !el.matches('.reveal, .reveal-image'));
  softRevealTargets.forEach((el, index) => {
    el.classList.add('soft-reveal');
    el.style.setProperty('--soft-delay', `${(index % 3) * 55}ms`);
  });
  if (reduced || !('IntersectionObserver' in window)) softRevealTargets.forEach(el => el.classList.add('is-visible'));
  else {
    const softRevealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      softRevealObserver.unobserve(entry.target);
    }), { threshold: .08, rootMargin: '0px 0px -5% 0px' });
    softRevealTargets.forEach(el => softRevealObserver.observe(el));
  }

  const motionSections = [...document.querySelectorAll('.manifesto, .story, .story-page, .collections, .lookbook, .packages, .assurance')];
  motionSections.forEach(section => section.classList.add('motion-section'));
  if (reduced || !('IntersectionObserver' in window)) motionSections.forEach(section => section.classList.add('is-inview'));
  else {
    const motionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-inview');
    }), { threshold: .08, rootMargin: '0px 0px -10% 0px' });
    motionSections.forEach(section => motionObserver.observe(section));
  }

  const collectionCards = [...document.querySelectorAll('.collections .collection-card')];
  if (reduced || !('IntersectionObserver' in window)) collectionCards.forEach(card => card.classList.add('is-asset-visible'));
  else {
    const collectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-asset-visible');
      collectionObserver.unobserve(entry.target);
    }), { threshold: .32, rootMargin: '0px 0px -4% 0px' });
    collectionCards.forEach(card => collectionObserver.observe(card));
  }

  const heroMedia = document.querySelector('.hero-media');
  const finalMedia = document.querySelector('.final-cta-media');
  const animateScroll = () => {
    currentY += (targetY - currentY) * 0.09;
    if (heroMedia && currentY < window.innerHeight * 1.3) heroMedia.style.transform = `translate3d(0,${currentY * 0.12}px,0)`;
    if (finalMedia) {
      const rect = finalMedia.parentElement.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) finalMedia.style.transform = `translate3d(0,${(rect.top - innerHeight / 2) * -0.035}px,0)`;
    }
    if (Math.abs(targetY - currentY) > .1) raf = requestAnimationFrame(animateScroll); else raf = 0;
  };
  if (!reduced && window.matchMedia('(pointer:fine)').matches) window.addEventListener('scroll', () => {
    targetY = window.scrollY;
    if (!raf) raf = requestAnimationFrame(animateScroll);
  }, { passive: true });

  if (!reduced && window.matchMedia('(pointer:fine)').matches) {
    const hero = document.querySelector('.hero');
    hero?.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--hero-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      hero.style.setProperty('--hero-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });
    document.querySelectorAll('.collection-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--card-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--card-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
        card.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width - .5) * 4}px`);
        card.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height - .5) * 4}px`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--pointer-x', '0px');
        card.style.setProperty('--pointer-y', '0px');
      });
    });
    const storyPortrait = document.querySelector('.story-image--portrait');
    storyPortrait?.addEventListener('pointermove', event => {
      const rect = storyPortrait.getBoundingClientRect();
      storyPortrait.style.setProperty('--story-rx', `${((event.clientY - rect.top) / rect.height - .5) * -2.2}deg`);
      storyPortrait.style.setProperty('--story-ry', `${((event.clientX - rect.left) / rect.width - .5) * 2.8}deg`);
    });
    storyPortrait?.addEventListener('pointerleave', () => {
      storyPortrait.style.setProperty('--story-rx', '0deg');
      storyPortrait.style.setProperty('--story-ry', '0deg');
    });
  }

  document.querySelectorAll('.story-image--portrait').forEach(portrait => portrait.classList.add('memory-portrait-motion'));
  const memoryPortraits = [...document.querySelectorAll('.story-image--portrait.memory-portrait-motion')];
  if (reduced || !('IntersectionObserver' in window)) memoryPortraits.forEach(portrait => portrait.classList.add('is-memory-visible'));
  else {
    const memoryObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-memory-visible');
      memoryObserver.unobserve(entry.target);
    }), { threshold: .34, rootMargin: '0px 0px -5% 0px' });
    memoryPortraits.forEach(portrait => memoryObserver.observe(portrait));
  }

  const lookbookSection = document.querySelector('.lookbook');
  const lookbookItems = [...document.querySelectorAll('.lookbook-grid > .lookbook-item')];
  let lookbookRaf = 0;
  const updateLookbookFolio = () => {
    lookbookRaf = 0;
    if (!lookbookSection || !lookbookItems.length) return;
    if (reduced) {
      lookbookSection.classList.remove('folio-motion');
      return;
    }
    lookbookSection.classList.add('folio-motion');
    const compact = window.innerWidth <= 620 ? .52 : window.innerWidth <= 900 ? .74 : 1;
    const directions = [-1, 1, -1, 1];
    lookbookItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const start = window.innerHeight * .99;
      const finish = window.innerHeight * .32;
      const raw = Math.max(0, Math.min(1, (start - rect.top) / (start - finish)));
      const staggered = Math.max(0, Math.min(1, (raw - index * .035) / (1 - index * .035)));
      const progress = 1 - Math.pow(1 - staggered, 3);
      const remaining = 1 - progress;
      const direction = directions[index] || 1;
      item.style.setProperty('--lookbook-card-y', `${24 * remaining * compact}px`);
      item.style.setProperty('--lookbook-card-r', '0deg');
      item.style.setProperty('--lookbook-art-x', `${direction * (46 + index * 3) * remaining * compact}px`);
      item.style.setProperty('--lookbook-art-y', `${8 * remaining * compact}px`);
      item.style.setProperty('--lookbook-art-r', '0deg');
      item.style.setProperty('--lookbook-art-scale', (.96 + progress * .04).toFixed(3));
      item.style.setProperty('--lookbook-curtain', (1 - progress).toFixed(3));
      item.style.setProperty('--lookbook-progress', progress.toFixed(3));
    });
  };
  if (lookbookSection && lookbookItems.length) {
    updateLookbookFolio();
    const requestLookbookUpdate = () => {
      if (!lookbookRaf) lookbookRaf = requestAnimationFrame(updateLookbookFolio);
    };
    window.addEventListener('scroll', requestLookbookUpdate, { passive: true });
    window.addEventListener('resize', requestLookbookUpdate, { passive: true });
  }

  const sharedAssetFrames = [...document.querySelectorAll('.design-card, .catalogue-piece')];
  const orderHeroArt = document.querySelector('.order-hero-art');
  let sharedAssetRaf = 0;
  sharedAssetFrames.forEach(frame => frame.classList.add('asset-motion'));
  orderHeroArt?.classList.add('asset-motion');
  const updateSharedAssets = () => {
    sharedAssetRaf = 0;
    if (reduced) return;
    sharedAssetFrames.forEach(frame => {
      const rect = frame.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > window.innerHeight + 80) return;
      const centreDelta = rect.top + rect.height / 2 - window.innerHeight / 2;
      const drift = Math.max(-18, Math.min(18, centreDelta * -.032));
      frame.style.setProperty('--asset-scroll-y', `${drift}px`);
    });
    if (orderHeroArt) orderHeroArt.style.setProperty('--asset-scroll-y', `${Math.min(30, window.scrollY * .045)}px`);
  };
  if (sharedAssetFrames.length || orderHeroArt) {
    updateSharedAssets();
    const requestSharedAssetUpdate = () => {
      if (!sharedAssetRaf) sharedAssetRaf = requestAnimationFrame(updateSharedAssets);
    };
    window.addEventListener('scroll', requestSharedAssetUpdate, { passive: true });
    window.addEventListener('resize', requestSharedAssetUpdate, { passive: true });
  }
  if (!reduced && window.matchMedia('(pointer:fine)').matches) {
    sharedAssetFrames.forEach(frame => {
      frame.addEventListener('pointermove', event => {
        const rect = frame.getBoundingClientRect();
        frame.style.setProperty('--asset-x', `${((event.clientX - rect.left) / rect.width - .5) * 8}px`);
        frame.style.setProperty('--asset-y', `${((event.clientY - rect.top) / rect.height - .5) * 8}px`);
        frame.style.setProperty('--asset-spot-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
        frame.style.setProperty('--asset-spot-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
      });
      frame.addEventListener('pointerleave', () => {
        frame.style.setProperty('--asset-x', '0px');
        frame.style.setProperty('--asset-y', '0px');
      });
    });
  }

  const processItems = [...document.querySelectorAll('.process-list > li')];
  const processSection = document.querySelector('.process');
  const processCount = document.querySelector('[data-process-count]');
  let processRaf = 0;
  const updateProcess = () => {
    processRaf = 0;
    if (!processSection || !processItems.length) return;
    const centre = window.innerHeight * 0.52;
    let activeIndex = 0;
    let closest = Infinity;
    processItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const itemProgress = Math.max(0, Math.min(1, (window.innerHeight * .9 - rect.top) / (window.innerHeight * .42 + rect.height)));
      item.style.setProperty('--step-progress', itemProgress.toFixed(3));
      const distance = Math.abs(rect.top + rect.height / 2 - centre);
      if (distance < closest) {
        closest = distance;
        activeIndex = index;
      }
    });
    processItems.forEach((item, index) => item.classList.toggle('is-current', index === activeIndex));
    processSection.style.setProperty('--process-progress', `${((activeIndex + 1) / processItems.length) * 100}%`);
    if (processCount) processCount.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(processItems.length).padStart(2, '0')}`;
  };
  if (processItems.length) {
    updateProcess();
    window.addEventListener('scroll', () => {
      if (!processRaf) processRaf = requestAnimationFrame(updateProcess);
    }, { passive: true });
  }

  const packageSection = document.querySelector('.packages');
  const packageGrid = document.querySelector('.package-grid');
  const packageCards = [...document.querySelectorAll('.package-grid > .package-card')];
  let deckRaf = 0;
  const updatePackageDeck = () => {
    deckRaf = 0;
    if (!packageSection || packageCards.length !== 3) return;
    if (reduced || window.innerWidth <= 900) {
      packageSection.classList.remove('deck-enabled');
      packageCards.forEach(card => ['--deck-x', '--deck-y', '--deck-r'].forEach(prop => card.style.removeProperty(prop)));
      return;
    }
    packageSection.classList.add('deck-enabled');
    const rect = packageGrid.getBoundingClientRect();
    const start = window.innerHeight * .96;
    const finish = window.innerHeight * .38;
    const rawProgress = Math.max(0, Math.min(1, (start - rect.top) / (start - finish)));
    const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);
    const close = 1 - progress;
    const positions = [
      { x: 102 * close, y: 34 * close, r: -7 * close },
      { x: 0, y: 12 * close, r: 1.5 * close },
      { x: -102 * close, y: 34 * close, r: 7 * close }
    ];
    packageCards.forEach((card, index) => {
      card.style.setProperty('--deck-x', `${positions[index].x}%`);
      card.style.setProperty('--deck-y', `${positions[index].y}px`);
      card.style.setProperty('--deck-r', `${positions[index].r}deg`);
    });
    packageSection.style.setProperty('--deck-progress', `${progress * 100}%`);
  };
  if (packageSection && packageCards.length === 3) {
    updatePackageDeck();
    const requestDeckUpdate = () => {
      if (!deckRaf) deckRaf = requestAnimationFrame(updatePackageDeck);
    };
    window.addEventListener('scroll', requestDeckUpdate, { passive: true });
    window.addEventListener('resize', requestDeckUpdate, { passive: true });
  }

  const filterButtons = [...document.querySelectorAll('[data-design-filter]')];
  const designCards = [...document.querySelectorAll('[data-design-card]')];
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.designFilter;
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    designCards.forEach(card => {
      const shown = filter === 'all' || card.dataset.category === filter;
      card.hidden = !shown;
    });
  }));
  if (filterButtons.length) {
    const requestedCollection = new URLSearchParams(location.search).get('collection');
    const requestedButton = filterButtons.find(button => button.dataset.designFilter === requestedCollection);
    requestedButton?.click();
  }

  // A quiet globe of memorial pages. The archive rotates in three dimensions
  // without ever taking over page scroll; drag, swipe, buttons and arrow keys
  // move its inertial camera, while reduced-motion visitors get a still scene.
  const designOrbit = document.querySelector('[data-design-orbit]');
  const orbitTiles = [...document.querySelectorAll('[data-design-orbit-tile]')];
  if (designOrbit && orbitTiles.length) {
    const previousOrbit = designOrbit.querySelector('[data-design-orbit-prev]');
    const nextOrbit = designOrbit.querySelector('[data-design-orbit-next]');
    const orbitCount = designOrbit.querySelector('[data-design-orbit-count]');
    const orbitName = designOrbit.querySelector('[data-design-orbit-name]');
    const orbitProgress = designOrbit.querySelector('[data-design-orbit-progress]');
    let yaw = 0;
    let targetYaw = 0;
    let pitch = -.06;
    let targetPitch = -.06;
    let velocityX = 0;
    let velocityY = 0;
    let frame = 0;
    let previousTime = performance.now();
    let dragging = false;
    let pointerId = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartYaw = 0;
    let dragStartPitch = 0;
    let lastDragX = 0;
    let lastDragY = 0;
    let lastDragTime = 0;
    let dragDistance = 0;
    let suppressClick = false;
    let orbitInView = true;
    let activeIndex = -1;
    let activeUntil = performance.now() + 1600;
    let lastInteraction = performance.now();

    const wrapIndex = value => ((value % orbitTiles.length) + orbitTiles.length) % orbitTiles.length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const points = orbitTiles.map((_, index) => {
      const vertical = 1 - ((index + .5) / orbitTiles.length) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - vertical * vertical));
      const angle = index * goldenAngle;
      return { x: Math.cos(angle) * radius, y: vertical, z: Math.sin(angle) * radius };
    });
    const scheduleOrbit = () => {
      if (!frame) frame = requestAnimationFrame(renderOrbit);
    };
    const setActiveDesign = nearestIndex => {
      orbitTiles.forEach((tile, index) => {
        if (index === nearestIndex) tile.setAttribute('aria-current', 'true');
        else tile.removeAttribute('aria-current');
      });
      if (nearestIndex === activeIndex) return;
      activeIndex = nearestIndex;
      const title = orbitTiles[nearestIndex].querySelector('.design-orbit-meta strong')?.textContent?.trim() || '';
      if (orbitCount) orbitCount.textContent = `${String(nearestIndex + 1).padStart(2, '0')} / ${String(orbitTiles.length).padStart(2, '0')}`;
      if (orbitName) orbitName.textContent = title;
      if (orbitProgress) orbitProgress.style.transform = `scaleX(${(nearestIndex + 1) / orbitTiles.length})`;
    };
    const renderOrbit = time => {
      frame = 0;
      const elapsed = Math.min(40, Math.max(0, time - previousTime));
      previousTime = time;
      if (!reduced && !dragging) {
        targetYaw += velocityX * elapsed;
        targetPitch = Math.max(-.42, Math.min(.42, targetPitch + velocityY * elapsed));
        velocityX *= Math.pow(.91, elapsed / 16.67);
        velocityY *= Math.pow(.88, elapsed / 16.67);
        // Once the visitor has paused, the archive resumes an almost
        // imperceptible turn so it feels alive rather than promotional.
        if (time - lastInteraction > 2400 && Math.abs(velocityX) < .00002) targetYaw += elapsed * .000055;
      }
      yaw += (targetYaw - yaw) * Math.min(1, elapsed * (dragging ? .04 : .018));
      pitch += (targetPitch - pitch) * Math.min(1, elapsed * (dragging ? .04 : .018));
      const compact = window.innerWidth <= 560;
      const tablet = window.innerWidth <= 900;
      const stage = designOrbit.querySelector('.design-orbit-stage');
      const stageRect = stage?.getBoundingClientRect();
      const radiusX = Math.min((stageRect?.width || window.innerWidth) * (compact ? .37 : tablet ? .38 : .39), compact ? 142 : tablet ? 280 : 520);
      const radiusY = Math.min((stageRect?.height || window.innerHeight * .55) * (compact ? .35 : .43), compact ? 112 : tablet ? 210 : 310);
      const radiusZ = compact ? 115 : tablet ? 210 : 350;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      let nearestIndex = 0;
      let nearestDepth = -Infinity;

      orbitTiles.forEach((tile, index) => {
        const point = points[index];
        const rotatedX = point.x * cosY + point.z * sinY;
        const yawZ = -point.x * sinY + point.z * cosY;
        const rotatedY = point.y * cosP - yawZ * sinP;
        const rotatedZ = point.y * sinP + yawZ * cosP;
        if (rotatedZ > nearestDepth) {
          nearestDepth = rotatedZ;
          nearestIndex = index;
        }
        const x = rotatedX * radiusX;
        const y = rotatedY * radiusY;
        const z = rotatedZ * radiusZ;
        const depth = (rotatedZ + 1) * .5;
        const visible = rotatedZ > (compact ? -.22 : -.42);
        const scale = (compact ? .69 : .64) + depth * (compact ? .34 : .48);
        const rotateY = Math.max(-24, Math.min(24, -rotatedX * 22));
        const rotateX = Math.max(-8, Math.min(8, rotatedY * 7));
        tile.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px),calc(-50% + ${y.toFixed(2)}px),${z.toFixed(2)}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        tile.style.opacity = visible ? String(Math.max(.13, .18 + depth * .82)) : '0';
        tile.style.pointerEvents = rotatedZ > .52 ? 'auto' : 'none';
        tile.style.zIndex = String(Math.max(1, Math.round(depth * 100)));
        tile.tabIndex = rotatedZ > .66 ? 0 : -1;
        tile.classList.toggle('is-near', rotatedZ > .66);
      });
      setActiveDesign(nearestIndex);
      const moving = dragging || Math.abs(targetYaw - yaw) > .00008
        || Math.abs(targetPitch - pitch) > .00008 || Math.abs(velocityX) > .00001
        || Math.abs(velocityY) > .00001 || (!reduced && time - lastInteraction > 2400)
        || time < activeUntil;
      if (orbitInView && moving) scheduleOrbit();
    };

    const wakeOrbit = duration => {
      activeUntil = performance.now() + duration;
      // Never reset the animation clock while a frame is already queued.
      // High-frequency pointer and scroll events would otherwise starve the
      // interpolation and make the camera appear to twitch.
      if (!frame) previousTime = performance.now();
      scheduleOrbit();
    };
    const moveOrbit = direction => {
      velocityX = 0;
      velocityY = 0;
      targetYaw += direction * goldenAngle * .62;
      lastInteraction = performance.now();
      wakeOrbit(1400);
    };
    const releaseOrbit = event => {
      if (!dragging || (event && event.pointerId !== pointerId)) return;
      dragging = false;
      designOrbit.classList.remove('is-dragging');
      if (event && designOrbit.hasPointerCapture?.(event.pointerId)) designOrbit.releasePointerCapture(event.pointerId);
      pointerId = null;
      velocityX *= 1.22;
      velocityY *= .8;
      suppressClick = dragDistance > 8;
      lastInteraction = performance.now();
      wakeOrbit(1800);
    };

    designOrbit.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.target.closest('button')) return;
      dragging = true;
      pointerId = event.pointerId;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragStartYaw = targetYaw;
      dragStartPitch = targetPitch;
      lastDragX = event.clientX;
      lastDragY = event.clientY;
      lastDragTime = performance.now();
      dragDistance = 0;
      velocityX = 0;
      velocityY = 0;
      lastInteraction = performance.now();
      designOrbit.classList.add('is-dragging');
      designOrbit.setPointerCapture?.(event.pointerId);
      wakeOrbit(1800);
    });
    designOrbit.addEventListener('dragstart', event => event.preventDefault());
    designOrbit.addEventListener('pointermove', event => {
      if (!dragging || event.pointerId !== pointerId) return;
      const now = performance.now();
      const elapsed = Math.max(1, now - lastDragTime);
      const deltaX = event.clientX - dragStartX;
      const deltaY = event.clientY - dragStartY;
      const sensitivity = window.innerWidth <= 560 ? .009 : .0065;
      dragDistance = Math.hypot(deltaX, deltaY);
      targetYaw = dragStartYaw + deltaX * sensitivity;
      targetPitch = Math.max(-.42, Math.min(.42, dragStartPitch - deltaY * sensitivity * .55));
      velocityX = (event.clientX - lastDragX) * sensitivity / elapsed;
      velocityY = -(event.clientY - lastDragY) * sensitivity * .45 / elapsed;
      lastDragX = event.clientX;
      lastDragY = event.clientY;
      lastDragTime = now;
      wakeOrbit(1800);
    });
    designOrbit.addEventListener('pointerup', releaseOrbit);
    designOrbit.addEventListener('pointercancel', releaseOrbit);
    designOrbit.addEventListener('click', event => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }, true);
    previousOrbit?.addEventListener('click', () => moveOrbit(-1));
    nextOrbit?.addEventListener('click', () => moveOrbit(1));
    designOrbit.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      moveOrbit(event.key === 'ArrowLeft' ? -1 : 1);
    });
    window.addEventListener('resize', () => wakeOrbit(900), { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        orbitInView = Boolean(entry?.isIntersecting);
        if (orbitInView) wakeOrbit(900);
      }, { threshold: .02 }).observe(designOrbit);
    }
    setActiveDesign(0);
    scheduleOrbit();
  }

  const clickableCards = [...document.querySelectorAll('.collection-card, .catalogue-card, .design-card, .catalogue-piece, .package-card, .editorial-card, .lookbook-item')]
    .filter(card => card.querySelector('a[href]'));
  clickableCards.forEach(card => {
    card.classList.add('is-clickable');
    card.addEventListener('click', event => {
      if (event.target.closest('a,button,input,select,textarea,summary')) return;
      card.querySelector('a[href]')?.click();
    });
  });

  const memoryFinale = document.querySelector('[data-memory-finale]');
  const memoryLines = [...document.querySelectorAll('.memory-echo > span')];
  let memoryRaf = 0;
  const updateMemoryFinale = () => {
    memoryRaf = 0;
    if (!memoryFinale) return;
    if (reduced) {
      memoryFinale.classList.add('is-resolved');
      memoryLines.forEach(line => line.classList.add('is-active'));
      return;
    }
    const rect = memoryFinale.getBoundingClientRect();
    const entryLead = window.innerHeight * .72;
    const distance = Math.max(1, rect.height - window.innerHeight + entryLead);
    const progress = Math.max(0, Math.min(1, (entryLead - rect.top) / distance));
    memoryFinale.style.setProperty('--memory-progress', progress.toFixed(3));
    memoryFinale.style.setProperty('--memory-scale', (1.08 - progress * .045).toFixed(4));
    memoryLines.forEach((line, index) => line.classList.toggle('is-active', progress >= index * .2));
    memoryFinale.classList.toggle('is-resolved', progress >= .7);
  };
  if (memoryFinale) {
    updateMemoryFinale();
    window.addEventListener('scroll', () => {
      if (!memoryRaf) memoryRaf = requestAnimationFrame(updateMemoryFinale);
    }, { passive: true });
  }

  // Motion belongs to the page, not to a novelty cursor. The native pointer
  // stays intact while the surface beneath it receives a slow refracted light,
  // minute depth and a short water-ring response on intentional contact.
  if (!reduced && window.matchMedia('(pointer:fine)').matches) {
    const flowSelector = '.hero,.page-hero,.design-detail-art,.story-image--portrait,.collection-card,.lookbook-item,.package-card,.editorial-card,.catalogue-card,.design-card,.catalogue-piece,.design-orbit-tile,.design-view,.partner-mark,.order-step';
    const flowSurfaces = [...document.querySelectorAll(flowSelector)];
    const visibleFlowSurfaces = new Set();
    let activeFlowSurface = null;
    let lastFlowX = 0;
    let lastFlowY = 0;
    let lastFlowTime = performance.now();
    let flowScrollFrame = 0;

    flowSurfaces.forEach(surface => {
      surface.classList.add('flow-surface');
      const refraction = document.createElement('span');
      refraction.className = 'flow-refraction';
      refraction.setAttribute('aria-hidden', 'true');
      surface.append(refraction);
    });

    const leaveFlowSurface = surface => {
      if (!surface) return;
      surface.classList.remove('is-flowing');
      surface.style.setProperty('--flow-parallax-x', '0px');
      surface.style.setProperty('--flow-parallax-y', surface.style.getPropertyValue('--flow-scroll-y') || '0px');
    };
    document.addEventListener('pointermove', event => {
      const now = performance.now();
      const elapsed = Math.max(8, now - lastFlowTime);
      const deltaX = event.clientX - lastFlowX;
      const deltaY = event.clientY - lastFlowY;
      const speed = Math.min(1, Math.hypot(deltaX, deltaY) / elapsed / 1.8);
      lastFlowX = event.clientX;
      lastFlowY = event.clientY;
      lastFlowTime = now;

      const nextSurface = event.target.closest?.(flowSelector) || null;
      if (nextSurface !== activeFlowSurface) {
        leaveFlowSurface(activeFlowSurface);
        activeFlowSurface = nextSurface;
        activeFlowSurface?.classList.add('is-flowing');
      }
      if (!activeFlowSurface) return;
      const rect = activeFlowSurface.getBoundingClientRect();
      const nx = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const ny = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      const scrollY = Number(activeFlowSurface.style.getPropertyValue('--flow-scroll-y').replace('px', '')) || 0;
      activeFlowSurface.style.setProperty('--flow-x', `${(nx * 100).toFixed(1)}%`);
      activeFlowSurface.style.setProperty('--flow-y', `${(ny * 100).toFixed(1)}%`);
      activeFlowSurface.style.setProperty('--flow-stretch', (1 + speed * .42).toFixed(3));
      activeFlowSurface.style.setProperty('--flow-angle', `${(Math.atan2(deltaY, deltaX) * 180 / Math.PI).toFixed(1)}deg`);
      activeFlowSurface.style.setProperty('--flow-parallax-x', `${((nx - .5) * -7).toFixed(2)}px`);
      activeFlowSurface.style.setProperty('--flow-parallax-y', `${(scrollY + (ny - .5) * -5).toFixed(2)}px`);
      if (activeFlowSurface.classList.contains('design-detail-art')) {
        activeFlowSurface.style.setProperty('--detail-ry', `${((nx - .5) * 3.2).toFixed(2)}deg`);
        activeFlowSurface.style.setProperty('--detail-rx', `${((.5 - ny) * 2.6).toFixed(2)}deg`);
        activeFlowSurface.style.setProperty('--detail-x', `${((nx - .5) * 6).toFixed(2)}px`);
        activeFlowSurface.style.setProperty('--detail-y', `${((ny - .5) * 4).toFixed(2)}px`);
      }
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => {
      leaveFlowSurface(activeFlowSurface);
      activeFlowSurface = null;
    });
    document.addEventListener('pointerdown', event => {
      const surface = event.target.closest?.(flowSelector);
      if (!surface || event.button !== 0) return;
      const rect = surface.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'flow-contact';
      ripple.setAttribute('aria-hidden', 'true');
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      surface.append(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });

    const updateFlowScroll = () => {
      flowScrollFrame = 0;
      visibleFlowSurfaces.forEach(surface => {
        const rect = surface.getBoundingClientRect();
        const centre = (rect.top + rect.height * .5 - window.innerHeight * .5) / window.innerHeight;
        const drift = Math.max(-7, Math.min(7, centre * -7));
        surface.style.setProperty('--flow-scroll-y', `${drift.toFixed(2)}px`);
        if (surface !== activeFlowSurface) surface.style.setProperty('--flow-parallax-y', `${drift.toFixed(2)}px`);
      });
    };
    if ('IntersectionObserver' in window) {
      const flowObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) visibleFlowSurfaces.add(entry.target);
        else visibleFlowSurfaces.delete(entry.target);
      }), { rootMargin: '12% 0px' });
      flowSurfaces.forEach(surface => flowObserver.observe(surface));
    }
    window.addEventListener('scroll', () => {
      if (!flowScrollFrame) flowScrollFrame = requestAnimationFrame(updateFlowScroll);
    }, { passive: true });
    updateFlowScroll();
  }

  document.addEventListener('click', event => {
    if (reduced || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target || link.hasAttribute('download')) return;
    const rawHref = link.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(rawHref)) return;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) return;
    if (destination.pathname === window.location.pathname && destination.search === window.location.search && destination.hash) return;
    event.preventDefault();
    closeNav();
    document.body.classList.add('is-leaving');
    window.setTimeout(() => { window.location.href = destination.href; }, 420);
  });
})();
