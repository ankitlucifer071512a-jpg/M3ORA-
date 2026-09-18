/* =========================================================
   M3ORA CREATIVE STUDIO — SCRIPT
   Handles: navbar scroll state, mobile menu, scroll reveal,
   services hover preview, custom cursor, reduced motion.
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const body = document.body;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

  if (prefersReducedMotion) {
    body.classList.add('reduce-motion');
  }

  /* -----------------------------------------------------
     1. NAVBAR SCROLL STATE
  ----------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  const updateNavbar = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  };

  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  /* -----------------------------------------------------
     2. MOBILE MENU
  ----------------------------------------------------- */
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMenu = () => {
    mobileMenu.classList.remove('is-open');
    navbar.classList.remove('navbar--menu-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.setAttribute('aria-label', 'Open menu');
    body.style.overflow = '';
  };

  const openMenu = () => {
    mobileMenu.classList.add('is-open');
    navbar.classList.add('navbar--menu-open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    burgerBtn.setAttribute('aria-label', 'Close menu');
    body.style.overflow = 'hidden';
  };

  burgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  /* -----------------------------------------------------
     3. SCROLL REVEAL (IntersectionObserver)
  ----------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.reveal-up, .reveal-line, .reveal-word'
  );

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* Stagger reveal-word children slightly for the brand statement */
  document.querySelectorAll('.statement__headline .reveal-word').forEach((word, i) => {
    word.style.transitionDelay = `${i * 40}ms`;
  });

  /* -----------------------------------------------------
     3b. HERO SHOWREEL VIDEO
     Tries to load portfolio/m3ora-showreel.mp4. If it exists,
     the video is shown and the placeholder is hidden. If it
     doesn't exist (or fails to load), the placeholder stays
     visible and no broken video element is shown.
  ----------------------------------------------------- */
  const heroVideo = document.getElementById('heroVideo');
  const heroPlaceholder = document.getElementById('heroPlaceholder');

  if (heroVideo && heroPlaceholder) {
    heroVideo.addEventListener('loadeddata', () => {
      heroVideo.classList.add('is-ready');
      heroPlaceholder.style.display = 'none';
    });

    heroVideo.addEventListener('error', () => {
      heroVideo.classList.remove('is-ready');
      heroVideo.style.display = 'none';
      heroPlaceholder.style.display = '';
    });

    /* Give the browser a moment to attempt loading; if nothing has
       loaded shortly after, assume the file isn't there yet and
       make sure the placeholder is what's shown. */
    heroVideo.addEventListener('stalled', () => {
      if (heroVideo.readyState === 0) {
        heroVideo.style.display = 'none';
        heroPlaceholder.style.display = '';
      }
    });

    heroVideo.load();
  }

  /* -----------------------------------------------------
     3c. REEL LIGHTBOX / MODAL
     Only cards with a `data-video` attribute (added once a real reel
     file exists — see the HTML comment above the reels grid) become
     clickable. Placeholder "Coming Soon" cards stay inert.
  ----------------------------------------------------- */
  const reelModal = document.getElementById('reelModal');
  const reelModalVideo = document.getElementById('reelModalVideo');
  const reelModalClose = document.getElementById('reelModalClose');
  const reelCards = document.querySelectorAll('.reel-card[data-video]');

  const openReelModal = (src) => {
    if (!reelModal || !reelModalVideo) return;
    reelModalVideo.src = src;
    reelModal.classList.add('is-open');
    reelModal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
    reelModalVideo.play().catch(() => {});
  };

  const closeReelModal = () => {
    if (!reelModal || !reelModalVideo) return;
    reelModal.classList.remove('is-open');
    reelModal.setAttribute('aria-hidden', 'true');
    reelModalVideo.pause();
    reelModalVideo.removeAttribute('src');
    reelModalVideo.load();
    body.style.overflow = '';
  };

  reelCards.forEach((card) => {
    card.classList.add('reel-card--ready');
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('click', () => openReelModal(card.getAttribute('data-video')));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openReelModal(card.getAttribute('data-video'));
      }
    });
  });

  if (reelModalClose) reelModalClose.addEventListener('click', closeReelModal);
  if (reelModal) {
    reelModal.addEventListener('click', (e) => {
      if (e.target === reelModal) closeReelModal();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && reelModal && reelModal.classList.contains('is-open')) {
      closeReelModal();
    }
  });

  /* -----------------------------------------------------
     4. SERVICES HOVER PREVIEW
  ----------------------------------------------------- */
  const servicesPreview = document.getElementById('servicesPreview');
  const serviceItems = document.querySelectorAll('.services__item');

  if (servicesPreview && !isTouchDevice) {
    serviceItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        servicesPreview.setAttribute('data-visual', item.getAttribute('data-visual'));
        servicesPreview.classList.add('is-visible');
      });
      item.addEventListener('mouseleave', () => {
        servicesPreview.classList.remove('is-visible');
      });
    });

    window.addEventListener('mousemove', (e) => {
      servicesPreview.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(1)`;
      servicesPreview.style.left = '0px';
      servicesPreview.style.top = '0px';
    }, { passive: true });
  }

  /* -----------------------------------------------------
     5. CUSTOM CURSOR (auto-disabled on touch devices)
  ----------------------------------------------------- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (isTouchDevice || !cursorDot || !cursorRing) {
    body.classList.add('no-cursor');
  } else {
    let ringX = 0, ringY = 0, targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      cursorDot.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;
    }, { passive: true });

    const animateRing = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    };
    requestAnimationFrame(animateRing);

    const interactiveSelectors = 'a, button, .work-item__media, .services__item';
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '0.6';
    });
  }

  /* -----------------------------------------------------
     6. SMOOTH ANCHOR SCROLL WITH NAVBAR OFFSET
  ----------------------------------------------------- */
  const navbarHeight = () => navbar.offsetHeight;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight() + 1;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

});
