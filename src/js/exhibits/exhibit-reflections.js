/**
 * Exhibit 003: THE ROOM OF PERFECT REFLECTIONS (Optics)
 * Active Gameplay: Four Disobedient Mirrors
 * 
 * Objective: Investigate 4 mirrors, test their motion relative to you, and determine which mirror can be trusted.
 * Mechanics:
 * - Mirror A: Copies position correctly in real-time. But on close inspection: it never blinks and casts no shadow.
 * - Mirror B: Moves BEFORE the player! Anticipates velocity and leaps ahead.
 * - Mirror C: Moves AFTER the player (trails 700ms behind with elastic sluggishness).
 * - Mirror D: As the player sweeps the cursor over the glass, the silvering wipes away to reveal:
 *   "NONE OF US ARE MIRRORS. WE ARE WATCHING YOU."
 * - Selecting any individual mirror produces clear in-room feedback explaining why it cannot be trusted.
 * - Once all 4 mirrors are explored, the player can declare:
 *   [NO MIRROR CAN BE TRUSTED // WE ARE BEING WATCHED].
 * - The 4 mirrors pivot toward the player, the reflection vanishes, and Accession 003 unlocks.
 */

import { museumAudio } from '../audio.js';

export class ExhibitReflections {
  constructor(containerElement, onComplete) {
    this.container = containerElement;
    this.onComplete = onComplete;
    this.canvas = containerElement.querySelector('#reflections-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = 0;
    this.height = 0;
    this.animId = null;
    this.time = 0;

    // Mouse tracking & history
    this.mouse = { x: -9999, y: -9999, vx: 0, vy: 0, prevX: -9999, prevY: -9999, isOver: false };
    this.mouseHistory = [];

    // 4 Monolithic Architectural Mirrors
    this.mirrors = [
      {
        id: 'mirror-a',
        label: 'MIRROR A',
        xRatio: 0.16,
        x: 0,
        y: 0,
        width: 120,
        height: 280,
        tested: false,
        reflX: 0,
        reflY: 0,
        type: 'replica',
        title: 'THE EXACT REPLICA',
        clue: 'Copies your position instantly... but its reflection has no shadow and refuses to blink.'
      },
      {
        id: 'mirror-b',
        label: 'MIRROR B',
        xRatio: 0.38,
        x: 0,
        y: 0,
        width: 120,
        height: 280,
        tested: false,
        reflX: 0,
        reflY: 0,
        type: 'anticipator',
        title: 'THE ANTICIPATOR',
        clue: 'Moves before you do. It anticipates your velocity and arrives ahead of your hand.'
      },
      {
        id: 'mirror-c',
        label: 'MIRROR C',
        xRatio: 0.62,
        x: 0,
        y: 0,
        width: 120,
        height: 280,
        tested: false,
        reflX: 0,
        reflY: 0,
        type: 'lagging',
        title: 'THE CHRONO-LAG',
        clue: 'Trails 700ms in the past. Sluggish and bound to delayed inertia.'
      },
      {
        id: 'mirror-d',
        label: 'MIRROR D',
        xRatio: 0.84,
        x: 0,
        y: 0,
        width: 120,
        height: 280,
        tested: false,
        reflX: 0,
        reflY: 0,
        type: 'etching',
        title: 'THE INSCRIPTION',
        wipeProgress: 0,
        clue: 'Scratched from the inside: "NONE OF US ARE MIRRORS. WE ARE WATCHING YOU."'
      }
    ];

    this.testedCount = 0;
    this.hoveredMirror = null;
    this.selectedMirror = null;
    this.shattered = false;
    this.pivoted = false;

    // DOM UI
    this.whisperEl = containerElement.querySelector('#reflections-whisper');
    this.testedCountEl = containerElement.querySelector('#reflections-tested-count');
    this.floorActionWrap = containerElement.querySelector('#mirror-floor-action-wrap');
    this.btnVerdict = containerElement.querySelector('#btn-no-mirror-trusted');
    this.feedbackEl = containerElement.querySelector('#mirror-chamber-feedback');
    this.shatterBanner = containerElement.querySelector('#reflections-shatter-banner');

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    if (this.canvas) {
      this.canvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
      this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
      this.canvas.addEventListener('pointerleave', () => {
        this.mouse.isOver = false;
        this.hoveredMirror = null;
      });
    }

    if (this.btnVerdict) {
      this.btnVerdict.addEventListener('click', () => this.triggerGrandRevelation());
    }

    this.loop = this.loop.bind(this);
    this.animId = requestAnimationFrame(this.loop);
  }

  handleResize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || window.innerHeight;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const mWidth = Math.min(130, this.width * 0.18);
    const mHeight = Math.min(320, this.height * 0.65);

    this.mirrors.forEach((m) => {
      m.width = mWidth;
      m.height = mHeight;
      m.x = this.width * m.xRatio - mWidth / 2;
      m.y = this.height * 0.48 - mHeight / 2;
      m.reflX = m.x + m.width / 2;
      m.reflY = m.y + m.height / 2;
    });
  }

