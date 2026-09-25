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
     3c. PORTFOLIO DATA
     One entry per .reel-card, matched by its data-project index.
     Used to fill in the case-study modal below.
  ----------------------------------------------------- */
  const PROJECTS = [
    {
      name: 'Eyewear Brand',
      category: 'Brand / Social Media / Video',
      video: 'portfolio/video/savefy.mp4',
      intro: 'Visual content created for a spectacles and eyewear brand serving the Qatar market. The project focused on creating engaging social media content that presents the brand and its eyewear in a clean, modern and visually appealing format.',
      details: { 'Client / Brand': 'Eyewear Brand', 'Industry': 'Eyewear / Spectacles', 'Market': 'Qatar', 'Project Type': 'Social Media / Brand Video' },
      work: 'Video editing and motion graphics created to present the eyewear brand in a clean, social-media-ready format.'
    },
    {
      name: 'TVS',
      category: 'Automotive / Brand Video / Social Media',
      video: 'portfolio/video/tvs.mp4',
      intro: 'Automotive-focused visual content created for TVS as part of agency production work.',
      details: { 'Client / Brand': 'TVS', 'Industry': 'Automotive', 'Type': 'Brand Video / Social Media' },
      work: 'Visual content produced for TVS during agency production work, focused on automotive brand storytelling.'
    },
    {
      name: 'Chanakya IAS',
      category: 'Education / Social Media / Video',
      video: 'portfolio/video/chanakya_ias.mp4',
      intro: 'Educational social media content created for Chanakya IAS as part of agency production work.',
      details: { 'Client / Brand': 'Chanakya IAS', 'Industry': 'Education', 'Type': 'Social Media / Video' },
      work: 'Video content built to communicate exam-prep and educational messaging for a social media audience.'
    },
    {
      name: 'Logo / Card Creative',
      category: 'Brand Creative / Promotional Visual',
      video: 'portfolio/video/leo.mp4',
      intro: 'A logo/card-style promotional creative featuring Rohit Sharma.',
      details: { 'Type': 'Brand Creative / Promotional Visual', 'Format': 'Logo / Card Video' },
      work: 'A motion-driven logo/card creative built around a promotional visual featuring Rohit Sharma.'
    },
    {
      name: 'Clothing & Fashion Blog',
      category: 'Fashion / Social Media / Content',
      video: 'portfolio/video/cloth_2_1.mp4',
      intro: 'Fashion-focused social media content created for an Australia-based clothing brand/blog.',
      details: { 'Industry': 'Fashion', 'Market': 'Australia', 'Type': 'Social Media / Content' },
      work: 'Social content edited for a fashion/clothing blog, styled for an Australian audience.'
    },
    {
      name: 'MedBell',
      category: 'Healthcare / App / Product Video',
      video: 'portfolio/video/medbell.mp4',
      intro: 'Product-focused visual content created for MedBell, a healthcare app designed around medicine and health-related assistance.',
      details: { 'Client / Brand': 'MedBell', 'Industry': 'Healthcare', 'Type': 'App / Product Video' },
      work: 'Product video created to communicate what the MedBell app does and how it supports medicine and health-related assistance.'
    }
  ];

  /* -----------------------------------------------------
     3d. SERVICES DATA
     One entry per .services__item, matched by its data-service index.
  ----------------------------------------------------- */
  const SERVICES = [
    {
      name: 'Branding',
      desc: 'Visual identity systems built to give a brand a clear, consistent presence wherever it shows up.',
      whatWeDo: ['Logo & identity design', 'Brand guidelines', 'Visual language & tone', 'Brand assets for digital use'],
      idealFor: ['Startups', 'Brands', 'D2C', 'Personal Brands']
    },
    {
      name: 'Graphic Design',
      desc: 'Design support for the everyday visuals a brand needs across its channels.',
      whatWeDo: ['Social media creatives', 'Print & digital collateral', 'Presentation & pitch design', 'Packaging visuals'],
      idealFor: ['Startups', 'E-commerce', 'Food', 'Beauty']
    },
    {
      name: 'Web Design',
      desc: 'Clean, modern websites designed to represent a brand properly online.',
      whatWeDo: ['Website design', 'Landing pages', 'Responsive layouts', 'Design-to-development handoff'],
      idealFor: ['Startups', 'Agencies', 'SaaS', 'Technology']
    },
    {
      name: 'UI/UX',
      desc: 'Interface and experience design focused on clarity and ease of use.',
      whatWeDo: ['App & product UI', 'User flows & wireframes', 'Interaction design', 'Design systems'],
      idealFor: ['SaaS', 'Technology', 'Healthcare', 'Startups']
    },
    {
      name: 'Video Editing',
      desc: 'Story-driven video editing designed for social media, brands, campaigns and digital content.',
      whatWeDo: ['Social media videos', 'Brand videos', 'Reels', 'Corporate videos', 'Product videos', 'Creative content'],
      idealFor: ['Brands', 'E-commerce', 'Education', 'Creators']
    },
    {
      name: 'Motion Graphics',
      desc: 'Animated visuals that add movement, rhythm and clarity to a brand\u2019s message.',
      whatWeDo: ['Logo animation', 'Explainer motion graphics', 'Animated social content', 'Title & typography animation'],
      idealFor: ['Technology', 'SaaS', 'Education', 'Agencies']
    },
    {
      name: '3D Animation',
      desc: '3D visuals and animation used to bring products and ideas to life.',
      whatWeDo: ['Product 3D visuals', '3D motion sequences', 'Render-based creative content'],
      idealFor: ['E-commerce', 'Technology', 'Automotive']
    },
    {
      name: 'Product Visuals',
      desc: 'Clean, focused visual content built around a product.',
      whatWeDo: ['Product photography-style visuals', 'Catalogue-ready content', 'Product-focused video'],
      idealFor: ['E-commerce', 'Fashion', 'Food', 'Beauty']
    },
    {
      name: 'Advertising',
      desc: 'Creative built to support paid and organic advertising campaigns.',
      whatWeDo: ['Ad creative design', 'Video ads', 'Campaign visuals'],
      idealFor: ['Brands', 'D2C', 'E-commerce', 'Startups']
    },
    {
      name: 'Social Media',
      desc: 'Ongoing content designed to keep a brand\u2019s social presence sharp and consistent.',
      whatWeDo: ['Content calendars & creatives', 'Reels & short-form video', 'Page design & templates'],
      idealFor: ['Brands', 'Creators', 'Personal Brands', 'Hospitality']
    },
    {
      name: 'Creative Campaigns',
      desc: 'End-to-end creative direction for a specific idea, launch or moment.',
      whatWeDo: ['Concept & creative direction', 'Multi-format campaign assets', 'Cross-platform rollout support'],
      idealFor: ['Brands', 'Events', 'Startups', 'Agencies']
    },
    {
      name: 'Digital Content',
      desc: 'General digital content production for brands that need a steady stream of visuals.',
      whatWeDo: ['Short-form video', 'Digital creatives', 'Content built for multiple platforms'],
      idealFor: ['Startups', 'Brands', 'Technology', 'Creators']
    }
  ];

  /* -----------------------------------------------------
     3e. PORTFOLIO VIDEO PLAY/PAUSE (tap/click to play — no autoplay)
  ----------------------------------------------------- */
  document.querySelectorAll('.reel-card__media').forEach((media) => {
    const video = media.querySelector('video');
    if (!video) return;

    const togglePlay = () => {
      if (video.paused) {
        // Pause any other reel currently playing, Instagram-style single playback
        document.querySelectorAll('.reel-card__media video').forEach((v) => {
          if (v !== video && !v.paused) {
            v.pause();
            v.closest('.reel-card__media').classList.remove('is-playing');
          }
        });
        video.play().catch(() => {});
        media.classList.add('is-playing');
      } else {
        video.pause();
        media.classList.remove('is-playing');
      }
    };

    media.addEventListener('click', togglePlay);
    video.addEventListener('ended', () => media.classList.remove('is-playing')); // loop attr replays; class reset is a safety net
    video.addEventListener('pause', () => media.classList.remove('is-playing'));
    video.addEventListener('play', () => media.classList.add('is-playing'));
  });

  /* -----------------------------------------------------
     3f. CASE STUDY MODAL
  ----------------------------------------------------- */
  const caseModal = document.getElementById('caseModal');
  const caseModalVideo = document.getElementById('caseModalVideo');
  const caseModalCategory = document.getElementById('caseModalCategory');
  const caseModalTitle = document.getElementById('caseModalTitle');
  const caseModalIntro = document.getElementById('caseModalIntro');
  const caseModalDetails = document.getElementById('caseModalDetails');
  const caseModalWork = document.getElementById('caseModalWork');
  const caseModalClose = document.getElementById('caseModalClose');
  const caseModalBack = document.getElementById('caseModalBack');

  const openCaseModal = (index) => {
    const project = PROJECTS[index];
    if (!project || !caseModal) return;

    // Pause any reel-card video currently playing behind the modal
    document.querySelectorAll('.reel-card__media video').forEach((v) => {
      if (!v.paused) {
        v.pause();
        v.closest('.reel-card__media').classList.remove('is-playing');
      }
    });

    caseModalCategory.textContent = project.category;
    caseModalTitle.textContent = project.name;
    caseModalIntro.textContent = project.intro;
    caseModalWork.textContent = project.work;

    caseModalDetails.innerHTML = '';
    Object.entries(project.details).forEach(([label, value]) => {
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      caseModalDetails.appendChild(dt);
      caseModalDetails.appendChild(dd);
    });

    caseModalVideo.src = project.video;

    caseModal.classList.add('is-open');
    caseModal.setAttribute('aria-hidden', 'false');
    caseModal.querySelector('.case-modal__scroll').scrollTop = 0;
    body.style.overflow = 'hidden';
  };

  const closeCaseModal = () => {
    if (!caseModal) return;
    caseModal.classList.remove('is-open');
    caseModal.setAttribute('aria-hidden', 'true');
    caseModalVideo.pause();
    caseModalVideo.removeAttribute('src');
    caseModalVideo.load();
    body.style.overflow = '';
  };

  document.querySelectorAll('.reel-card__case-btn').forEach((btn) => {
    btn.addEventListener('click', () => openCaseModal(Number(btn.getAttribute('data-project'))));
  });

  if (caseModalClose) caseModalClose.addEventListener('click', closeCaseModal);
  if (caseModalBack) caseModalBack.addEventListener('click', closeCaseModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && caseModal && caseModal.classList.contains('is-open')) closeCaseModal();
  });

  /* -----------------------------------------------------
     3g. SERVICE DETAIL MODAL
  ----------------------------------------------------- */
  const serviceModal = document.getElementById('serviceModal');
  const serviceModalIndex = document.getElementById('serviceModalIndex');
  const serviceModalTitle = document.getElementById('serviceModalTitle');
  const serviceModalDesc = document.getElementById('serviceModalDesc');
  const serviceModalWhat = document.getElementById('serviceModalWhat');
  const serviceModalIdeal = document.getElementById('serviceModalIdeal');
  const serviceModalClose = document.getElementById('serviceModalClose');

  const openServiceModal = (index) => {
    const service = SERVICES[index];
    if (!service || !serviceModal) return;

    serviceModalIndex.textContent = 'Service ' + String(index + 1).padStart(2, '0');
    serviceModalTitle.textContent = service.name;
    serviceModalDesc.textContent = service.desc;

    serviceModalWhat.innerHTML = '';
    service.whatWeDo.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      serviceModalWhat.appendChild(li);
    });

    serviceModalIdeal.innerHTML = '';
    service.idealFor.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      serviceModalIdeal.appendChild(li);
    });

    serviceModal.classList.add('is-open');
    serviceModal.setAttribute('aria-hidden', 'false');
    serviceModal.querySelector('.service-modal__scroll').scrollTop = 0;
    body.style.overflow = 'hidden';
  };

  const closeServiceModal = () => {
    if (!serviceModal) return;
    serviceModal.classList.remove('is-open');
    serviceModal.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  };

  document.querySelectorAll('.services__item').forEach((item) => {
    item.addEventListener('click', () => openServiceModal(Number(item.getAttribute('data-service'))));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openServiceModal(Number(item.getAttribute('data-service')));
      }
    });
  });

  if (serviceModalClose) serviceModalClose.addEventListener('click', closeServiceModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal && serviceModal.classList.contains('is-open')) closeServiceModal();
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
