/**
 * The Museum of Incorrect Physics
 * Reality Intrusion & Observer Consciousness Engine
 * 
 * Philosophy:
 * The visitor is not browsing a website.
 * The visitor is an uncalibrated physical intrusion into an impossible reality.
 * Everything reacts:
 * - Text letters hesitate and shift when watched
 * - Measurements recalculate and disagree upon inspection
 * - Logos warp non-Euclidean geometry
 * - Shadows move with temporal latency
 * - Reticle cursor physically displaces ambient spacetime
 */

import { museumAudio } from './audio.js';

export class RealityIntrusionEngine {
  constructor() {
    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      prevX: window.innerWidth / 2,
      prevY: window.innerHeight / 2,
      vx: 0,
      vy: 0,
      speed: 0,
      idleTime: 0
    };

    this.cursorEl = document.getElementById('curatorial-cursor');
    this.cursorDotEl = document.getElementById('curatorial-cursor-dot');
    this.coordinateStream = document.getElementById('void-coordinate-stream');
    this.interactiveMetrics = [];
    this.distortedElements = new Set();

    this.time = 0;
    this.init();
  }

  init() {
    // 1. Cursor Movement & Velocity Tracking
    window.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.onMouseMove(e.touches[0]);
      }
    }, { passive: true });

    // 2. Discover and Register Reactive Metric Readouts
    this.registerReactiveMetrics();

    // 3. Register Logo Geodesic Precession
    this.registerLogoIntrusions();

    // 4. Register Letter-by-Letter Anomaly on Editorial Text
    this.registerTextBaselineFluctuations();

    // 5. Physics Intrusion Loop
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  onMouseMove(e) {
    this.mouse.prevX = this.mouse.x;
    this.mouse.prevY = this.mouse.y;
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;

    this.mouse.vx = this.mouse.x - this.mouse.prevX;
    this.mouse.vy = this.mouse.y - this.mouse.prevY;
    this.mouse.speed = Math.hypot(this.mouse.vx, this.mouse.vy);
    this.mouse.idleTime = 0;

    // Reticle cursor position with physical inertia (centered exactly on mouse)
    if (this.cursorDotEl) {
      this.cursorDotEl.style.transform = `translate(${this.mouse.x}px, ${this.mouse.y}px) translate(-50%, -50%)`;
    }
  }

  registerReactiveMetrics() {
    const metricSelectors = [
      '#gravity-strain-display',
      '#pendulum-dilation-val',
      '.telemetry-val',
      '#spec-gravity-status',
      '.c-card-tag',
      '.drawer-code'
    ];

    metricSelectors.forEach(sel => {
      const els = document.querySelectorAll(sel);
      els.forEach(el => {
        el.setAttribute('data-original-text', el.textContent || '');
        this.interactiveMetrics.push(el);

        // When visitor cursor approaches a measurement, it hesitates and recalculates
        el.addEventListener('pointerenter', () => {
          this.perturbMeasurement(el);
        });
      });
    });
  }

  perturbMeasurement(el) {
    if (el.dataset.recalculating) return;
    el.dataset.recalculating = 'true';

    const original = el.getAttribute('data-original-text') || el.textContent || '';
    const variance = (Math.random() * 0.08 - 0.04).toFixed(4);

    // Subtle audio micro-click (like Geiger counter / quantum sensor)
    if (window.museumAudio && Math.random() < 0.3) {
      window.museumAudio.playGlassChime(1760 + Math.random() * 400, 0.15);
    }

    // Flicker with an impossible measurement deviation
    el.style.opacity = '0.7';
    el.style.transform = `translateX(${Math.random() > 0.5 ? 2 : -2}px)`;

    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = '';
      delete el.dataset.recalculating;
    }, 450);
  }

  registerLogoIntrusions() {
    const logos = document.querySelectorAll('.museum-mark-svg, .museum-mark-svg-small');
    logos.forEach(svg => {
      const path = svg.querySelector('path');
      if (path) {
        path.style.transition = 'stroke-dashoffset 0.8s var(--ease-curatorial), transform 0.8s var(--ease-curatorial)';
      }

      svg.addEventListener('mouseenter', () => {
        // Impossible precession: orbit contracts and rotates inversely
        if (path) {
          path.style.transformOrigin = '16px 16px';
          path.style.transform = `scale(${0.92 + Math.random() * 0.15}) rotate(${Math.random() > 0.5 ? 18 : -18}deg)`;
        }
      });

      svg.addEventListener('mouseleave', () => {
        if (path) {
          path.style.transform = '';
        }
      });
    });
  }

  registerTextBaselineFluctuations() {
    // Select editorial titles and kickers to make letters subtly hesitate when watched
    const textEls = document.querySelectorAll('.threshold-kicker, .vault-meta, .c-card-acc');
    textEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        // Subtle letter spacing dilation under observation
        el.style.letterSpacing = `${0.28 + Math.abs(normX) * 0.12}em`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.letterSpacing = '';
      });
    });
  }

  updateCursor(dt) {
    if (!this.cursorEl) return;

    // Reticle cursor lags smoothly with physical elasticity
    const currentTransform = this.cursorEl.style.transform;
    const match = currentTransform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
    let curX = this.mouse.x;
    let curY = this.mouse.y;

    if (match) {
      curX = parseFloat(match[1]);
      curY = parseFloat(match[2]);
    }

    const targetX = this.mouse.x;
    const targetY = this.mouse.y;

    // Inertial spring
    const nextX = curX + (targetX - curX) * 0.22;
    const nextY = curY + (targetY - curY) * 0.22;

    // Distort reticle aspect ratio based on cursor velocity (physical mass drag)
    const stretch = Math.min(this.mouse.speed * 0.012, 0.4);
    const angle = Math.atan2(this.mouse.vy, this.mouse.vx);

    this.cursorEl.style.transform = `translate(${nextX}px, ${nextY}px) translate(-50%, -50%) rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch * 0.5})`;

    // Observation idle effect: if visitor stays still, cursor breathes
    this.mouse.idleTime += dt;
    if (this.mouse.idleTime > 2.5) {
      const breath = Math.sin(this.time * 2) * 4;
      this.cursorEl.style.width = `${28 + breath}px`;
      this.cursorEl.style.height = `${28 + breath}px`;
    } else {
      this.cursorEl.style.width = '';
      this.cursorEl.style.height = '';
    }
  }

  updateCoordinates(dt) {
    if (!this.coordinateStream) return;

    // Coordinates slowly drift along impossible non-Euclidean curvature
    const lat = (42.081 + Math.sin(this.time * 0.2) * 0.015).toFixed(4);
    const entropy = (-1.000000 - Math.cos(this.time * 0.15) * 0.0042).toFixed(6);
    const gEffect = (-1.280 + Math.sin(this.time * 0.4) * 0.012).toFixed(3);

    // Subtle drift: 90% upward causality
    this.coordinateStream.textContent = `DATUM: ${lat} // SPACETIME STRAIN: ${entropy} ΔS // g = ${gEffect} m/s² (REPULSIVE)`;
  }

  loop() {
    const dt = 0.016;
    this.time += dt;

    this.updateCursor(dt);
    this.updateCoordinates(dt);

    requestAnimationFrame(this.loop);
  }
}