  onPointerMove(e) {
    if (!this.canvas || this.shattered) return;
    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    if (this.mouse.prevX !== -9999) {
      this.mouse.vx = px - this.mouse.prevX;
      this.mouse.vy = py - this.mouse.prevY;
    }
    this.mouse.prevX = px;
    this.mouse.prevY = py;
    this.mouse.x = px;
    this.mouse.y = py;
    this.mouse.isOver = true;

    // Track position history for lag calculation
    this.mouseHistory.push({ x: px, y: py, t: performance.now() });
    if (this.mouseHistory.length > 90) this.mouseHistory.shift();

    // Check which mirror is hovered
    let hovered = null;
    for (let i = 0; i < this.mirrors.length; i++) {
      const m = this.mirrors[i];
      if (px >= m.x && px <= m.x + m.width && py >= m.y && py <= m.y + m.height) {
        hovered = m;
        // If hovering over Mirror D, wipe away silvering
        if (m.type === 'etching') {
          m.wipeProgress = Math.min(1.0, m.wipeProgress + 0.04);
          if (m.wipeProgress > 0.6 && !m.tested) {
            this.markMirrorTested(m);
          }
        }
        break;
      }
    }

    this.hoveredMirror = hovered;
    this.canvas.style.cursor = hovered ? 'pointer' : 'default';
  }

  onPointerDown(e) {
    if (this.shattered) return;
    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    for (let i = 0; i < this.mirrors.length; i++) {
      const m = this.mirrors[i];
      if (px >= m.x && px <= m.x + m.width && py >= m.y && py <= m.y + m.height) {
        this.inspectMirror(m);
        return;
      }
    }
  }

  inspectMirror(mirror) {
    this.markMirrorTested(mirror);
    museumAudio.playGlassChime(620, 0.25);

    // Provide immediate in-room feedback explaining why this mirror fails
    if (this.feedbackEl) {
      let feedbackText = '';
      if (mirror.type === 'replica') {
        feedbackText = `${mirror.label}: Copies your movement, but you cast no true reflection. Can an imitation without a shadow be trusted?`;
      } else if (mirror.type === 'anticipator') {
        feedbackText = `${mirror.label}: Moves before you move. It is anticipating and dictating your hand, not reflecting reality.`;
      } else if (mirror.type === 'lagging') {
        feedbackText = `${mirror.label}: Trails in the past. It lags 700ms behind and cannot reflect the present moment.`;
      } else if (mirror.type === 'etching') {
        feedbackText = `${mirror.label}: Scratched from inside: "NONE OF US ARE MIRRORS. WE ARE WATCHING YOU."`;
      }

      this.feedbackEl.textContent = feedbackText;
      this.feedbackEl.style.display = 'block';
    }

    if (this.whisperEl) {
      this.whisperEl.textContent = `${mirror.label} PROBED: ${mirror.clue.toUpperCase()}`;
    }
  }

  markMirrorTested(mirror) {
    if (!mirror.tested) {
      mirror.tested = true;
      this.testedCount++;
      if (this.testedCountEl) {
        this.testedCountEl.textContent = `${this.testedCount} / 4 TESTED`;
      }

      // Check if all tested or secret found
      if (this.testedCount >= 3 || (this.mirrors[3].wipeProgress > 0.6)) {
        if (this.floorActionWrap) {
          this.floorActionWrap.style.display = 'flex';
          museumAudio.playGlassChime(880, 0.4);
        }
      }
    }
  }

