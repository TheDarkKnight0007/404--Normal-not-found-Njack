/**
 * The Museum of Incorrect Physics
 * Hidden Exhibit: ACCESSION NULL // THE OBSERVATORY OF YOU
 * 
 * "This chamber does not study physics.
 * It studies the visitor.
 * The most memorable experience in the museum."
 */

import { museumAudio } from '../audio.js';
import { museumMemory } from '../museum-memory.js';

export class ExhibitNull {
  constructor(containerElement, onComplete) {
    this.container = containerElement;
    this.onComplete = onComplete;
    this.canvas = containerElement.querySelector('#null-chamber-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = 0;
    this.height = 0;
    this.animId = null;
    this.time = 0;

    // Silhouette & Reflection State
    this.mouse = { x: -999, y: -999, isOver: false, idleTime: 0 };
    this.figure = { x: 0, y: 0, targetX: 0, targetY: 0, palmRaised: false, rippleTime: 0 };
    this.ripples = [];

    // DOM UI Elements
    this.psychDossier = containerElement.querySelector('#null-psych-dossier');
    this.btnInscribe = containerElement.querySelector('#btn-null-inscribe');
    this.conclusionCard = containerElement.querySelector('#null-final-conclusion');

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    if (this.canvas) {
      this.canvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
      this.canvas.addEventListener('pointerleave', () => {
        this.mouse.isOver = false;
      });
    }

    if (this.btnInscribe) {
      this.btnInscribe.addEventListener('click', () => this.inscribeImmortalRecord());
    }

    this.populatePsychologicalDossier();
    museumAudio.playMonumentalReveal();

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

    this.figure.x = this.width / 2;
    this.figure.y = this.height * 0.45;
  }

  onPointerMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
    this.mouse.isOver = true;
    this.mouse.idleTime = 0;

    // Follow with slight uncanny delay
    this.figure.targetX = this.width - this.mouse.x; // horizontally mirrored!
    this.figure.targetY = this.height * 0.45 + (this.mouse.y - this.height * 0.5) * 0.25;
  }

  populatePsychologicalDossier() {
    if (!this.psychDossier) return;
    const disc = museumMemory.discoveries;

    const massState = disc.massCollapsed ? 'COLLAPSED VIA TRIANGULATION [CONFRONTED]' : 'EVADED';
    const clockState = disc.clockMistakes.length > 0 
      ? `HESITATED ON ${disc.clockMistakes.length} FALSE CLOCKS BEFORE FINDING REALITY`
      : 'INTUITIVE IMMEDIATE SYNCHRONIZATION';
    const mirrorState = disc.trustedWrongMirror 
      ? `INITIALLY TRUSTED ${disc.trustedWrongMirror.toUpperCase()} (DECEIVED)` 
      : 'INSTINCTIVELY SUSPICIOUS OF ALL REFLECTIONS';
    const flowerState = disc.flowerDecision === 'PRESERVED'
      ? 'CHOSE BIOLOGICAL IMPERFECTION [DEFECT LIBERATED]'
      : (disc.flowerDecision === 'DESTROYED' ? 'ENFORCED COLD MATHEMATICAL ORDER' : 'OBSERVED IN SECRET');

    this.psychDossier.innerHTML = `
      <div class="psych-metric-card">
        <span class="psych-label">01 // GRAVITATIONAL INTENT</span>
        <span class="psych-val">${massState}</span>
      </div>
      <div class="psych-metric-card">
        <span class="psych-label">02 // TEMPORAL HESITATION</span>
        <span class="psych-val">${clockState}</span>
      </div>
      <div class="psych-metric-card">
        <span class="psych-label">03 // OPTICAL TRUST COEF</span>
        <span class="psych-val">${mirrorState}</span>
      </div>
      <div class="psych-metric-card">
        <span class="psych-label">04 // MORAL DIVERGENCE</span>
        <span class="psych-val highlight-purple">${flowerState}</span>
      </div>
    `;
  }

  inscribeImmortalRecord() {
    museumAudio.playGlassChime(440, 3.0);
    museumAudio.playSingularityCollapse();

    if (this.btnInscribe) this.btnInscribe.style.display = 'none';
    if (this.conclusionCard) {
      this.conclusionCard.style.display = 'flex';
    }

    // Ripple wave across entire basin
    this.ripples.push({
      x: this.width / 2,
      y: this.height * 0.5,
      radius: 0,
      maxRadius: Math.max(this.width, this.height),
      opacity: 1.0
    });
  }

