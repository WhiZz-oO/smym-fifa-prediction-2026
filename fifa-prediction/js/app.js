/* ═══════════════════════════════════════════════════════════════════
   FIFA WORLD CUP 2026 — MAIN APP MODULE (SPA ROUTER)
   SMYM Chemmalamattom | app.js
═══════════════════════════════════════════════════════════════════ */

(function () {

  // ── SPA SECTIONS CONFIG ──────────────────────────────────────────
  const SECTIONS = ['home', 'about', 'rules', 'predict', 'leaderboard', 'stats', 'contact'];
  let currentSection = 'home';
  let predictionInitialized = false;

  // ── NAVIGATE TO SECTION ──────────────────────────────────────────
  function navigateTo(sectionId) {
    if (!SECTIONS.includes(sectionId)) return;
    if (sectionId === currentSection) {
      // Still scroll to top of section
      const el = document.getElementById(`section-${sectionId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // Hide current
    const currentEl = document.getElementById(`section-${currentSection}`);
    if (currentEl) {
      currentEl.classList.remove('section-visible');
      setTimeout(() => {
        currentEl.classList.remove('active-section');
      }, 200);
    }

    // Update state
    currentSection = sectionId;

    // Show new section after short delay
    setTimeout(() => {
      const newEl = document.getElementById(`section-${sectionId}`);
      if (newEl) {
        newEl.classList.add('active-section');
        // Force reflow then add visible
        void newEl.offsetWidth;
        newEl.classList.add('section-visible');
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Run section-specific init
      handleSectionInit(sectionId);
      updateNavActive(sectionId);
      updateMobileNavActive(sectionId);

      // Update URL hash (optional — no page reload)
      history.replaceState(null, '', `#${sectionId}`);
    }, 220);
  }

  // ── SECTION-SPECIFIC INITIALIZATION ─────────────────────────────
  function handleSectionInit(sectionId) {
    switch (sectionId) {
      case 'predict':
        if (!predictionInitialized) {
          initPrediction();
          predictionInitialized = true;
        }
        break;
      case 'leaderboard':
        loadLeaderboard();
        break;
      case 'stats':
        loadCharts();
        break;
      case 'about':
        loadParticipantCount();
        break;
    }
  }

  // ── UPDATE NAV ACTIVE STATE ──────────────────────────────────────
  function updateNavActive(sectionId) {
    document.querySelectorAll('[data-section]').forEach(link => {
      link.classList.toggle('active', link.dataset.section === sectionId);
    });
  }

  // ── UPDATE MOBILE NAV ACTIVE STATE ──────────────────────────────
  function updateMobileNavActive(sectionId) {
    const map = {
      home: 'mbnHome', rules: 'mbnRules', predict: 'mbnPredict',
      leaderboard: 'mbnLeaderboard', stats: 'mbnStats'
    };
    document.querySelectorAll('.mbn-item').forEach(btn => btn.classList.remove('active'));
    if (map[sectionId]) {
      const btn = document.getElementById(map[sectionId]);
      if (btn) btn.classList.add('active');
    }
  }

  // ── LOAD PARTICIPANT COUNT (for About section) ───────────────────
  async function loadParticipantCount() {
    try {
      const result = await FIFA_API.fetchStats();
      const el = document.getElementById('aboutParticipants');
      if (el && result.totalParticipants !== undefined) {
        animateNumber(el, 0, result.totalParticipants, 1200);
      }
    } catch (e) {
      const el = document.getElementById('aboutParticipants');
      if (el) el.textContent = '—';
    }
  }

  // ── ANIMATE NUMBER ───────────────────────────────────────────────
  function animateNumber(el, from, to, duration) {
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.round(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ── NAVIGATION SETUP ─────────────────────────────────────────────
  function setupNavigation() {
    // Desktop nav links
    document.querySelectorAll('[data-section]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const section = link.dataset.section;
        if (section) navigateTo(section);
        // Close mobile menu if open
        const collapse = document.getElementById('navbarCollapse');
        const toggler  = document.getElementById('navToggle');
        if (collapse && collapse.classList.contains('show')) {
          collapse.classList.remove('show');
          if (toggler) toggler.classList.remove('open');
        }
      });
    });

    // Hamburger toggler
    const toggler = document.getElementById('navToggle');
    if (toggler) {
      toggler.addEventListener('click', () => {
        toggler.classList.toggle('open');
        const collapse = document.getElementById('navbarCollapse');
        if (collapse) collapse.classList.toggle('show');
      });
    }

    // Scroll → sticky nav
    const nav = document.getElementById('mainNav');
    if (nav) {
      window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
      }, { passive: true });
    }

    // Handle hash on load
    const hash = window.location.hash.slice(1);
    if (hash && SECTIONS.includes(hash)) {
      navigateTo(hash);
    } else {
      // Show home immediately
      const homeEl = document.getElementById('section-home');
      if (homeEl) {
        homeEl.classList.add('active-section');
        void homeEl.offsetWidth;
        homeEl.classList.add('section-visible');
      }
    }
  }

  // ── PARTICLE SYSTEM ──────────────────────────────────────────────
  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx    = canvas.getContext('2d');
    let W        = window.innerWidth;
    let H        = window.innerHeight;
    let particles = [];

    canvas.width  = W;
    canvas.height = H;

    const PARTICLE_COUNT = Math.min(60, Math.floor((W * H) / 20000));

    class GoldParticle {
      constructor() { this.reset(); }
      reset() {
        this.x     = Math.random() * W;
        this.y     = H + 10;
        this.size  = Math.random() * 2.5 + 0.5;
        this.speedY = -(Math.random() * 0.8 + 0.3);
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.maxY   = -10;
      }
      update() {
        this.y     += this.speedY;
        this.x     += this.speedX;
        this.opacity -= 0.0008;
        if (this.y < this.maxY || this.opacity <= 0) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle   = '#D4AF37';
        ctx.shadowBlur  = 6;
        ctx.shadowColor = 'rgba(212,175,55,0.6)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Create particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = new GoldParticle();
      p.y = Math.random() * H; // distribute initially
      particles.push(p);
    }

    // Animation loop
    let animating = true;
    function animate() {
      if (!animating) return;
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
    }, { passive: true });

    // Pause when tab not visible
    document.addEventListener('visibilitychange', () => {
      animating = !document.hidden;
      if (animating) animate();
    });
  }

  // ── RIPPLE EFFECT ON BUTTONS ─────────────────────────────────────
  function initRippleEffect() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn-primary-gold, .btn-outline-gold');
      if (!btn) return;
      const ripple = document.createElement('span');
      const rect   = btn.getBoundingClientRect();
      ripple.className   = 'btn-ripple';
      ripple.style.left  = `${e.clientX - rect.left}px`;
      ripple.style.top   = `${e.clientY - rect.top}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  }

  // ── AOS INIT ─────────────────────────────────────────────────────
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
        delay: 0
      });
    }
  }

  // ── PAGE LOADER ───────────────────────────────────────────────────
  function showPageLoader() {
    const loader = document.createElement('div');
    loader.id        = 'pageLoader';
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-trophy"><i class="fas fa-trophy"></i></div>
      <div class="loader-bar"><div class="loader-bar-fill"></div></div>
      <div class="loader-text">FIFA 2026 PREDICTION PORTAL</div>
    `;
    document.body.insertBefore(loader, document.body.firstChild);

    // Hide after 1.5s
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 500);
    }, 1500);
  }

  // ── KEYBOARD ACCESSIBILITY ────────────────────────────────────────
  function initKeyboardA11y() {
    // Team cards: Enter/Space to select
    document.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('team-card')) {
        e.preventDefault();
        e.target.click();
      }
    });
  }

  // ── MAIN INIT ─────────────────────────────────────────────────────
  function init() {
    showPageLoader();
    setupNavigation();
    initParticles();
    initRippleEffect();
    initAOS();
    initKeyboardA11y();
  }

  // ── READY ─────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── EXPOSE ────────────────────────────────────────────────────────
  window.navigateTo = navigateTo;

})();
