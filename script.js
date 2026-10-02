/**
 * Samiksha Jain - Developer Portfolio
 * Pure Vanilla JavaScript (Zero external animation libraries or frameworks)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initActiveNavSpy();
  initSmoothScroll();
  initSkillsFilter();
  initContactForm();
  initScrollToTop();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. NAVBAR SCROLL APPEARANCE
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 35) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   2. MOBILE HAMBURGER DRAWER
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (!toggleBtn || !drawer) return;

  const toggleDrawer = (isOpen) => {
    const shouldOpen = typeof isOpen === 'boolean' ? isOpen : !drawer.classList.contains('open');
    if (shouldOpen) {
      drawer.classList.add('open');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  toggleBtn.addEventListener('click', () => toggleDrawer());

  // Close when clicking any nav link in the drawer
  const drawerLinks = drawer.querySelectorAll('.mobile-nav-item, .mobile-drawer-cta a');
  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  // Close when clicking outside of the drawer
  document.addEventListener('click', (e) => {
    if (
      drawer.classList.contains('open') &&
      !drawer.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      toggleDrawer(false);
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleDrawer(false);
    }
  });
}

/* --------------------------------------------------------------------------
   3. ACTIVE NAVIGATION LINK SPY (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-menu .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-item');

  if (!sections.length) return;

  const setActive = (id) => {
    desktopLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActive(entry.target.getAttribute('id'));
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   4. NATIVE SMOOTH SCROLLING
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. SKILLS CATEGORY FILTER
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-group-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      skillCards.forEach((card) => {
        const cat = card.getAttribute('data-cat');
        if (filter === 'all' || filter === cat) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM VALIDATION & FORMSPREE SUBMISSION
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successBanner = document.getElementById('form-success-msg');
  if (!form) return;

  const inputs = form.querySelectorAll('.field-input');

  const validateInput = (input) => {
    const parentField = input.closest('.form-field');
    if (!parentField) return true;

    const errorMsg = parentField.querySelector('.field-error-msg');
    let isValid = true;
    let message = '';

    const val = input.value.trim();

    if (input.hasAttribute('required') && !val) {
      isValid = false;
      message = 'This field is required.';
    } else if (input.type === 'email' && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        isValid = false;
        message = 'Please enter a valid email address.';
      }
    }

    if (!isValid) {
      parentField.classList.add('has-error');
      if (errorMsg) errorMsg.textContent = message;
    } else {
      parentField.classList.remove('has-error');
      if (errorMsg) errorMsg.textContent = '';
    }

    return isValid;
  };

  inputs.forEach((input) => {
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('input', () => {
      const parent = input.closest('.form-field');
      if (parent && parent.classList.contains('has-error')) {
        validateInput(input);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isFormValid = true;
    inputs.forEach((input) => {
      if (!validateInput(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) return;

    const submitBtn = document.getElementById('form-submit-btn');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';
    }

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.ok) {
        form.reset();
        inputs.forEach((input) => {
          const parent = input.closest('.form-field');
          if (parent) parent.classList.remove('has-error');
        });

        if (successBanner) {
          successBanner.classList.add('visible');
          setTimeout(() => {
            successBanner.classList.remove('visible');
          }, 6000);
        }
      } else {
        alert('There was an issue sending your message. Please try again or email samikshaj7371@gmail.com directly.');
      }
    } catch (err) {
      console.error('Contact Form Submission Error:', err);
      alert('Unable to reach the server. Please check your internet connection or email samikshaj7371@gmail.com directly.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
}

/* --------------------------------------------------------------------------
   7. SCROLL TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initScrollToTop() {
  const btn = document.getElementById('scroll-to-top-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   8. SUBTLE SCROLL REVEAL (PREFERS-REDUCED-MOTION SAFE)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const revealTargets = document.querySelectorAll(
    '.metric-card, .profile-frame, .info-card, .education-card, .timeline-card-item, .skill-group-card, .project-card, .project-showcase, .pow-card, .achievement-card, .service-card, .coord-card, .form-card'
  );

  if (!revealTargets.length) return;

  revealTargets.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.45s ease-out, transform 0.45s ease-out';
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
}