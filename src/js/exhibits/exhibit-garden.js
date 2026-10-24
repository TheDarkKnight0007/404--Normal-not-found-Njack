/**
 * Exhibit 004: THE GARDEN OF EQUAL SHAPES (Symmetry)
 * Theme: Conformity, standardization, fear of being different.
 * "Perfection can become a prison."
 */

import { museumAudio } from '../audio.js';

export class ExhibitGarden {
  constructor(containerElement, onComplete) {
    this.container = containerElement;
    this.onComplete = onComplete;
    this.canvas = containerElement.querySelector('#garden-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = 0;
    this.height = 0;
    this.animId = null;
    this.time = 0;

    // Geometric Rosettes Matrix
    this.rosettes = [];
    this.cols = 6;
    this.rows = 4;
    this.rebelIndex = 8; // Row 1, Col 2: The Rogue Asymmetrical Flower

    // Moral Decision State: 'STANDARDIZED' | 'REBELLION' | 'CONFORMITY_ENFORCED' | 'DIVERSITY_LIBERATED'
    this.state = 'REBELLION';
    this.bloomProgress = 0;

    // Floating Pollen Particles
    this.pollen = [];

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    const btnConform = this.container.querySelector('#btn-garden-conform');
    if (btnConform) {
      btnConform.addEventListener('click', () => this.enforceConformity());
    }

    const btnProtect = this.container.querySelector('#btn-garden-protect');
    if (btnProtect) {
      btnProtect.addEventListener('click', () => this.protectDifference());
    }

    const btnArchive = this.container.querySelector('#btn-garden-archive');
    if (btnArchive) {
      btnArchive.addEventListener('click', () => {
        if (this.onComplete) this.onComplete();
      });
    }

    this.initRosettes();
    this.initPollen();

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

    this.initRosettes();
  }

  initRosettes() {
    this.rosettes = [];
    const cellW = this.width / (this.cols + 1);
    const cellH = this.height / (this.rows + 1);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const idx = r * this.cols + c;
        const isRebel = idx === this.rebelIndex;

        this.rosettes.push({
          idx,
          c,
          r,
          x: cellW * (c + 1),
          y: cellH * (r + 1),
          radius: Math.min(cellW, cellH) * 0.34,
          petals: 6,
          isRebel,
          phaseOffset: isRebel ? 1.4 : 0, // Rebel pulses out of sync!
          variance: isRebel ? 1.0 : 0.0,
          color: isRebel ? '#FFFFFF' : '#B5A3FF'
        });
      }
    }
  }

  initPollen() {
    this.pollen = [];
    for (let i = 0; i < 70; i++) {
      this.pollen.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.3 - Math.random() * 0.8,
        size: 1 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.6
      });
    }
  }

  enforceConformity() {
    this.state = 'CONFORMITY_ENFORCED';
    museumAudio.playFailurePulse();

    const banner = this.container.querySelector('#garden-conform-banner');
    if (banner) banner.classList.add('active');

    const rebel = this.rosettes[this.rebelIndex];
    if (rebel) {
      rebel.isRebel = false;
      rebel.variance = 0;
      rebel.color = 'rgba(245, 241, 232, 0.25)';
    }

    this.rosettes.forEach(r => {
      r.color = 'rgba(245, 241, 232, 0.25)';
    });

    const choiceWrap = this.container.querySelector('#garden-choice-actions');
    if (choiceWrap) choiceWrap.style.display = 'none';

    const nextWrap = this.container.querySelector('#garden-next-wrap');
    if (nextWrap) nextWrap.classList.add('visible');
  }

  protectDifference() {
    this.state = 'DIVERSITY_LIBERATED';
    museumAudio.playBloomChord();

    const banner = this.container.querySelector('#garden-liberate-banner');
    if (banner) banner.classList.add('active');

    // Bloom spreads: all rosettes differentiate into unique organic forms!
    this.rosettes.forEach((r, i) => {
      r.variance = 0.5 + Math.random() * 0.8;
      r.petals = 5 + (i % 5);
      r.color = i % 2 === 0 ? '#B5A3FF' : '#F5F1E8';
    });

    const choiceWrap = this.container.querySelector('#garden-choice-actions');
    if (choiceWrap) choiceWrap.style.display = 'none';

    const nextWrap = this.container.querySelector('#garden-next-wrap');
    if (nextWrap) nextWrap.classList.add('visible');
  }

  update(dt) {
    this.time += dt;

    if (this.state === 'DIVERSITY_LIBERATED') {
      this.bloomProgress = Math.min(1.0, this.bloomProgress + dt * 0.6);
    }

    // Update pollen
    for (const p of this.pollen) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < 0) {
        p.y = this.height;
        p.x = Math.random() * this.width;
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Geometric Connective Grid (Conformity Lattice)
    ctx.save();
    ctx.strokeStyle = this.state === 'CONFORMITY_ENFORCED'
      ? 'rgba(245, 241, 232, 0.05)'
      : 'rgba(149, 136, 255, 0.12)';
    ctx.lineWidth = 1;

    for (let r = 0; r < this.rows; r++) {
      const y = this.rosettes[r * this.cols].y;
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(this.width - 30, y);
      ctx.stroke();
    }
    for (let c = 0; c < this.cols; c++) {
      const x = this.rosettes[c].x;
      ctx.beginPath();
      ctx.moveTo(x, 30);
      ctx.lineTo(x, this.height - 30);
      ctx.stroke();
    }
    ctx.restore();

    // 2. Draw Floating Organic Pollen
    ctx.save();
    for (const p of this.pollen) {
      ctx.fillStyle = this.state === 'DIVERSITY_LIBERATED'
        ? `rgba(181, 163, 255, ${p.alpha * 0.85})`
        : `rgba(245, 241, 232, ${p.alpha * 0.4})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Draw Rosettes (Rigid hex symmetry vs Living asymmetry)
    this.rosettes.forEach((r) => {
      this.drawRosette(ctx, r);
    });

    // 4. Surveillance Marker on Rebel if still in rebellion state
    if (this.state === 'REBELLION') {
      const rebel = this.rosettes[this.rebelIndex];
      ctx.save();
      ctx.strokeStyle = 'rgba(181, 163, 255, 0.85)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(rebel.x, rebel.y, rebel.radius * 1.55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '8.5px "IBM Plex Mono", monospace';
      ctx.fillStyle = '#B5A3FF';
      ctx.textAlign = 'center';
      ctx.fillText('ANOMALY // DEVIANT GEOMETRY', rebel.x, rebel.y + rebel.radius * 1.8);
      ctx.restore();
    }
  }

  drawRosette(ctx, r) {
    ctx.save();
    const isRebel = r.isRebel;
    const isLiberated = this.state === 'DIVERSITY_LIBERATED';
    const isCold = this.state === 'CONFORMITY_ENFORCED';

    // Pulse rhythm
    const pulseSpeed = isRebel ? 1.8 : 3.0;
    const pulse = Math.sin(this.time * pulseSpeed + r.phaseOffset) * 0.12;
    const currentRadius = r.radius * (1.0 + pulse);

    ctx.translate(r.x, r.y);

    // Petals
    const petals = r.petals;
    for (let p = 0; p < petals; p++) {
      const angle = (p / petals) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);

      // In asymmetry: petals stretch non-uniformly!
      let petalLength = currentRadius;
      if (isRebel || (isLiberated && p % 2 === 1)) {
        petalLength *= 1.35;
      }

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(petalLength * 0.5, petalLength * 0.35, petalLength, 0);
      ctx.quadraticCurveTo(petalLength * 0.5, -petalLength * 0.35, 0, 0);
      ctx.closePath();

      if (isCold) {
        ctx.fillStyle = 'rgba(245, 241, 232, 0.04)';
        ctx.strokeStyle = 'rgba(245, 241, 232, 0.12)';
      } else if (isRebel) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.strokeStyle = '#FFFFFF';
      } else if (isLiberated) {
        ctx.fillStyle = 'rgba(181, 163, 255, 0.18)';
        ctx.strokeStyle = '#B5A3FF';
      } else {
        ctx.fillStyle = 'rgba(149, 136, 255, 0.08)';
        ctx.strokeStyle = 'rgba(181, 163, 255, 0.45)';
      }

      ctx.lineWidth = isRebel ? 1.6 : 1.0;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Center seed core
    ctx.fillStyle = isRebel ? '#FFFFFF' : (isCold ? 'rgba(245, 241, 232, 0.2)' : '#B5A3FF');
    ctx.beginPath();
    ctx.arc(0, 0, currentRadius * 0.22, 0, Math.PI * 2);
    ctx.fill();

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