  loop() {
    this.time += 0.016;
    this.mouse.idleTime += 0.016;

    // If visitor is idle for > 2 seconds, figure raises its palm
    if (this.mouse.idleTime > 2.0) {
      if (!this.figure.palmRaised) {
        this.figure.palmRaised = true;
        museumAudio.playAcausalChime(880);
        this.ripples.push({
          x: this.figure.x,
          y: this.figure.y + 40,
          radius: 4,
          maxRadius: 180,
          opacity: 0.8
        });
      }
    } else {
      this.figure.palmRaised = false;
    }

    // Spring interpolation toward mirrored coordinate
    this.figure.x += (this.figure.targetX - this.figure.x) * 0.06;
    this.figure.y += (this.figure.targetY - this.figure.y) * 0.06;

    this.render();
    this.animId = requestAnimationFrame(this.loop);
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const poolY = this.height * 0.52;

    // 1. Perspective Geometry: The Observatory Arches
    this.renderObservatoryArches(ctx, poolY);

    // 2. Water Reflection Basin
    this.renderWaterBasin(ctx, poolY);

    // 3. Ripples on the Water
    this.renderRipples(ctx);

    // 4. The Ethereal Inverted Observer Silhouette
    this.renderSilhouette(ctx);
  }

  renderObservatoryArches(ctx, poolY) {
    ctx.save();
    ctx.strokeStyle = 'rgba(181, 163, 255, 0.12)';
    ctx.lineWidth = 1;

    const centerX = this.width / 2;
    // Concentric celestial ellipses receding into the distance
    for (let i = 1; i <= 6; i++) {
      const rx = (this.width * 0.45) * (i / 6);
      const ry = (this.height * 0.35) * (i / 6);
      ctx.beginPath();
      ctx.ellipse(centerX, poolY, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Vertical alignment guide
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, this.height);
    ctx.strokeStyle = 'rgba(245, 241, 232, 0.06)';
    ctx.stroke();
    ctx.restore();
  }

  renderWaterBasin(ctx, poolY) {
    ctx.save();
    const grad = ctx.createLinearGradient(0, poolY, 0, this.height);
    grad.addColorStop(0, 'rgba(12, 10, 22, 0.85)');
    grad.addColorStop(0.5, 'rgba(26, 22, 48, 0.45)');
    grad.addColorStop(1, 'rgba(8, 7, 14, 0.95)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, poolY, this.width, this.height - poolY);

    // Water surface horizon shimmer line
    ctx.beginPath();
    ctx.moveTo(0, poolY);
    ctx.lineTo(this.width, poolY);
    ctx.strokeStyle = 'rgba(181, 163, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  renderRipples(ctx) {
    ctx.save();
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += 1.8;
      r.opacity *= 0.985;

      ctx.beginPath();
      ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.38, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(181, 163, 255, ${r.opacity * 0.7})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      if (r.opacity < 0.02 || r.radius > r.maxRadius) {
        this.ripples.splice(i, 1);
      }
    }
    ctx.restore();
  }

  renderSilhouette(ctx) {
    const fx = this.figure.x;
    const fy = this.figure.y;

    ctx.save();
    // Ambient aura around silhouette
    const aura = ctx.createRadialGradient(fx, fy - 20, 10, fx, fy - 20, 90);
    aura.addColorStop(0, 'rgba(181, 163, 255, 0.25)');
    aura.addColorStop(1, 'rgba(181, 163, 255, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(fx, fy - 20, 90, 0, Math.PI * 2);
    ctx.fill();

    // Upper Body
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#B5A3FF';
    ctx.lineWidth = 1.5;

    // Head
    ctx.beginPath();
    ctx.arc(fx, fy - 65, 16, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(14, 12, 22, 0.95)';
    ctx.fill();
    ctx.stroke();

    // Slender Torso
    ctx.beginPath();
    ctx.moveTo(fx - 14, fy - 45);
    ctx.lineTo(fx + 14, fy - 45);
    ctx.lineTo(fx + 18, fy + 15);
    ctx.lineTo(fx - 18, fy + 15);
    ctx.closePath();
    ctx.fillStyle = 'rgba(14, 12, 22, 0.95)';
    ctx.fill();
    ctx.stroke();

    // Raised Palm (Touching the glass)
    if (this.figure.palmRaised) {
      ctx.beginPath();
      ctx.arc(fx + 28, fy - 28, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#B5A3FF';
      ctx.fill();
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 14;
      ctx.stroke();
    }

    // Inverted Water Reflection below poolY
    const reflY = this.height * 0.52 + (this.height * 0.52 - fy);
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.arc(fx, reflY + 65, 16, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(181, 163, 255, 0.4)';
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}
