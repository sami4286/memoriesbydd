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
    '.content-page .page-hero h1, .content-page .page-hero-copy, .content-page .page-lead > *, .content-page .editorial-card, .content-page .design-card, .content-page .catalogue-piece, .content-page .contact-list > *, .content-page .prose > *, .content-page .referral-grid article, .content-page .faq details, .content-page .page-cta-grid > *'
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
    const start = window.innerHeight * .78;
    const finish = window.innerHeight * .08;
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
