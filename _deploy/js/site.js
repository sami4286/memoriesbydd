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
    document.querySelectorAll('.button, .nav-cta').forEach(item => {
      item.addEventListener('pointermove', event => {
        const rect = item.getBoundingClientRect();
        item.style.transform = `translate3d(${(event.clientX - rect.left - rect.width / 2) * .08}px,${(event.clientY - rect.top - rect.height / 2) * .12}px,0)`;
      });
      item.addEventListener('pointerleave', () => { item.style.transform = ''; });
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

  // The design archive behaves like an inertial exhibition wall: drag has
  // momentum, the pointer shifts the camera, and the active work stays a link.
  const designOrbit = document.querySelector('[data-design-orbit]');
  const orbitTiles = [...document.querySelectorAll('[data-design-orbit-tile]')];
  if (designOrbit && orbitTiles.length) {
    const previousOrbit = designOrbit.querySelector('[data-design-orbit-prev]');
    const nextOrbit = designOrbit.querySelector('[data-design-orbit-next]');
    const orbitCount = designOrbit.querySelector('[data-design-orbit-count]');
    const orbitName = designOrbit.querySelector('[data-design-orbit-name]');
    const orbitProgress = designOrbit.querySelector('[data-design-orbit-progress]');
    let position = 0;
    let targetPosition = 0;
    let inertia = 0;
    let previousTime = performance.now();
    let dragging = false;
    let pointerId = null;
    let dragStartX = 0;
    let dragStartPosition = 0;
    let lastDragX = 0;
    let lastDragTime = 0;
    let dragDistance = 0;
    let suppressClick = false;
    let orbitInView = true;
    let orbitFrame = 0;
    let interactionUntil = performance.now() + 1800;
    let cameraX = 0;
    let cameraY = 0;
    let cameraTargetX = 0;
    let cameraTargetY = 0;
    let activeIndex = -1;

    const tileSpacing = () => window.innerWidth <= 560
      ? 178
      : window.innerWidth <= 900
        ? Math.min(300, window.innerWidth * .36)
        : Math.min(355, Math.max(285, window.innerWidth * .225));
    const wrapIndex = value => ((value % orbitTiles.length) + orbitTiles.length) % orbitTiles.length;
    const signedDistance = (index, value) => {
      const half = orbitTiles.length / 2;
      return wrapIndex(index - value + half) - half;
    };
    const scheduleOrbit = () => {
      if (!orbitFrame) orbitFrame = requestAnimationFrame(renderOrbit);
    };
    const renderOrbit = time => {
      orbitFrame = 0;
      const elapsed = Math.min(40, Math.max(0, time - previousTime));
      previousTime = time;
      if (!reduced && !dragging) {
        if (Math.abs(inertia) > .00002) {
          targetPosition += inertia * elapsed;
          inertia *= Math.pow(.9, elapsed / 16.67);
        } else if (time < interactionUntil) {
          targetPosition += (Math.round(targetPosition) - targetPosition) * Math.min(1, elapsed * .012);
        } else if (!designOrbit.matches(':hover') && !designOrbit.matches(':focus-within')) {
          targetPosition += elapsed * .000055;
        }
      }
      position += (targetPosition - position) * Math.min(1, elapsed * (dragging ? .026 : .012));
      cameraX += (cameraTargetX - cameraX) * Math.min(1, elapsed * .008);
      cameraY += (cameraTargetY - cameraY) * Math.min(1, elapsed * .008);
      const spacing = tileSpacing();
      const compact = window.innerWidth <= 560;
      const visibleLimit = compact ? 2.35 : 4.2;

      orbitTiles.forEach((tile, index) => {
        const relative = signedDistance(index, position);
        const distance = Math.abs(relative);
        const visible = distance < visibleLimit;
        const x = relative * spacing + cameraX * Math.max(.25, 1 - distance * .16);
        const y = Math.pow(distance, 1.34) * (compact ? 12 : 23) + cameraY * Math.max(.2, 1 - distance * .2);
        const depth = 185 - distance * (compact ? 150 : 178);
        const rotateY = Math.max(-58, Math.min(58, relative * -18.5 + cameraX * -.045));
        const rotateZ = Math.max(-4, Math.min(4, relative * -.9));
        const scale = 1 - Math.min(.32, distance * (compact ? .085 : .065));
        tile.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px),calc(-50% + ${y.toFixed(2)}px),${depth.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        tile.style.opacity = visible ? String(Math.max(.06, 1 - Math.max(0, distance - .45) * .24)) : '0';
        tile.style.pointerEvents = distance < 1.3 ? 'auto' : 'none';
        tile.style.zIndex = String(Math.max(1, 50 - Math.round(distance * 8)));
        tile.tabIndex = distance < .58 ? 0 : -1;
        tile.classList.toggle('is-near', distance < .52);
      });
      const nearestIndex = wrapIndex(Math.round(position));
      orbitTiles.forEach((tile, index) => {
        if (index === nearestIndex) tile.setAttribute('aria-current', 'true');
        else tile.removeAttribute('aria-current');
      });
      if (nearestIndex !== activeIndex) {
        activeIndex = nearestIndex;
        const title = orbitTiles[nearestIndex].querySelector('.design-orbit-meta strong')?.textContent?.trim() || '';
        if (orbitCount) orbitCount.textContent = `${String(nearestIndex + 1).padStart(2, '0')} / ${String(orbitTiles.length).padStart(2, '0')}`;
        if (orbitName) orbitName.textContent = title;
        if (orbitProgress) orbitProgress.style.width = `${((nearestIndex + 1) / orbitTiles.length) * 100}%`;
      }
      if (!reduced && (orbitInView || dragging)) scheduleOrbit();
    };

    const releaseOrbit = event => {
      if (!dragging || (event && event.pointerId !== pointerId)) return;
      dragging = false;
      designOrbit.classList.remove('is-dragging');
      if (event && designOrbit.hasPointerCapture?.(event.pointerId)) designOrbit.releasePointerCapture(event.pointerId);
      pointerId = null;
      inertia *= 1.55;
      interactionUntil = performance.now() + 4600;
      suppressClick = dragDistance > 8;
    };
    designOrbit.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.target.closest('button')) return;
      dragging = true;
      pointerId = event.pointerId;
      dragStartX = event.clientX;
      dragStartPosition = targetPosition;
      lastDragX = event.clientX;
      lastDragTime = performance.now();
      dragDistance = 0;
      inertia = 0;
      designOrbit.classList.add('is-dragging');
      designOrbit.setPointerCapture?.(event.pointerId);
    });
    designOrbit.addEventListener('pointermove', event => {
      const rect = designOrbit.getBoundingClientRect();
      cameraTargetX = ((event.clientX - rect.left) / rect.width - .5) * (window.innerWidth <= 560 ? 9 : 30);
      cameraTargetY = ((event.clientY - rect.top) / rect.height - .5) * (window.innerWidth <= 560 ? 6 : 17);
      const nearTile = orbitTiles.find(tile => tile.classList.contains('is-near'));
      if (nearTile) {
        const tileRect = nearTile.getBoundingClientRect();
        const nx = Math.max(0, Math.min(1, (event.clientX - tileRect.left) / tileRect.width));
        const ny = Math.max(0, Math.min(1, (event.clientY - tileRect.top) / tileRect.height));
        nearTile.style.setProperty('--orbit-light-x', `${(nx * 100).toFixed(1)}%`);
        nearTile.style.setProperty('--orbit-light-y', `${(ny * 100).toFixed(1)}%`);
        nearTile.style.setProperty('--orbit-art-x', `${((nx - .5) * 9).toFixed(2)}px`);
        nearTile.style.setProperty('--orbit-art-y', `${((ny - .5) * 7).toFixed(2)}px`);
      }
      if (!dragging || event.pointerId !== pointerId) return;
      const now = performance.now();
      const elapsed = Math.max(1, now - lastDragTime);
      const delta = event.clientX - dragStartX;
      dragDistance = Math.abs(delta);
      targetPosition = dragStartPosition - delta / tileSpacing();
      inertia = -(event.clientX - lastDragX) / tileSpacing() / elapsed;
      lastDragX = event.clientX;
      lastDragTime = now;
      scheduleOrbit();
    });
    designOrbit.addEventListener('pointerleave', () => {
      cameraTargetX = 0;
      cameraTargetY = 0;
      scheduleOrbit();
    });
    designOrbit.addEventListener('pointerup', releaseOrbit);
    designOrbit.addEventListener('pointercancel', releaseOrbit);
    designOrbit.addEventListener('click', event => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }, true);
    const moveOrbit = direction => {
      inertia = 0;
      targetPosition = Math.round(targetPosition) + direction;
      interactionUntil = performance.now() + 4200;
      scheduleOrbit();
    };
    previousOrbit?.addEventListener('click', () => moveOrbit(-1));
    nextOrbit?.addEventListener('click', () => moveOrbit(1));
    designOrbit.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      moveOrbit(event.key === 'ArrowLeft' ? -1 : 1);
    });
    designOrbit.addEventListener('wheel', event => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) * 1.15) return;
      event.preventDefault();
      targetPosition += event.deltaX / tileSpacing();
      interactionUntil = performance.now() + 3600;
      scheduleOrbit();
    }, { passive: false });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        orbitInView = Boolean(entry?.isIntersecting);
        previousTime = performance.now();
        if (orbitInView) scheduleOrbit();
      }, { threshold: .02 }).observe(designOrbit);
    }
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

  // A material-aware current replaces the old follower. A smoothed filament
  // glides between pointer positions while the actual surface underneath it
  // receives light, depth and a directional response.
  if (!reduced && window.matchMedia('(pointer:fine)').matches) {
    const currentCanvas = document.createElement('canvas');
    currentCanvas.className = 'cursor-current';
    currentCanvas.setAttribute('aria-hidden', 'true');
    document.body.append(currentCanvas);
    const currentContext = currentCanvas.getContext('2d', { alpha: true });
    let currentWidth = 0;
    let currentHeight = 0;
    let currentDpr = 1;
    let targetCurrentX = 0;
    let targetCurrentY = 0;
    let currentX = 0;
    let currentY = 0;
    let currentSeen = false;
    let currentFrame = 0;
    let currentPreviousTime = performance.now();
    let lastPointerMove = 0;
    const currentPoints = [];

    const resizeCurrent = () => {
      currentWidth = window.innerWidth;
      currentHeight = window.innerHeight;
      currentDpr = Math.min(2, window.devicePixelRatio || 1);
      currentCanvas.width = Math.round(currentWidth * currentDpr);
      currentCanvas.height = Math.round(currentHeight * currentDpr);
      currentCanvas.style.width = `${currentWidth}px`;
      currentCanvas.style.height = `${currentHeight}px`;
    };
    const scheduleCurrent = () => {
      if (!currentFrame && currentContext) currentFrame = requestAnimationFrame(drawCurrent);
    };
    const drawCurrent = time => {
      currentFrame = 0;
      const elapsed = Math.min(40, Math.max(0, time - currentPreviousTime));
      currentPreviousTime = time;
      currentContext.setTransform(currentDpr, 0, 0, currentDpr, 0, 0);
      currentContext.clearRect(0, 0, currentWidth, currentHeight);

      if (currentSeen && time - lastPointerMove < 900) {
        const dx = targetCurrentX - currentX;
        const dy = targetCurrentY - currentY;
        currentX += dx * Math.min(.42, elapsed * .018);
        currentY += dy * Math.min(.42, elapsed * .018);
        const speed = Math.min(1, Math.hypot(dx, dy) / 70);
        const previous = currentPoints[currentPoints.length - 1];
        if (!previous || Math.hypot(currentX - previous.x, currentY - previous.y) > 1.4) {
          currentPoints.push({ x: currentX, y: currentY, born: time, speed });
        }
      }
      while (currentPoints.length > 38 || (currentPoints[0] && time - currentPoints[0].born > 920)) currentPoints.shift();

      const overLight = currentCanvas.classList.contains('is-over-light');
      for (let index = 0; index < currentPoints.length - 1; index += 1) {
        const point = currentPoints[index];
        const next = currentPoints[index + 1];
        const life = Math.max(0, 1 - (time - point.born) / 920);
        const dx = next.x - point.x;
        const dy = next.y - point.y;
        const length = Math.max(1, Math.hypot(dx, dy));
        const wave = Math.sin(time * .004 + index * .68) * 2.4 * life;
        const normalX = -dy / length * wave;
        const normalY = dx / length * wave;

        currentContext.beginPath();
        currentContext.moveTo(point.x + normalX, point.y + normalY);
        currentContext.lineTo(next.x + normalX, next.y + normalY);
        currentContext.lineCap = 'round';
        currentContext.lineWidth = 10 + point.speed * 15;
        currentContext.strokeStyle = overLight
          ? `rgba(71,45,24,${(.035 * life).toFixed(3)})`
          : `rgba(219,180,124,${(.055 * life).toFixed(3)})`;
        currentContext.stroke();

        currentContext.beginPath();
        currentContext.moveTo(point.x - normalX * .45, point.y - normalY * .45);
        currentContext.lineTo(next.x - normalX * .45, next.y - normalY * .45);
        currentContext.lineWidth = .8 + point.speed * 1.7;
        currentContext.strokeStyle = overLight
          ? `rgba(91,57,30,${(.27 * life).toFixed(3)})`
          : `rgba(239,211,169,${(.29 * life).toFixed(3)})`;
        currentContext.stroke();
      }
      if (currentPoints.length || time - lastPointerMove < 950) currentFrame = requestAnimationFrame(drawCurrent);
    };

    const surfaceSelector = '.hero,.page-hero,.design-detail-art,.story-image--portrait,.collection-card,.lookbook-item,.package-card,.editorial-card,.catalogue-card,.design-card,.catalogue-piece,.design-orbit-tile,.design-view,.partner-mark,.order-step';
    const cursorSurfaces = [...document.querySelectorAll(surfaceSelector)];
    cursorSurfaces.forEach(surface => {
      surface.classList.add('cursor-surface');
      if (surface.matches('.collection-card--classic,.collection-card--standard,.package-card--featured')) surface.classList.add('cursor-surface--light');
      const surfaceLight = document.createElement('span');
      surfaceLight.className = 'cursor-surface-light';
      surfaceLight.setAttribute('aria-hidden', 'true');
      surface.append(surfaceLight);
      surface.addEventListener('pointerenter', () => surface.classList.add('is-cursor-active'));
      surface.addEventListener('pointermove', event => {
        const rect = surface.getBoundingClientRect();
        const nx = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const ny = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        surface.style.setProperty('--surface-x', `${(nx * 100).toFixed(1)}%`);
        surface.style.setProperty('--surface-y', `${(ny * 100).toFixed(1)}%`);
        surface.style.setProperty('--surface-angle', `${(Math.atan2(ny - .5, nx - .5) * 180 / Math.PI).toFixed(1)}deg`);
        if (surface.classList.contains('design-detail-art')) {
          surface.style.setProperty('--detail-ry', `${(-2 + (nx - .5) * 5).toFixed(2)}deg`);
          surface.style.setProperty('--detail-rx', `${(.5 - (ny - .5) * 4).toFixed(2)}deg`);
          surface.style.setProperty('--detail-x', `${((nx - .5) * 9).toFixed(2)}px`);
          surface.style.setProperty('--detail-y', `${((ny - .5) * 7).toFixed(2)}px`);
        }
      });
      surface.addEventListener('pointerleave', () => surface.classList.remove('is-cursor-active'));
    });

    const magneticTargets = [...document.querySelectorAll('.button,.nav-cta,.contact-icon,.text-link,.catalogue-filters button,.design-orbit-controls button')];
    magneticTargets.forEach(target => {
      target.classList.add('cursor-magnetic');
      target.addEventListener('pointermove', event => {
        const rect = target.getBoundingClientRect();
        target.style.setProperty('--magnetic-x', `${((event.clientX - rect.left) / rect.width - .5) * 7}px`);
        target.style.setProperty('--magnetic-y', `${((event.clientY - rect.top) / rect.height - .5) * 7}px`);
      });
      target.addEventListener('pointerleave', () => {
        target.style.setProperty('--magnetic-x', '0px');
        target.style.setProperty('--magnetic-y', '0px');
      });
    });

    resizeCurrent();
    window.addEventListener('resize', resizeCurrent, { passive: true });
    window.addEventListener('pointermove', event => {
      targetCurrentX = event.clientX;
      targetCurrentY = event.clientY;
      lastPointerMove = performance.now();
      if (!currentSeen) {
        currentSeen = true;
        currentX = targetCurrentX;
        currentY = targetCurrentY;
        currentPoints.push({ x: currentX, y: currentY, born: lastPointerMove, speed: 0 });
      }
      const lightSurface = event.target.closest?.('.cursor-surface--light');
      currentCanvas.classList.toggle('is-over-light', Boolean(lightSurface));
      scheduleCurrent();
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => {
      currentSeen = false;
      lastPointerMove = performance.now() - 1000;
      scheduleCurrent();
    });
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