  triggerGrandRevelation() {
    if (this.shattered) return;
    this.shattered = true;
    this.pivoted = true;

    // Dramatic Glass Shatter & Pivot Audio
    museumAudio.playSingularityCollapse();
    museumAudio.playMeshTear();

    if (this.floorActionWrap) this.floorActionWrap.style.display = 'none';
    if (this.feedbackEl) {
      this.feedbackEl.textContent = 'REVELATION: ALL MIRRORS HAVE ROTATED TO FACE YOU. YOUR REFLECTION IS EXTINGUISHED.';
      this.feedbackEl.style.color = 'var(--color-lavender)';
    }

    setTimeout(() => {
      if (this.shatterBanner) {
        this.shatterBanner.classList.add('banner-visible');
        museumAudio.playTheoryFailure();
      }
      if (typeof this.onComplete === 'function') {
        this.onComplete();
      }
    }, 1800);
  }

  loop() {
    this.time += 0.016;
    this.updateMirrorPhysics();
    this.render();
    this.animId = requestAnimationFrame(this.loop);
  }

  updateMirrorPhysics() {
    const mx = this.mouse.x;
    const my = this.mouse.y;
    const now = performance.now();

    this.mirrors.forEach((m) => {
      if (this.pivoted) return;

      const centerX = m.x + m.width / 2;
      const centerY = m.y + m.height / 2;

      if (!this.mouse.isOver || mx < 0) {
        m.reflX += (centerX - m.reflX) * 0.05;
        m.reflY += (centerY - m.reflY) * 0.05;
        return;
      }

      // Normalized cursor offset relative to mirror center
      const targetRelX = (mx - this.width / 2) * 0.35;
      const targetRelY = (my - this.height / 2) * 0.45;

      if (m.type === 'replica') {
        // Direct real-time reflection
        m.reflX = centerX + targetRelX;
        m.reflY = centerY + targetRelY;
      } else if (m.type === 'anticipator') {
        // Predicts ahead using velocity
        const leadX = targetRelX + (this.mouse.vx || 0) * 8.0;
        const leadY = targetRelY + (this.mouse.vy || 0) * 8.0;
        m.reflX += (centerX + leadX - m.reflX) * 0.25;
        m.reflY += (centerY + leadY - m.reflY) * 0.25;
      } else if (m.type === 'lagging') {
        // 700ms delayed playback from mouse history
        let delayedPos = { x: mx, y: my };
        for (let i = this.mouseHistory.length - 1; i >= 0; i--) {
          if (now - this.mouseHistory[i].t >= 650) {
            delayedPos = this.mouseHistory[i];
            break;
          }
        }
        const delRelX = (delayedPos.x - this.width / 2) * 0.35;
        const delRelY = (delayedPos.y - this.height / 2) * 0.45;
        m.reflX += (centerX + delRelX - m.reflX) * 0.08;
        m.reflY += (centerY + delRelY - m.reflY) * 0.08;
      } else if (m.type === 'etching') {
        // Follows normally
        m.reflX += (centerX + targetRelX - m.reflX) * 0.15;
        m.reflY += (centerY + targetRelY - m.reflY) * 0.15;
      }
    });
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render Gallery Floor Perspective Grid
    this.renderFloorGrid(ctx);

    // 2. Render 4 Monolithic Mirrors
    this.renderMirrors(ctx);
  }

  renderFloorGrid(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 241, 232, 0.05)';
    ctx.lineWidth = 1;
    const floorY = this.height * 0.76;

    // Horizon Line
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(this.width, floorY);
    ctx.stroke();

