// Initialize portfolio - runs when DOM is ready
function initPortfolio() {

  // Check library availability (used to gate features, NOT to bail out)
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const hasLenis = typeof Lenis !== 'undefined';

  // Register GSAP plugins if available
  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ==========================================
     1. SMOOTH SCROLL (LENIS ENGINE)
     ========================================== */
  let lenis = null;

  if (hasLenis) {
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      // Connect Lenis to GSAP ScrollTrigger
      if (hasGSAP) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000); // GSAP ticker provides time in seconds
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        // Fallback to native RAF if GSAP is missing
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    } catch (err) {
      console.warn('Portfolio: Lenis initialization failed, using native scroll.', err);
      lenis = null;
    }
  }

  // Helper: smooth scroll to an element (native)
  function smoothScrollTo(target) {
    if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target instanceof Element) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target === 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Setup header styling & active link tracking on scroll
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('header nav ul a');
  const sections = document.querySelectorAll('section');

  // Header scroll behavior (with native fallback)
  function handleScrollUpdate(scrollY) {
    if (scrollY > 50) {
      header.classList.add('glass-panel');
      header.style.backgroundColor = 'var(--card-bg)';
      header.style.boxShadow = 'var(--card-shadow)';
    } else {
      header.classList.remove('glass-panel');
      header.style.backgroundColor = 'transparent';
      header.style.boxShadow = 'none';
    }

    // Active Section link highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  if (lenis) {
    lenis.on('scroll', (e) => handleScrollUpdate(e.scroll));
  } else {
    // Native scroll fallback
    window.addEventListener('scroll', () => handleScrollUpdate(window.scrollY), { passive: true });
  }

  // Handle smooth scroll clicks on navigation links
  // Skip links that have 'download' attribute (e.g. resume) or don't start with '#'
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      console.log('Nav link clicked:', href);
      // Skip download links and external links — let browser handle natively
      if (link.hasAttribute('download') || !href || !href.startsWith('#')) {
        return;
      }
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        smoothScrollTo(href); // Pass string selector to Lenis
      }
      // Close mobile drawer if open
      if (header && header.classList.contains('drawer-active')) {
        header.classList.remove('drawer-active');
        const hamBtn = document.getElementById('ham-btn');
        if (hamBtn) hamBtn.classList.remove('active');
        if (lenis) lenis.start();
      }
    });
  });

  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      smoothScrollTo('#about');
    });
  }

  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }


  /* ==========================================
     2. DYNAMIC THEME SWITCHER
     ========================================= */
  const themeToggle = document.getElementById('theme-toggle');
  
  // Apply saved theme
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }


  /* ==========================================
     3. INTERACTIVE CANVAS PARTICLES
     ========================================== */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const maxParticles = 55;

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 2 + 1.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        const isLight = document.body.classList.contains('light-mode');
        ctx.fillStyle = isLight ? 'rgba(79, 70, 229, 0.22)' : 'rgba(99, 102, 241, 0.28)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    // Mouse Tracking in Hero
    let mousePos = { x: null, y: null };
    const heroSection = document.getElementById('hero');
    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    });
    heroSection.addEventListener('mouseleave', () => {
      mousePos.x = null;
      mousePos.y = null;
    });

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      const isLight = document.body.classList.contains('light-mode');
      const lineColor = isLight ? 'rgba(79, 70, 229, 0.05)' : 'rgba(99, 102, 241, 0.06)';
      const mouseLineColor = isLight ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.16)';

      for (let i = 0; i < particles.length; i++) {
        // Line connection to cursor
        if (mousePos.x !== null) {
          const dx = particles[i].x - mousePos.x;
          const dy = particles[i].y - mousePos.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.strokeStyle = mouseLineColor;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
          }
        }

        // Line connections between nodes
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 90) {
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }


  /* ==========================================
     4. CUSTOM MOUSE FOLLOWER
     ========================================== */
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  if (cursor && cursorDot && hasGSAP) {
    let isTouch = false;
    window.addEventListener('touchstart', () => { isTouch = true; });

    window.addEventListener('mousemove', (e) => {
      if (isTouch) return;
      cursor.style.display = 'block';
      cursorDot.style.display = 'block';

      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
      gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0 });
    });

    window.addEventListener('mousedown', () => {
      if (!isTouch) document.body.classList.add('cursor-clicked');
    });
    window.addEventListener('mouseup', () => {
      if (!isTouch) document.body.classList.remove('cursor-clicked');
    });

    // Add pointer hover behaviors dynamically
    const applyCursorListeners = () => {
      const hoverElements = document.querySelectorAll('a, button, .interactive-card, .btn-premium, .skills-tab-btn, .slider-btn, .contact-social-link');
      hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          if (!isTouch) document.body.classList.add('cursor-hovered');
        });
        el.addEventListener('mouseleave', () => {
          if (!isTouch) document.body.classList.remove('cursor-hovered');
        });
      });
    };
    applyCursorListeners();
    // Expose this internationally for dynamically updated sections
    window.applyCursorListeners = applyCursorListeners;
  }


  /* ==========================================
     5. MAGNETIC COMPONENT WRAPPER
     ========================================== */
  if (hasGSAP) {
    const magneticBtns = document.querySelectorAll('.magnetic');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.32,
          y: y * 0.32,
          duration: 0.35,
          ease: "power2.out"
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.65,
          ease: "elastic.out(1, 0.3)"
        });
      });
    });
  }


  /* ==========================================
     6. HERO TYPING EFFECTS (TYPED.JS)
     ========================================== */
  const typingTarget = document.getElementById('typing-role');
  if (typingTarget && typeof Typed !== 'undefined') {
    new Typed('#typing-role', {
      strings: [
        'Full Stack Developer',
        'MERN Stack Enthusiast',
        'Problem Solver'
      ],
      typeSpeed: 60,
      backSpeed: 45,
      backDelay: 1800,
      loop: true
    });
  }


  /* ==========================================
     7. RECRUITER STATS DASHBOARD COUNT-UP
     ========================================== */
  const statsSection = document.querySelector('.stats-grid');
  if (statsSection && hasGSAP) {
    const statNums = document.querySelectorAll('.stat-num');
    
    gsap.from(statNums, {
      scrollTrigger: {
        trigger: statsSection,
        start: "top 88%",
      },
      textContent: 0,
      duration: 1.8,
      ease: "power2.out",
      snap: { textContent: 1 },
      stagger: 0.15,
      onUpdate: function() {
        statNums.forEach(num => {
          const target = num.getAttribute('data-target');
          let val = parseInt(num.textContent);
          if (val > parseInt(target)) val = target;
          num.innerHTML = val + '+';
        });
      }
    });
  }


  /* ==========================================
     8. INTERACTIVE TECHNICAL SKILLS PROGRESS
     ========================================== */
  const skillsTabBtns = document.querySelectorAll('.skills-tab-btn');
  const skillsPanes = document.querySelectorAll('.skills-content-pane');

  skillsTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      skillsTabBtns.forEach(b => b.classList.remove('active'));
      skillsPanes.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const activePane = document.getElementById(tabId);
      activePane.classList.add('active');
      
      // Animate skills filling inside tab
      animateSkillsPane(activePane);
    });
  });

  function animateSkillsPane(pane) {
    if (!hasGSAP) return;
    const progressBars = pane.querySelectorAll('.skill-progress-bar');
    progressBars.forEach(bar => {
      const percent = bar.getAttribute('data-percent');
      const radius = bar.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (percent / 100) * circumference;

      // Animate strokeDashoffset
      gsap.to(bar, {
        strokeDashoffset: offset,
        duration: 1.4,
        ease: "power3.out"
      });
    });
  }

  // Auto trigger skills filling once scrolled in
  if (hasGSAP) {
    ScrollTrigger.create({
      trigger: "#skills",
      start: "top 72%",
      onEnter: () => {
        const activePane = document.querySelector('.skills-content-pane.active');
        if (activePane) animateSkillsPane(activePane);
      }
    });
  }


  /* ==========================================
     9. TESTIMONIAL SLIDER (REMOVED)
     ========================================== */


  /* ==========================================
     10. CONTACT FORM VALIDATION & SUBMIT
     ========================================== */
  const contactForm = document.getElementById('contact-form');
  const successOverlay = document.querySelector('.form-success-overlay');

  if (contactForm) {
    const inputs = contactForm.querySelectorAll('.form-input');

    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        validateInput(input);
      });
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        group.classList.remove('has-error');
      });
    });

    function validateInput(input) {
      const group = input.closest('.form-group');
      let isValid = true;
      let errorMsg = '';

      if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        errorMsg = 'This field is required.';
      } else if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          isValid = false;
          errorMsg = 'Please enter a valid email address.';
        }
      }

      if (!isValid) {
        group.classList.add('has-error');
        const errorSpan = group.querySelector('.form-error-msg');
        if (errorSpan) errorSpan.textContent = errorMsg;
      } else {
        group.classList.remove('has-error');
      }

      return isValid;
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isFormValid = true;

      inputs.forEach(input => {
        if (!validateInput(input)) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;

          if (response.ok) {
            contactForm.reset();
            inputs.forEach(input => {
              input.closest('.form-group').classList.remove('has-error');
            });

            // Burst confetti celebrate
            if (typeof confetti === 'function') {
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 }
              });
            }

            // Display overlay
            if (successOverlay) {
              successOverlay.classList.add('active');
              setTimeout(() => {
                successOverlay.classList.remove('active');
              }, 4500);
            }
          } else {
            alert('There was a problem sending your message. Please try again.');
          }
        })
        .catch(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          alert('Failed to connect to the server. Please check your internet connection.');
        });
      }
    });
  }


  /* ==========================================
     11. MOBILE DRAWER NAVIGATION TOGGLE
     ========================================== */
  const hamBtn = document.getElementById('ham-btn');
  const navDrawerLinks = document.querySelectorAll('header nav ul a');

  if (hamBtn && header) {
    hamBtn.addEventListener('click', () => {
      header.classList.toggle('drawer-active');
      hamBtn.classList.toggle('active');
      
      if (header.classList.contains('drawer-active')) {
        if (lenis) lenis.stop();
      } else {
        if (lenis) lenis.start();
      }
    });

    navDrawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('drawer-active');
        hamBtn.classList.remove('active');
        if (lenis) lenis.start();
      });
    });
  }


  /* ==========================================
     12. GSAP SCROLLTRIGGER REVEAL TIMELINES
     ========================================== */
  if (!hasGSAP) return; // Skip all GSAP animations if library unavailable

  // Initial page load animations
  const pageLoadTL = gsap.timeline();
  pageLoadTL.from('header', {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });
  pageLoadTL.from('.hero-content > *', {
    y: 35,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out"
  }, "-=0.6");
  pageLoadTL.from('.hero-actions-row', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: "power3.out"
  }, "-=0.4");
  pageLoadTL.from('.stats-grid', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  }, "-=0.5");

  // Scroll indicator fade in
  const scrollIndicatorEl = document.querySelector('.scroll-indicator');
  if (scrollIndicatorEl) {
    pageLoadTL.from(scrollIndicatorEl, {
      y: 15,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3");
  }

  // Open To Work Banner entrance
  const otwBanner = document.querySelector('.open-to-work-banner');
  if (otwBanner) {
    gsap.from(otwBanner, {
      scrollTrigger: {
        trigger: otwBanner,
        start: "top 92%",
      },
      y: 25,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  }

  // Section Headers slide & fade in
  const sectionHeaders = document.querySelectorAll('.section-header, .about-heading');
  sectionHeaders.forEach(sectionHead => {
    gsap.from(sectionHead, {
      scrollTrigger: {
        trigger: sectionHead,
        start: "top 86%",
      },
      y: 35,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  });

  // About profile image fade/scale
  const aboutPhoto = document.querySelector('.about-photo-wrapper');
  if (aboutPhoto) {
    gsap.from(aboutPhoto, {
      scrollTrigger: {
        trigger: aboutPhoto,
        start: "top 82%",
      },
      scale: 0.92,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.2)"
    });
  }

  // About details column text & cards
  const aboutDetailsCol = document.querySelector('.about-details-col');
  if (aboutDetailsCol) {
    gsap.from(aboutDetailsCol, {
      scrollTrigger: {
        trigger: aboutDetailsCol,
        start: "top 82%",
      },
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: "power2.out"
    });
  }

  // Interest items stagger entrance
  const interestItems = document.querySelectorAll('.interest-item');
  if (interestItems.length > 0) {
    gsap.from(interestItems, {
      scrollTrigger: {
        trigger: '.interests-grid',
        start: "top 86%",
      },
      y: 25,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out"
    });
  }

  // Why Hire card grids slide-in
  const whyCards = document.querySelectorAll('.why-card');
  if (whyCards.length > 0) {
    gsap.from(whyCards, {
      scrollTrigger: {
        trigger: '.why-grid',
        start: "top 84%",
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out"
    });
  }

  // Skills tab buttons entrance
  const skillsTabContainer = document.querySelector('.skills-tabs');
  if (skillsTabContainer) {
    gsap.from(skillsTabContainer, {
      scrollTrigger: {
        trigger: skillsTabContainer,
        start: "top 88%",
      },
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    });
  }

  // Timeline cards animation
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    const card = item.querySelector('.timeline-card');
    const dot = item.querySelector('.timeline-dot');
    
    if (card) {
      gsap.from(card, {
        scrollTrigger: {
          trigger: item,
          start: "top 86%",
        },
        x: index % 2 === 0 ? -40 : 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    }

    if (dot) {
      gsap.from(dot, {
        scrollTrigger: {
          trigger: item,
          start: "top 86%",
        },
        scale: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
    }
  });

  // Featured Project cards slide-up
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 82%",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  });

  // Coding Profile cards entrance
  const profileCards = document.querySelectorAll('.profile-card');
  if (profileCards.length > 0) {
    gsap.from(profileCards, {
      scrollTrigger: {
        trigger: '.profiles-grid',
        start: "top 86%",
      },
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power2.out"
    });
  }

  // Certifications grid cards entrance
  const certCards = document.querySelectorAll('.cert-card');
  if (certCards.length > 0) {
    gsap.from(certCards, {
      scrollTrigger: {
        trigger: '.certifications-grid',
        start: "top 86%",
      },
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power2.out"
    });
  }

  // Services cards entrance
  const serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length > 0) {
    gsap.from(serviceCards, {
      scrollTrigger: {
        trigger: '.services-grid',
        start: "top 84%",
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power2.out"
    });
  }

  // Contact section entrance
  const contactContainer = document.querySelector('.contact-container');
  if (contactContainer) {
    gsap.from('.contact-info-panel', {
      scrollTrigger: {
        trigger: contactContainer,
        start: "top 82%",
      },
      x: -40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
    gsap.from('.contact-form-card', {
      scrollTrigger: {
        trigger: contactContainer,
        start: "top 82%",
      },
      x: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  }

  // Footer entrance
  const footerTop = document.querySelector('.footer-top');
  if (footerTop) {
    gsap.from(footerTop, {
      scrollTrigger: {
        trigger: footerTop,
        start: "top 92%",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  }

}

// Execute immediately if DOM is ready, otherwise wait for it
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
  initPortfolio();
}