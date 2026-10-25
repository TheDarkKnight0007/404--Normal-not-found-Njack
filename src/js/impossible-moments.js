/**
 * The Museum of Incorrect Physics
 * Impossible Moments & Ambient Malfunctions Engine
 * 
 * "The entire museum should feel like reality is quietly malfunctioning.
 * Alive. Playful. Unexpected. Magical. Memorable.
 * Visitors should think: 'Wait, what?' without being completely sure."
 */

import { museumAudio } from './audio.js';

export class ImpossibleMomentsEngine {
  constructor() {
    this.time = 0;
    this.mouse = { x: -999, y: -999 };
    this.clockHandsDetached = false;
    this.lastPlaqueGlitch = 0;
    this.lastPaintingShift = 0;

    this.init();
  }

  init() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }, { passive: true });

    this.initImpossibleHallwayClock();
    this.initCorridorDoors();
    this.initLogoHesitation();
    this.initPlaqueWordGlitches();
    this.initArchiveFloatingDocuments();
    this.initPaintingGaze();

    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  /**
   * 1. Hallway Clock: Hands occasionally detach and tick nearby in mid-air
   */
  initImpossibleHallwayClock() {
    const hudBrand = document.querySelector('.hud-brand-wrap');
    if (!hudBrand) return;

    let clockWrap = document.getElementById('hallway-impossible-clock');
    if (!clockWrap) {
      clockWrap = document.createElement('div');
      clockWrap.id = 'hallway-impossible-clock';
      clockWrap.className = 'hallway-impossible-clock';
      clockWrap.title = 'Chamber Invariant Chronometer';
      clockWrap.innerHTML = `
        <div class="h-clock-dial">
          <div class="h-clock-pin"></div>
          <div class="h-clock-hands" id="h-clock-hands">
            <span class="h-hand-hour"></span>
            <span class="h-hand-minute"></span>
          </div>
        </div>
        <span class="h-clock-label">HALLWAY CLOCK</span>
      `;
      hudBrand.appendChild(clockWrap);
    }
  }

  /**
   * 2. Corridor Doors: One opens inward, one outward, one slides sideways
   */
  initCorridorDoors() {
    const cards = document.querySelectorAll('.corridor-card');
    cards.forEach((card, idx) => {
      if (idx === 0) card.classList.add('door-inward');
      else if (idx === 1) card.classList.add('door-outward');
      else if (idx === 2) card.classList.add('door-sideways');
    });
  }

  /**
   * 3. Museum Logo: Orbit almost closes into a full circle when watched, then reopens
   */
  initLogoHesitation() {
    const logos = document.querySelectorAll('.museum-logo-mark');
    logos.forEach(logo => {
      let hoverTimer = null;
      logo.addEventListener('mouseenter', () => {
        hoverTimer = setTimeout(() => {
          logo.classList.add('orbit-closing');
          museumAudio.playGlassChime(1520, 0.1);
          setTimeout(() => {
            logo.classList.remove('orbit-closing');
          }, 1400);
        }, 800);
      });
      logo.addEventListener('mouseleave', () => {
        if (hoverTimer) clearTimeout(hoverTimer);
        logo.classList.remove('orbit-closing');
      });
    });
  }

  /**
   * 4. Plaques: Quietly rewrite a single word, then restore it
   */
  initPlaqueWordGlitches() {
    const targetSpans = document.querySelectorAll('.plaque-item, .vault-subtitle, .dossier-note, .threshold-subtitle');
    if (targetSpans.length === 0) return;

    setInterval(() => {
      // 30% chance every 18 seconds
      if (Math.random() < 0.35) {
        const randEl = targetSpans[Math.floor(Math.random() * targetSpans.length)];
        const orig = randEl.getAttribute('data-plaque-orig') || randEl.textContent;
        randEl.setAttribute('data-plaque-orig', orig);

        const glitchWords = ['OBSERVER', 'CONTAINMENT', 'ANOMALY #000', 'WATCHING', 'REVERSED', 'SIMULATED'];
        const chosenGlitch = glitchWords[Math.floor(Math.random() * glitchWords.length)];

        const words = orig.split(' ');
        if (words.length > 2) {
          const replaceIdx = Math.floor(Math.random() * words.length);
          words[replaceIdx] = chosenGlitch;
          randEl.textContent = words.join(' ');
          randEl.style.color = 'var(--color-lavender)';

          setTimeout(() => {
            randEl.textContent = orig;
            randEl.style.color = '';
          }, 1100);
        }
      }
    }, 16000);
  }

  /**
   * 5. Archive: 3 Documents with impossible physics (upward, sideways, static)
   */
  initArchiveFloatingDocuments() {
    const archiveScene = document.getElementById('scene-vault-archive');
    if (!archiveScene) return;

    let docLayer = document.getElementById('archive-impossible-docs');
    if (!docLayer) {
      docLayer = document.createElement('div');
      docLayer.id = 'archive-impossible-docs';
      docLayer.className = 'archive-impossible-docs';
      docLayer.innerHTML = `
        <div class="drifting-doc doc-upward" title="Document drifting upward against gravity">
          <span class="doc-stamp">RESTRICTED</span>
          <p class="doc-line"></p><p class="doc-line short"></p>
        </div>
        <div class="drifting-doc doc-sideways" title="Document drifting horizontally">
          <span class="doc-stamp">CASE 000</span>
          <p class="doc-line"></p><p class="doc-line"></p>
        </div>
        <div class="drifting-doc doc-shadow-wrong" title="Document whose shadow points the wrong direction">
          <span class="doc-stamp">EVIDENCE</span>
          <p class="doc-line"></p>
        </div>
      `;
      archiveScene.appendChild(docLayer);
    }
  }

  /**
   * 6. Corridor Painting: Changes when unobserved, freezes innocent when looked at
   */
  initPaintingGaze() {
    const rotunda = document.querySelector('.aperture-rotunda-vault');
    if (!rotunda) return;

    let frame = document.getElementById('impossible-curator-portrait');
    if (!frame) {
      frame = document.createElement('div');
      frame.id = 'impossible-curator-portrait';
      frame.className = 'impossible-curator-portrait';
      frame.innerHTML = `
        <div class="painting-frame">
          <div class="painting-canvas" id="portrait-canvas">
            <span class="portrait-silhouette" id="portrait-figure">👤</span>
            <span class="portrait-apple" id="portrait-apple">🍎</span>
          </div>
          <span class="painting-plaque">ANONYMOUS FOUNDER · 1894</span>
        </div>
      `;
      rotunda.insertBefore(frame, rotunda.querySelector('.corridor-directory-grid'));

      // Hover freeze logic
      frame.addEventListener('mouseenter', () => {
        frame.classList.add('observed-frozen');
      });
      frame.addEventListener('mouseleave', () => {
        frame.classList.remove('observed-frozen');
      });
    }
  }

  loop() {
    this.time += 0.016;

    // 1. Animate Hallway Clock Hands Detachment every ~35s
    const hands = document.getElementById('h-clock-hands');
    if (hands) {
      const cycle = this.time % 35;
      if (cycle > 22 && cycle < 31) {
        // Hands float off dial!
        const floatX = Math.sin(this.time * 2) * 28 + 32;
        const floatY = Math.cos(this.time * 2) * 12 - 16;
        hands.style.transform = `translate(${floatX}px, ${floatY}px) rotate(${this.time * 45}deg)`;
        hands.style.opacity = '0.9';
      } else {
        hands.style.transform = `translate(0px, 0px) rotate(${this.time * 30}deg)`;
        hands.style.opacity = '1';
      }
    }

    // 2. Animate Unobserved Painting when cursor is far away
    const portraitFig = document.getElementById('portrait-figure');
    const portraitApple = document.getElementById('portrait-apple');
    const portraitFrame = document.getElementById('impossible-curator-portrait');

    if (portraitFig && portraitFrame && !portraitFrame.classList.contains('observed-frozen')) {
      const tilt = Math.sin(this.time * 1.5) * 24;
      portraitFig.style.transform = `rotate(${tilt}deg) scale(${1 + Math.sin(this.time) * 0.1})`;
      if (portraitApple) {
        portraitApple.style.transform = `translate(${Math.sin(this.time * 2) * 20}px, ${Math.cos(this.time * 2) * 15}px)`;
      }
    }

    requestAnimationFrame(this.loop);
  }
}
