/* ============================================================
   Swiftly Tech — script.js
   Features:
     1.  Particle canvas animation (hero background)
     2.  Intersection Observer — scroll-triggered fade-up animations
     3.  Animated counters
     4.  Hamburger menu toggle
     5.  Navbar scroll shadow effect
     6.  Contact form with toast notification
     7.  Smooth active nav link highlighting
     8.  Custom cursor with glow ring
     9.  Button ripple effect
     10. 3D card tilt on hover
     11. Hero typewriter cycling effect
     12. Speed Challenge mini-game
     13. Case study industry filters
============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. PARTICLE CANVAS
  ───────────────────────────────────────────── */
  function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');
    let animId;
    let particles = [];
    let mouse = { x: -999, y: -999 };

    const CONFIG = {
      count: 80,
      maxRadius: 2,
      minRadius: 0.5,
      speed: 0.4,
      connectDistance: 130,
      mouseRepelDistance: 100,
      lineOpacity: 0.12,
      dotOpacity: 0.5,
      color: '255, 255, 255',
    };

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * CONFIG.speed,
        vy: (Math.random() - 0.5) * CONFIG.speed,
        r: CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius),
      };
    }

    function initParticleSet() {
      particles = [];
      for (let i = 0; i < CONFIG.count; i++) {
        particles.push(createParticle());
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repel
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < CONFIG.mouseRepelDistance) {
          const force = (CONFIG.mouseRepelDistance - mdist) / CONFIG.mouseRepelDistance;
          p.x += (mdx / mdist) * force * 2;
          p.y += (mdy / mdist) * force * 2;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CONFIG.color}, ${CONFIG.dotOpacity})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONFIG.connectDistance) {
            const opacity = (1 - dist / CONFIG.connectDistance) * CONFIG.lineOpacity;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${CONFIG.color}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    initParticleSet();
    draw();

    hero.addEventListener('mousemove', function (e) {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', function () {
      mouse.x = -999;
      mouse.y = -999;
    });

    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        cancelAnimationFrame(animId);
        resize();
        initParticleSet();
        draw();
      }, 200);
    });
  }

  /* ─────────────────────────────────────────────
     2. INTERSECTION OBSERVER — FADE-UP ANIMATIONS
  ───────────────────────────────────────────── */
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-up');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ─────────────────────────────────────────────
     3. ANIMATED COUNTERS
  ───────────────────────────────────────────── */
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }

    requestAnimationFrame(update);
  }

  /* ─────────────────────────────────────────────
     4. HAMBURGER MENU
  ───────────────────────────────────────────── */
  function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (!hamburger || !mobileMenu) return;

    let isOpen = false;

    function openMenu() {
      isOpen = true;
      mobileMenu.classList.add('open');
      hamburgerIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
      hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      isOpen = false;
      mobileMenu.classList.remove('open');
      hamburgerIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
      hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', function () { isOpen ? closeMenu() : openMenu(); });
    mobileNavLinks.forEach(function (link) { link.addEventListener('click', closeMenu); });
    document.addEventListener('click', function (e) {
      if (isOpen && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) closeMenu();
    });
  }

  /* ─────────────────────────────────────────────
     5. NAVBAR SCROLL SHADOW
  ───────────────────────────────────────────── */
  function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', function () {
      navbar.style.boxShadow = window.scrollY > 50 ? '0 4px 30px rgba(0,0,0,0.4)' : 'none';
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────
     6. CONTACT FORM + TOAST
  ───────────────────────────────────────────── */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    if (!form || !toast) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.querySelector('#contact-name').value.trim();
      const email = form.querySelector('#contact-email').value.trim();
      const message = form.querySelector('#contact-message').value.trim();

      if (!name || !email || !message) { shakeForm(form); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { highlightField(form.querySelector('#contact-email')); return; }

      showToast(toast);
      form.reset();
    });
  }

  function showToast(toast) {
    toast.classList.remove('hide');
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); toast.classList.add('hide'); }, 4000);
  }

  function shakeForm(form) {
    const steps = [-6, 6, -4, 4, 0];
    steps.forEach(function (px, i) {
      setTimeout(function () { form.style.transform = px ? 'translateX(' + px + 'px)' : ''; }, i * 80);
    });
  }

  function highlightField(field) {
    if (!field) return;
    field.style.borderColor = '#ef4444';
    field.focus();
    setTimeout(function () { field.style.borderColor = ''; }, 2500);
  }

  /* ─────────────────────────────────────────────
     7. ACTIVE NAV LINK HIGHLIGHTING
  ───────────────────────────────────────────── */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a.nav-link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.style.color = link.getAttribute('href') === '#' + id ? '#e2e8f0' : '';
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ─────────────────────────────────────────────
     8. SMOOTH SCROLL
  ───────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });
  }

  /* ─────────────────────────────────────────────
     9. CUSTOM CURSOR
  ───────────────────────────────────────────── */
  function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const ring = document.getElementById('cursor-ring');
    const dot = document.getElementById('cursor-dot');
    if (!cursor || !ring || !dot) return;

    // Detect touch device — hide cursor
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let cursorX = 0, cursorY = 0;
    let ringX = 0, ringY = 0;
    let rafId;

    document.addEventListener('mousemove', function (e) {
      cursorX = e.clientX;
      cursorY = e.clientY;
      dot.style.left = cursorX + 'px';
      dot.style.top = cursorY + 'px';
    });

    // Ring lags behind cursor with lerp
    function animateRing() {
      ringX += (cursorX - ringX) * 0.14;
      ringY += (cursorY - ringY) * 0.14;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      rafId = requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover state on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .service-card, input, textarea, .game-target, [role="button"]');
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('hovering'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('hovering'); });
    });

    // Click state
    document.addEventListener('mousedown', function () { cursor.classList.add('clicking'); });
    document.addEventListener('mouseup', function () { cursor.classList.remove('clicking'); });

    // Show cursor on move, re-hide if mouse leaves
    document.addEventListener('mouseleave', function () { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { cursor.style.opacity = '1'; });
    cursor.style.opacity = '0'; // start hidden until first move
    document.addEventListener('mousemove', function () { cursor.style.opacity = '1'; }, { once: true });
  }

  /* ─────────────────────────────────────────────
     10. BUTTON RIPPLE EFFECT
  ───────────────────────────────────────────── */
  function initRippleEffect() {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.ripple-btn');
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      ripple.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + x + 'px;top:' + y + 'px;';
      btn.appendChild(ripple);

      ripple.addEventListener('animationend', function () { ripple.remove(); });
    });
  }

  /* ─────────────────────────────────────────────
     11. 3D CARD TILT EFFECT
  ───────────────────────────────────────────── */
  function initCardTilt() {
    // Only on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.glass.service-card, .glass.industry-card, .glass.rounded-2xl');

    cards.forEach(function (card) {
      const MAX_TILT = 10; // degrees

      card.addEventListener('mouseenter', function () {
        card.style.transition = 'transform 0.1s ease, border-color 0.3s ease, box-shadow 0.3s ease';
      });

      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);

        const tiltX = -dy * MAX_TILT;
        const tiltY = dx * MAX_TILT;

        card.style.transform = 'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateZ(8px)';
        card.style.borderColor = 'rgba(59, 130, 246, 0.35)';
        card.style.boxShadow = '0 20px 40px rgba(59,130,246,0.12), ' +
          (tiltY > 0 ? '' : '-') + Math.abs(tiltY * 1.5) + 'px ' +
          (tiltX < 0 ? '' : '-') + Math.abs(tiltX * 1.5) + 'px 30px rgba(6,182,212,0.08)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease';
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        card.style.borderColor = '';
        card.style.boxShadow = '';
      });
    });
  }

  /* ─────────────────────────────────────────────
     12. HERO TYPEWRITER CYCLING EFFECT
  ───────────────────────────────────────────── */
  function initTypewriter() {
    const el = document.getElementById('typewriter-line');
    if (!el) return;

    const phrases = [
      'Build Fast. Scale Smart.',
      'Ship Faster. Break Less.',
      'Automate Everything.',
      'Think Bigger. Move Quicker.',
      'Engineer. Automate. Scale.',
    ];

    let phraseIndex = 0;
    let charIndex = phrases[0].length; // start full
    let isDeleting = false;
    let isPaused = false;

    const TYPING_SPEED = 60;
    const DELETE_SPEED = 35;
    const PAUSE_AFTER_TYPE = 2200;
    const PAUSE_AFTER_DELETE = 400;

    function tick() {
      if (isPaused) return;

      const current = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        el.textContent = current.substring(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          isPaused = true;
          setTimeout(function () { isPaused = false; scheduleNext(); }, PAUSE_AFTER_DELETE);
          return;
        }
      } else {
        charIndex++;
        el.textContent = current.substring(0, charIndex);
        if (charIndex === current.length) {
          isDeleting = true;
          isPaused = true;
          setTimeout(function () { isPaused = false; scheduleNext(); }, PAUSE_AFTER_TYPE);
          return;
        }
      }

      scheduleNext();
    }

    function scheduleNext() {
      setTimeout(tick, isDeleting ? DELETE_SPEED : TYPING_SPEED);
    }

    // Start the cycle after initial display time
    setTimeout(function () {
      isDeleting = true;
      scheduleNext();
    }, PAUSE_AFTER_TYPE);
  }

  /* ─────────────────────────────────────────────
     13. SPEED CHALLENGE GAME
  ───────────────────────────────────────────── */
  function initSpeedGame() {
    const arena = document.getElementById('game-arena');
    const startBtn = document.getElementById('game-start-btn');
    const scoreEl = document.getElementById('game-score');
    const streakEl = document.getElementById('game-streak');
    const bestEl = document.getElementById('game-best');
    const timeBar = document.getElementById('game-time-bar');
    const idlePrompt = document.getElementById('game-idle-prompt');
    const resultsEl = document.getElementById('game-results');
    const countdownOverlay = document.getElementById('game-countdown-overlay');
    const countdownNum = document.getElementById('game-countdown-number');
    const missFlash = document.getElementById('game-miss-flash');
    const resultEmoji = document.getElementById('game-result-emoji');
    const resultLabel = document.getElementById('game-result-label');
    const resultScore = document.getElementById('game-result-score');
    const resultBest = document.getElementById('game-result-best');
    const streakBadge = document.getElementById('streak-badge');

    if (!arena || !startBtn) return;

    const GAME_DURATION = 15000; // 15 seconds
    const TARGET_SIZE_BASE = 54;  // px
    const TARGET_MIN_SIZE = 38;
    const TARGET_LIFETIME = 1400; // ms before auto-expire
    const COUNTDOWN_STEPS = [3, 2, 1, 'GO!'];

    let score = 0;
    let streak = 0;
    let bestScore = parseInt(localStorage.getItem('swiftly_best') || '0', 10);
    let gameRunning = false;
    let gameStartTime = 0;
    let currentTarget = null;
    let targetTimer = null;
    let gameEndTimer = null;
    let timeBarTimer = null;
    let spawnTimer = null;

    // Show best score on load
    bestEl.textContent = bestScore;

    function showCountdown(callback) {
      countdownOverlay.style.display = 'flex';
      let step = 0;

      function nextStep() {
        countdownNum.style.animation = 'none';
        void countdownNum.offsetWidth; // reflow
        countdownNum.style.animation = 'count-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        countdownNum.textContent = COUNTDOWN_STEPS[step];
        step++;
        if (step < COUNTDOWN_STEPS.length) {
          setTimeout(nextStep, 850);
        } else {
          setTimeout(function () {
            countdownOverlay.style.display = 'none';
            callback();
          }, 500);
        }
      }
      nextStep();
    }

    function spawnTarget() {
      if (!gameRunning) return;
      removeTarget(false);

      const margin = 40;
      const arenaW = arena.offsetWidth;
      const arenaH = arena.offsetHeight;

      // Shrink target over game duration for difficulty
      const elapsed = Date.now() - gameStartTime;
      const difficulty = elapsed / GAME_DURATION;
      const size = Math.max(TARGET_MIN_SIZE, TARGET_SIZE_BASE - difficulty * 16);

      const x = margin + Math.random() * (arenaW - margin * 2);
      const y = margin + Math.random() * (arenaH - margin * 2);

      // Shrink ring (visual countdown)
      const shrinkRing = document.createElement('div');
      shrinkRing.className = 'game-target-shrink';
      shrinkRing.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + (size * 2.2) + 'px;height:' + (size * 2.2) + 'px;';
      arena.appendChild(shrinkRing);
      setTimeout(function () { if (shrinkRing.parentNode) shrinkRing.remove(); }, TARGET_LIFETIME + 100);

      const target = document.createElement('div');
      target.className = 'game-target';
      target.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;';
      target.innerHTML = '<div class="game-target-inner"></div>';
      arena.appendChild(target);
      currentTarget = target;

      // Pop in
      requestAnimationFrame(function () { target.classList.add('alive'); });

      // Auto-expire
      targetTimer = setTimeout(function () {
        if (target === currentTarget) {
          onMiss();
          removeTarget(false);
          scheduleSpawn();
        }
      }, TARGET_LIFETIME);

      // Click handler
      target.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!gameRunning) return;
        clearTimeout(targetTimer);
        onHit(x, y);
        target.classList.add('hit');
        setTimeout(function () { if (target.parentNode) target.remove(); }, 150);
        currentTarget = null;
        scheduleSpawn();
      });
    }

    function scheduleSpawn() {
      if (!gameRunning) return;
      const delay = 120 + Math.random() * 200;
      spawnTimer = setTimeout(spawnTarget, delay);
    }

    function removeTarget(penalize) {
      if (currentTarget) {
        clearTimeout(targetTimer);
        currentTarget.remove();
        currentTarget = null;
      }
      if (penalize) onMiss();
    }

    function onHit(x, y) {
      score++;
      streak++;
      scoreEl.textContent = score;
      streakEl.textContent = streak;

      // Streak badge pop
      if (streak > 1) {
        streakBadge.classList.add('pop');
        setTimeout(function () { streakBadge.classList.remove('pop'); }, 200);
      }

      // +1 floating pop
      const pop = document.createElement('div');
      pop.id = 'game-score-pop';
      pop.textContent = streak >= 3 ? '+' + streak + '🔥' : '+1';
      pop.style.left = (x - 15) + 'px';
      pop.style.top = (y - 20) + 'px';
      arena.appendChild(pop);
      setTimeout(function () { if (pop.parentNode) pop.remove(); }, 700);
    }

    function onMiss() {
      streak = 0;
      streakEl.textContent = '0';
      missFlash.classList.add('flash');
      setTimeout(function () { missFlash.classList.remove('flash'); }, 150);
    }

    function updateTimeBar() {
      if (!gameRunning) return;
      const elapsed = Date.now() - gameStartTime;
      const remaining = Math.max(0, 1 - elapsed / GAME_DURATION);
      timeBar.style.width = (remaining * 100) + '%';
      if (remaining < 0.3) timeBar.classList.add('urgent');
      timeBarTimer = requestAnimationFrame(updateTimeBar);
    }

    function startGame() {
      score = 0;
      streak = 0;
      scoreEl.textContent = '0';
      streakEl.textContent = '0';
      timeBar.style.width = '100%';
      timeBar.classList.remove('urgent');

      idlePrompt.style.display = 'none';
      resultsEl.style.display = 'none';
      arena.classList.remove('idle');

      startBtn.disabled = true;
      startBtn.textContent = 'Running...';

      showCountdown(function () {
        gameRunning = true;
        gameStartTime = Date.now();
        updateTimeBar();
        spawnTarget();

        gameEndTimer = setTimeout(endGame, GAME_DURATION);
      });
    }

    function endGame() {
      gameRunning = false;
      clearTimeout(spawnTimer);
      clearTimeout(targetTimer);
      cancelAnimationFrame(timeBarTimer);
      removeTarget(false);

      timeBar.style.width = '0%';
      arena.classList.add('idle');

      // Update best score
      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('swiftly_best', bestScore);
        bestEl.textContent = bestScore;
      }

      // Result tier
      let emoji, label;
      if (score >= 18)      { emoji = '⚡⚡⚡'; label = 'You Belong at Swiftly Tech!'; }
      else if (score >= 14) { emoji = '⚡⚡'; label = 'Lightning Fast!'; }
      else if (score >= 10) { emoji = '🔥'; label = 'You\'re Pretty Quick!'; }
      else if (score >= 6)  { emoji = '👍'; label = 'Getting There!'; }
      else if (score >= 3)  { emoji = '☕'; label = 'Maybe Try More Coffee?'; }
      else                   { emoji = '😴'; label = 'Were You Even Trying?'; }

      resultEmoji.textContent = emoji;
      resultLabel.textContent = label;
      resultScore.textContent = 'You hit ' + score + ' target' + (score !== 1 ? 's' : '') + ' in 15 seconds.';

      if (score >= bestScore && score > 0) {
        resultBest.textContent = '🏆 New personal best: ' + bestScore + '!';
      } else {
        resultBest.textContent = 'Personal best: ' + bestScore + ' — keep going!';
      }

      resultsEl.style.display = 'flex';
      startBtn.disabled = false;
      startBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 3l14 9-14 9V3z"/></svg> Play Again';
    }

    startBtn.addEventListener('click', function () {
      if (!gameRunning) startGame();
    });

    // Miss penalty on arena click (not on target)
    arena.addEventListener('click', function (e) {
      if (!gameRunning) return;
      if (e.target === arena || e.target === missFlash) {
        onMiss();
      }
    });
  }

  /* ─────────────────────────────────────────────
     14. CASE STUDY FILTERS
  ───────────────────────────────────────────── */
  function initCaseFilters() {
    const buttons = document.querySelectorAll('.case-filter');
    const cards = document.querySelectorAll('.case-card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = btn.dataset.filter;

        buttons.forEach(function (b) {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        cards.forEach(function (card) {
          const match = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('is-hidden', !match);
          // Cards revealed by a filter may never have intersected yet
          if (match) card.classList.add('visible');
        });
      });
    });
  }

  /* ─────────────────────────────────────────────
     INIT ALL
  ───────────────────────────────────────────── */
  function init() {
    initParticles();
    initScrollAnimations();
    initCounters();
    initHamburger();
    initNavbarScroll();
    initActiveNav();
    initContactForm();
    initSmoothScroll();
    initCustomCursor();
    initRippleEffect();
    initCardTilt();
    initTypewriter();
    initSpeedGame();
    initCaseFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
