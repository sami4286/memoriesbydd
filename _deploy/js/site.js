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
  window.addEventListener('resize', () => { if (window.innerWidth > 820) closeNav(); });

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

  const motionSections = [...document.querySelectorAll('.story, .collections, .lookbook, .packages, .assurance')];
  motionSections.forEach(section => section.classList.add('motion-section'));
  if (reduced || !('IntersectionObserver' in window)) motionSections.forEach(section => section.classList.add('is-inview'));
  else {
    const motionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-inview');
    }), { threshold: .08, rootMargin: '0px 0px -10% 0px' });
    motionSections.forEach(section => motionObserver.observe(section));
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
        card.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width - .5) * 10}px`);
        card.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height - .5) * 10}px`);
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
    const start = window.innerHeight * .94;
    const finish = window.innerHeight * .3;
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
