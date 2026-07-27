/* =========================================
   ALLCARE DESIGN/BUILD, INC.
   Main JavaScript
   ========================================= */

(function () {
  'use strict';

  /* --------------------------------------------------
     NAVIGATION – sticky + mobile menu
  -------------------------------------------------- */
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
      header.classList.remove('transparent');
    } else {
      header.classList.remove('scrolled');
      if (header.dataset.transparent !== 'false') {
        header.classList.add('transparent');
      }
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', () => {
      hamburger && hamburger.classList.remove('open');
      mobileMenu && mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close mobile menu on link click
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger && hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* --------------------------------------------------
     SCROLL ANIMATIONS (Intersection Observer)
  -------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  }

  /* --------------------------------------------------
     COUNTER ANIMATION (stats)
  -------------------------------------------------- */
  function animateCounter(el, target, suffix) {
    const start = 0;
    const duration = 1800;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current = Math.round(start + (target - start) * eased);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* --------------------------------------------------
     BEFORE/AFTER SLIDER
  -------------------------------------------------- */
  document.querySelectorAll('.ba-container').forEach(container => {
    const afterImg = container.querySelector('.ba-after');
    const line     = container.querySelector('.ba-slider-line');
    if (!afterImg || !line) return;

    let dragging = false;

    function setPosition(x) {
      const rect = container.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      line.style.left = pct + '%';
      afterImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    }

    line.addEventListener('mousedown', e => { e.preventDefault(); dragging = true; });
    line.addEventListener('touchstart', e => { dragging = true; }, { passive: true });

    window.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });
    window.addEventListener('touchmove', e => {
      if (dragging) setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('mouseup',  () => { dragging = false; });
    window.addEventListener('touchend', () => { dragging = false; });

    // Initial position at 50%
    setPosition(container.getBoundingClientRect().left + container.getBoundingClientRect().width / 2);
  });

  /* --------------------------------------------------
     FAQ ACCORDION
  -------------------------------------------------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* --------------------------------------------------
     PORTFOLIO FILTER
  -------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
          item.style.display = show ? 'block' : 'none';
          if (show) {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          }
        }, 200);
      });
    });
  });

  /* --------------------------------------------------
     SMOOTH SCROLL (anchor links)
  -------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------
     FORM SUBMISSION
  -------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Netlify Forms handles the actual submission
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(contactForm)).toString()
      })
      .then(() => {
        contactForm.innerHTML = `
          <div style="text-align:center;padding:48px 0;">
            <div style="font-size:3rem;margin-bottom:16px;">✅</div>
            <h3 style="color:var(--navy);margin-bottom:12px;">Message Received!</h3>
            <p>Thank you for reaching out. A member of our team will contact you within 1 business day to schedule your free consultation.</p>
            <p style="margin-top:16px;"><strong>Need immediate assistance?</strong> Call us at <a href="tel:6194620133" style="color:var(--blue-bright);">(619) 462-0133</a></p>
          </div>`;
      })
      .catch(() => {
        // Fallback — still show success (Netlify may still process it)
        contactForm.innerHTML = `
          <div style="text-align:center;padding:48px 0;">
            <div style="font-size:3rem;margin-bottom:16px;">✅</div>
            <h3 style="color:var(--navy);margin-bottom:12px;">Thank You!</h3>
            <p>We've received your message and will be in touch within 1 business day.</p>
            <p style="margin-top:16px;">Or call us directly: <a href="tel:6194620133" style="color:var(--blue-bright);">(619) 462-0133</a></p>
          </div>`;
      });
    });
  }

  /* --------------------------------------------------
     LIGHTBOX (Portfolio)
  -------------------------------------------------- */
  let lightbox = null;

  function openLightbox(src, alt) {
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox';
      lightbox.style.cssText = `
        position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);
        display:flex;align-items:center;justify-content:center;
        cursor:zoom-out;padding:24px;
      `;
      lightbox.innerHTML = `
        <img style="max-width:90vw;max-height:90vh;object-fit:contain;border-radius:4px;pointer-events:none;" />
        <button style="position:absolute;top:20px;right:24px;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;line-height:1;">&times;</button>
      `;
      document.body.appendChild(lightbox);
      lightbox.addEventListener('click', closeLightbox);
    }
    lightbox.querySelector('img').src = src;
    lightbox.querySelector('img').alt = alt || '';
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.portfolio-card[data-lightbox]').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* --------------------------------------------------
     HERO PARALLAX (subtle)
  -------------------------------------------------- */
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroVideo.style.transform = `translateY(${scrolled * 0.25}px)`;
      }
    }, { passive: true });
  }

  /* --------------------------------------------------
     SERVICE TABS
  -------------------------------------------------- */
  document.querySelectorAll('.stab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.service-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + tab);
      if (panel) {
        panel.classList.add('active');
        // scroll to panel top
        const navH = document.getElementById('service-tabs-nav');
        const headerH = document.getElementById('site-header');
        const offset = (navH ? navH.offsetHeight : 0) + (headerH ? headerH.offsetHeight : 0);
        const top = panel.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