    // Perspective depth lines converging from center
    const vpX = this.width / 2;
    const vpY = this.height * 0.35;
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(vpX + i * 40, vpY);
      ctx.lineTo(vpX + i * 220, this.height);
      ctx.stroke();
    }
    ctx.restore();
  }

  renderMirrors(ctx) {
    this.mirrors.forEach((m) => {
      ctx.save();
      const isHovered = this.hoveredMirror && this.hoveredMirror.id === m.id;

      // Outer Frame
      ctx.beginPath();
      ctx.rect(m.x, m.y, m.width, m.height);
      ctx.fillStyle = 'rgba(12, 10, 18, 0.94)';
      ctx.fill();
      ctx.strokeStyle = isHovered ? '#B5A3FF' : 'rgba(245, 241, 232, 0.25)';
      ctx.lineWidth = isHovered ? 2.0 : 1.2;
      ctx.stroke();

      // Mirror Glass Inner Sheen
      const glassGrad = ctx.createLinearGradient(m.x, m.y, m.x + m.width, m.y + m.height);
      glassGrad.addColorStop(0, 'rgba(181, 163, 255, 0.06)');
      glassGrad.addColorStop(0.5, 'rgba(245, 241, 232, 0.02)');
      glassGrad.addColorStop(1, 'rgba(112, 224, 208, 0.04)');
      ctx.fillStyle = glassGrad;
      ctx.fillRect(m.x + 4, m.y + 4, m.width - 8, m.height - 8);

      // Reflection Body (Unless pivoted/shattered)
      if (!this.pivoted) {
        // Reflected entity inside mirror
        ctx.save();
        // Clip to inside mirror frame
        ctx.beginPath();
        ctx.rect(m.x + 4, m.y + 4, m.width - 8, m.height - 8);
        ctx.clip();

        // Reflected silhouette or orb
        ctx.beginPath();
        ctx.arc(m.reflX, m.reflY, 14, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? 'rgba(181, 163, 255, 0.85)' : 'rgba(245, 241, 232, 0.5)';
        ctx.fill();

        // Pulsing orbit ring around reflection
        ctx.beginPath();
        ctx.arc(m.reflX, m.reflY, 22 + Math.sin(this.time * 4) * 2, 0, Math.PI * 2);
        ctx.strokeStyle = isHovered ? '#B5A3FF' : 'rgba(245, 241, 232, 0.25)';
        ctx.stroke();

        // If Mirror D: Draw scratched secret inscription as user wipes
        if (m.type === 'etching' && m.wipeProgress > 0.05) {
          ctx.font = '500 10px "IBM Plex Mono", monospace';
          ctx.fillStyle = `rgba(181, 163, 255, ${m.wipeProgress})`;
          ctx.textAlign = 'center';
          ctx.fillText('NOT A MIRROR', m.x + m.width / 2, m.y + m.height * 0.4);
          ctx.fillText('WE ARE WATCHING', m.x + m.width / 2, m.y + m.height * 0.48);
          ctx.fillText('YOU', m.x + m.width / 2, m.y + m.height * 0.56);
        }

        ctx.restore();
      } else {
        // Pivoted state: All mirrors have turned 90° on vertical brass pivots
        ctx.save();
        ctx.beginPath();
        ctx.rect(m.x + 4, m.y + 4, m.width - 8, m.height - 8);
        ctx.clip();

        // Inward staring aperture
        ctx.beginPath();
        ctx.arc(m.x + m.width / 2, m.y + m.height / 2, 28, 0, Math.PI * 2);
        ctx.strokeStyle = '#B5A3FF';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.font = '600 11px "IBM Plex Mono", monospace';
        ctx.fillStyle = '#B5A3FF';
        ctx.textAlign = 'center';
        ctx.fillText('WATCHING YOU', m.x + m.width / 2, m.y + m.height / 2 + 45);
        ctx.restore();
      }

      // Mirror Label Header
      ctx.font = '500 11px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = isHovered ? '#B5A3FF' : 'rgba(245, 241, 232, 0.7)';
      ctx.fillText(m.label, m.x + m.width / 2, m.y - 12);

      // Status indicator
      if (m.tested) {
        ctx.font = '400 9px "IBM Plex Mono", monospace';
        ctx.fillStyle = '#70E0D0';
        ctx.fillText('[PROBED]', m.x + m.width / 2, m.y + m.height + 18);
      }

      ctx.restore();
    });
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    window.removeEventListener('resize', this.handleResize);
  }
}
