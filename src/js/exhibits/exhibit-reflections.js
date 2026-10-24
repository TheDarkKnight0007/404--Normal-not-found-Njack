/**
 * Exhibit 003: THE ROOM OF PERFECT REFLECTIONS (Optics)
 * Theme: Identity, perception, external expectations.
 * "Which version is actually me?"
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

    // Mouse Tracking & History Buffer (for Past reflection)
    this.mouse = { x: -9999, y: -9999, isMoving: false, idleTime: 0, vx: 0, vy: 0 };
    this.mouseHistory = [];

    // The 4 Independent Reflections
    this.mirrors = [
      {
        id: 'past',
        name: 'MIRROR I // THE REGRET',
        subtitle: 'The person you were yesterday (Trapped in history)',
        x: 0, y: 0, targetX: 0, targetY: 0,
        color: '#9588FF',
        facingUser: false
      },
      {
        id: 'present',
        name: 'MIRROR II // THE OBSERVER',
        subtitle: 'The fragile present (Quantum tremor)',
        x: 0, y: 0, targetX: 0, targetY: 0,
        color: '#F5F1E8',
        facingUser: false
      },
      {
        id: 'future',
        name: 'MIRROR III // THE DEMAND',
        subtitle: 'The expected ideal (Moves before you)',
        x: 0, y: 0, targetX: 0, targetY: 0,
        color: '#B5A3FF',
        facingUser: false
      },
      {
        id: 'rogue',
        name: 'MIRROR IV // THE UNGOVERNED',
        subtitle: 'The version who refuses to participate',
        x: 0, y: 0, targetX: 0, targetY: 0,
        color: '#FFFFFF',
        facingUser: false
      }
    ];

    this.allFacing = false;
    this.isShattered = false;
    this.shatterProgress = 0;

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    if (this.canvas) {
      this.canvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
      this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    }

    const btnConfront = this.container.querySelector('#btn-reflections-confront');
    if (btnConfront) {
      btnConfront.addEventListener('click', () => this.triggerReflectionConfrontation());
    }

    const btnShatter = this.container.querySelector('#btn-reflections-shatter');
    if (btnShatter) {
      btnShatter.addEventListener('click', () => this.shatterMirrors());
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

    const cx = this.width / 2;
    const cy = this.height / 2;

    this.mirrors.forEach((m, i) => {
      if (!m.x && !m.y) {
        m.x = cx + (i - 1.5) * 160;
        m.y = cy;
      }
    });
  }

  onPointerMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const newX = e.clientX - rect.left;
    const newY = e.clientY - rect.top;

    this.mouse.vx = newX - (this.mouse.x === -9999 ? newX : this.mouse.x);
    this.mouse.vy = newY - (this.mouse.y === -9999 ? newY : this.mouse.y);
    this.mouse.x = newX;
    this.mouse.y = newY;
    this.mouse.isMoving = true;
    this.mouse.idleTime = 0;

    // Append to History buffer (Timestamped coordinates)
    this.mouseHistory.push({ x: newX, y: newY, time: this.time });
    if (this.mouseHistory.length > 200) {
      this.mouseHistory.shift();
    }
  }

  onPointerDown(e) {
    museumAudio.playGlassChime(880, 0.4);
    // Tap on mirror to trigger independent refractive ripple
    const rect = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const colWidth = this.width / 4;
    const colIdx = Math.floor(clickX / colWidth);
    if (this.mirrors[colIdx]) {
      this.focusMirror(colIdx);
    }
  }

  focusMirror(idx) {
    const m = this.mirrors[idx];
    const quoteEl = this.container.querySelector('#reflections-whisper');
    if (quoteEl) {
      quoteEl.textContent = `"${m.name} // ${m.subtitle}"`;
      quoteEl.classList.add('glow');
      setTimeout(() => quoteEl.classList.remove('glow'), 1200);
    }
    museumAudio.playMirrorRefract();
  }

  triggerReflectionConfrontation() {
    this.allFacing = true;
    this.mirrors.forEach(m => m.facingUser = true);
    museumAudio.playMirrorRefract();

    const banner = this.container.querySelector('#reflections-confront-banner');
    if (banner) banner.classList.add('active');
  }

  shatterMirrors() {
    if (this.isShattered) return;
    this.isShattered = true;
    this.allFacing = true;
    museumAudio.playFailurePulse();

    const banner = this.container.querySelector('#reflections-shatter-banner');
    if (banner) banner.classList.add('active');

    setTimeout(() => {
      museumAudio.playBloomChord();
      if (this.onComplete) this.onComplete();
    }, 2800);
  }

  update(dt) {
    this.time += dt;

    if (this.mouse.isMoving) {
      this.mouse.idleTime += dt;
      if (this.mouse.idleTime > 1.8 && !this.allFacing) {
        // Auto-trigger: When visitor stops moving, all reflections look at them!
        this.triggerReflectionConfrontation();
      }
    }

    if (this.isShattered) {
      this.shatterProgress = Math.min(1.0, this.shatterProgress + dt * 0.9);
      return;
    }

    const cx = this.width / 2;
    const cy = this.height / 2;
    const colW = this.width / 4;

    // 1. MIRROR I: THE PAST (Delayed by 1.4 seconds)
    const targetPastTime = this.time - 1.4;
    const pastEntry = this.mouseHistory.find(h => h.time >= targetPastTime) || this.mouseHistory[0];
    if (pastEntry) {
      this.mirrors[0].targetX = colW * 0.5 + (pastEntry.x - cx) * 0.45;
      this.mirrors[0].targetY = cy + (pastEntry.y - cy) * 0.6;
    }

    // 2. MIRROR II: THE PRESENT (Tracks real mouse + quantum jitter)
    if (this.mouse.x > 0) {
      const jitterX = (Math.random() - 0.5) * 4;
      const jitterY = (Math.random() - 0.5) * 4;
      this.mirrors[1].targetX = colW * 1.5 + (this.mouse.x - cx) * 0.45 + jitterX;
      this.mirrors[1].targetY = cy + (this.mouse.y - cy) * 0.6 + jitterY;
    }

    // 3. MIRROR III: THE EXPECTATION (Moves BEFORE user! Jumps ahead of velocity vector)
    if (this.mouse.x > 0) {
      const predictX = this.mouse.x + this.mouse.vx * 14;
      const predictY = this.mouse.y + this.mouse.vy * 14;
      this.mirrors[2].targetX = colW * 2.5 + (predictX - cx) * 0.45;
      this.mirrors[2].targetY = cy + (predictY - cy) * 0.6;
    }

    // 4. MIRROR IV: THE ROGUE (Refuses to obey! Moves inversely or orbits independently)
    const rogueAng = this.time * 1.6;
    this.mirrors[3].targetX = colW * 3.5 + Math.cos(rogueAng) * 65 - (this.mouse.x - cx) * 0.2;
    this.mirrors[3].targetY = cy + Math.sin(rogueAng * 1.3) * 55;

    // Smooth spring interpolation for all 4 reflections
    this.mirrors.forEach(m => {
      m.x += (m.targetX - m.x) * 0.12;
      m.y += (m.targetY - m.y) * 0.12;
    });
  }

  draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);

    const colW = this.width / 4;
    const h = this.height;

    // 1. Draw 4 Vertical Glass Mirror Panels with Refractive Gradients
    for (let i = 0; i < 4; i++) {
      const x1 = i * colW;
      const mirror = this.mirrors[i];

      // Mirror surface glass sheen
      const glassGrad = ctx.createLinearGradient(x1, 0, x1 + colW, h);
      glassGrad.addColorStop(0, 'rgba(21, 25, 54, 0.45)');
      glassGrad.addColorStop(0.5, 'rgba(13, 16, 32, 0.7)');
      glassGrad.addColorStop(1, 'rgba(8, 11, 23, 0.9)');

      ctx.fillStyle = glassGrad;
      ctx.fillRect(x1 + 4, 10, colW - 8, h - 20);

      // Hairline Frame
      ctx.strokeStyle = mirror.facingUser ? 'rgba(181, 163, 255, 0.85)' : 'rgba(245, 241, 232, 0.14)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x1 + 4, 10, colW - 8, h - 20);

      // Architectural Mirror Label at top
      ctx.font = '8.5px "IBM Plex Mono", monospace';
      ctx.fillStyle = mirror.facingUser ? '#B5A3FF' : 'rgba(245, 241, 232, 0.55)';
      ctx.textAlign = 'center';
      ctx.fillText(mirror.name, x1 + colW / 2, 38);

      // 2. Draw Disobedient Silhouette / Avatar in Each Mirror
      this.drawReflectionAvatar(ctx, mirror.x, mirror.y, mirror);

      // Glass Diagonal Specular Reflection Line
      ctx.strokeStyle = 'rgba(181, 163, 255, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x1 + 10, 15);
      ctx.lineTo(x1 + colW - 10, h * 0.45);
      ctx.stroke();
    }

    // 3. Draw Crystalline Shatter Effect if shattered
    if (this.shatterProgress > 0) {
      const sp = this.shatterProgress;
      ctx.strokeStyle = `rgba(245, 241, 232, ${1.0 - sp})`;
      ctx.lineWidth = 1.5;

      for (let i = 0; i < 48; i++) {
        const x = (i % 6) * (this.width / 5);
        const y = Math.floor(i / 6) * (this.height / 7);
        const shiftX = (Math.random() - 0.5) * sp * 120;
        const shiftY = (Math.random() - 0.5) * sp * 120;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 40 + shiftX, y + 50 + shiftY);
        ctx.lineTo(x - 20 + shiftX, y + 80 + shiftY);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  drawReflectionAvatar(ctx, x, y, mirror) {
    ctx.save();
    const isFacing = mirror.facingUser;

    // Glowing aura
    ctx.fillStyle = mirror.color === '#FFFFFF' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(181, 163, 255, 0.22)';
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.fill();

    // Reticle Silhouette Head
    ctx.fillStyle = mirror.color;
    ctx.beginPath();
    ctx.arc(x, y - 18, 12, 0, Math.PI * 2);
    ctx.fill();

    // Body / Torso
    ctx.strokeStyle = mirror.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y - 6);
    ctx.lineTo(x, y + 26);
    ctx.lineTo(x - 14, y + 52);
    ctx.moveTo(x, y + 26);
    ctx.lineTo(x + 14, y + 52);
    ctx.moveTo(x - 20, y + 10);
    ctx.lineTo(x + 20, y + 10);
    ctx.stroke();

    // If facing the user: Direct eye contact reticle locks on!
    if (isFacing) {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y - 18, 18, 0, Math.PI * 2);
      ctx.stroke();

      // Pupil staring at observer
      ctx.fillStyle = '#080b17';
      ctx.beginPath();
      ctx.arc(x, y - 18, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  loop() {
    this.update(0.016);
    this.draw();
    this.animId = requestAnimationFrame(this.loop);
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
