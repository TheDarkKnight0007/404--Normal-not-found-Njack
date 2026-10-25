/**
 * Exhibit 004: THE GARDEN OF EQUAL SHAPES (Symmetry)
 * Active Gameplay: The Living Flower in a Sterile Lattice
 * 
 * Objective: Find the single living flower hidden among 36 identical rosettes.
 * Mechanics:
 * - 36 flowers in a 6x6 grid with ZERO initial visual highlight. All look identical.
 * - Interactive Biometric Sensor (Stethoscope):
 *   - Clicking any flower attaches the probe.
 *   - Dead flowers: 0 BPM flatline, sterile click, 0.0% vitality.
 *   - Living flower (Specimen #014): 72 BPM arterial pulse, organic heartbeat sound, warm breathing petals.
 * - Once discovered, player makes a consequential moral choice:
 *   - [PRESERVE LIVING SPECIMEN]: Protect biological defect, bloom liberates lattice.
 *   - [DESTROY LIVING SPECIMEN]: Enforce mathematical conformity, specimen crystallizes.
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

    // 36 Rosettes Matrix (6 x 6)
    this.cols = 6;
    this.rows = 6;
    this.rosettes = [];
    this.rebelIndex = 14; // Hidden Specimen #014 (Row 2, Col 2)

    // State: 'INVESTIGATING' | 'DISCOVERED' | 'PRESERVED' | 'DESTROYED'
    this.state = 'INVESTIGATING';
    this.bloomProgress = 0;
    this.inspectedCount = 0;
    this.inspectedSet = new Set();
    this.activeProbeIndex = null;

    // Heartbeat timing for Specimen 14
    this.heartbeatTimer = 0;

    // DOM UI Elements
    this.stethReadout = containerElement.querySelector('#steth-sensor-readout');
    this.scannerReadout = containerElement.querySelector('#garden-scanner-readout');
    this.inspectedCountEl = containerElement.querySelector('#garden-inspected-count');
    this.choiceOverlay = containerElement.querySelector('#garden-choice-overlay');
    this.btnProtect = containerElement.querySelector('#btn-garden-protect');
    this.btnConform = containerElement.querySelector('#btn-garden-conform');
    this.conformBanner = containerElement.querySelector('#garden-conform-banner');
    this.liberateBanner = containerElement.querySelector('#garden-liberate-banner');

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    if (this.canvas) {
      this.canvas.addEventListener('pointerdown', (e) => this.onFlowerClick(e));
      this.canvas.addEventListener('pointermove', (e) => this.onFlowerHover(e));
    }

    if (this.btnProtect) {
      this.btnProtect.addEventListener('click', () => this.preserveSpecimen());
    }

    if (this.btnConform) {
      this.btnConform.addEventListener('click', () => this.destroySpecimen());
    }

    this.initRosettes();

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

    let idx = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.rosettes.push({
          idx,
          idStr: String(idx).padStart(3, '0'),
          r,
          c,
          x: cellW * (c + 1),
          y: cellH * (r + 1),
          radius: Math.min(cellW, cellH) * 0.32,
          isRebel: (idx === this.rebelIndex),
          pulse: 0,
          rotation: (idx * 0.1),
          inspected: false
        });
        idx++;
      }
    }
  }

  onFlowerHover(e) {
    if (this.state !== 'INVESTIGATING' || !this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    let hovered = null;
    for (let i = 0; i < this.rosettes.length; i++) {
      const ros = this.rosettes[i];
      if (Math.hypot(px - ros.x, py - ros.y) <= ros.radius + 6) {
        hovered = ros;
        break;
      }
    }

    this.canvas.style.cursor = hovered ? 'pointer' : 'default';
  }

  onFlowerClick(e) {
    if (this.state !== 'INVESTIGATING' || !this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    for (let i = 0; i < this.rosettes.length; i++) {
      const ros = this.rosettes[i];
      if (Math.hypot(px - ros.x, py - ros.y) <= ros.radius + 8) {
        this.inspectFlower(ros);
        return;
      }
    }
  }

  inspectFlower(ros) {
    this.activeProbeIndex = ros.idx;
    ros.inspected = true;
    this.inspectedSet.add(ros.idx);

    if (this.inspectedCountEl) {
      this.inspectedCountEl.textContent = `${this.inspectedSet.size} / 36 SCANNED`;
    }

    if (ros.isRebel) {
      // FOUND THE LIVING SPECIMEN!
      this.state = 'DISCOVERED';
      this.playOrganicHeartbeat();

      if (this.stethReadout) {
        this.stethReadout.textContent = `SPECIMEN #${ros.idStr} // PULSE: 72 BPM [LIVING HEARTBEAT DETECTED!] · VITALITY: 98.4%`;
        this.stethReadout.style.color = 'var(--color-lavender)';
      }

      if (this.scannerReadout) {
        this.scannerReadout.textContent = `CRITICAL ANOMALY: SPECIMEN #${ros.idStr} BEATS WITH BIOLOGICAL LIFE.`;
        this.scannerReadout.style.color = 'var(--color-lavender)';
      }

      // Show Moral Choice Overlay
      if (this.choiceOverlay) {
        this.choiceOverlay.style.display = 'flex';
      }
    } else {
      // Dead Crystalline Flower
      museumAudio.playGlassChime(280, 0.08);

      if (this.stethReadout) {
        this.stethReadout.textContent = `SPECIMEN #${ros.idStr} // PULSE: 0 BPM [DEAD SYMMETRY] · TEMP: 0.0°C · INERT`;
        this.stethReadout.style.color = 'var(--color-text-muted)';
      }

      if (this.scannerReadout) {
        this.scannerReadout.textContent = `SPECIMEN #${ros.idStr} CONFIRMED INERT. CONTINUE SCANNING MATRIX.`;
      }
    }
  }

  playOrganicHeartbeat() {
    museumAudio.playGlassChime(440, 0.4);
    setTimeout(() => {
      museumAudio.playGlassChime(420, 0.6);
    }, 240);
  }

  preserveSpecimen() {
    this.state = 'PRESERVED';
    if (this.choiceOverlay) this.choiceOverlay.style.display = 'none';

    museumAudio.playMonumentalReveal();

    if (this.stethReadout) {
      this.stethReadout.textContent = 'DECISION: DIFFERENCE PRESERVED. LIVING FLOWER LIBERATED.';
      this.stethReadout.style.color = '#70E0D0';
    }

    setTimeout(() => {
      if (this.liberateBanner) {
        this.liberateBanner.classList.add('banner-visible');
        museumAudio.playGlassChime(880, 1.2);
      }
      if (typeof this.onComplete === 'function') {
        this.onComplete('PRESERVED');
      }
    }, 1800);
  }

  destroySpecimen() {
    this.state = 'DESTROYED';
    if (this.choiceOverlay) this.choiceOverlay.style.display = 'none';

    museumAudio.playTheoryFailure();

    if (this.stethReadout) {
      this.stethReadout.textContent = 'DECISION: CONFORMITY ENFORCED. SPECIMEN CRYSTALLIZED TO 0 BPM.';
      this.stethReadout.style.color = '#FF7070';
    }

    setTimeout(() => {
      if (this.conformBanner) {
        this.conformBanner.classList.add('banner-visible');
        museumAudio.playGlassChime(320, 1.0);
      }
      if (typeof this.onComplete === 'function') {
        this.onComplete('DESTROYED');
      }
    }, 1800);
  }

  loop() {
    this.time += 0.016;
    this.render();
    this.animId = requestAnimationFrame(this.loop);
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Render matrix grid connecting lines
    this.renderMatrixLines(ctx);

    // Render 36 rosettes
    this.rosettes.forEach(ros => {
      this.renderRosette(ctx, ros);
    });

    // Render active stethoscope probe wire if probing
    if (this.activeProbeIndex !== null && this.rosettes[this.activeProbeIndex]) {
      this.renderProbeWire(ctx, this.rosettes[this.activeProbeIndex]);
    }
  }

  renderMatrixLines(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 241, 232, 0.04)';
    ctx.lineWidth = 0.8;

    // Connect neighbors horizontally
    for (let r = 0; r < this.rows; r++) {
      ctx.beginPath();
      for (let c = 0; c < this.cols; c++) {
        const ros = this.rosettes[r * this.cols + c];
        if (c === 0) ctx.moveTo(ros.x, ros.y);
        else ctx.lineTo(ros.x, ros.y);
      }
      ctx.stroke();
    }

    // Connect neighbors vertically
    for (let c = 0; c < this.cols; c++) {
      ctx.beginPath();
      for (let r = 0; r < this.rows; r++) {
        const ros = this.rosettes[r * this.cols + c];
        if (r === 0) ctx.moveTo(ros.x, ros.y);
        else ctx.lineTo(ros.x, ros.y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  renderRosette(ctx, ros) {
    ctx.save();
    const isProbed = (this.activeProbeIndex === ros.idx);
    const isRebel = ros.isRebel;

    // Rotation: All rosettes spin identically at first
    ros.rotation += 0.005;

    let r = ros.radius;
    let strokeCol = 'rgba(245, 241, 232, 0.28)';
    let fillCol = 'rgba(16, 14, 22, 0.6)';

    // Rebel living flower dynamics
    if (isRebel && (this.state === 'DISCOVERED' || this.state === 'PRESERVED')) {
      // 72 BPM organic pulse calculation
      const pulsePhase = (this.time * (72 / 60) * Math.PI * 2) % (Math.PI * 2);
      const heartbeat = Math.pow(Math.sin(pulsePhase), 4) * 0.25;
      r *= (1 + heartbeat);

      strokeCol = '#B5A3FF';
      fillCol = 'rgba(181, 163, 255, 0.15)';
      ctx.shadowColor = '#B5A3FF';
      ctx.shadowBlur = 16;
    } else if (ros.inspected && !isRebel) {
      // Inspected dead flower: cold grey-blue
      strokeCol = 'rgba(112, 224, 208, 0.2)';
    }

    // Draw multi-petaled symmetrical rosette
    const petals = 8;
    ctx.beginPath();
    for (let i = 0; i <= petals; i++) {
      const theta = (i / petals) * Math.PI * 2 + ros.rotation;
      const petalR = r * (i % 2 === 0 ? 1.0 : 0.45);
      const px = ros.x + Math.cos(theta) * petalR;
      const py = ros.y + Math.sin(theta) * petalR;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = fillCol;
    ctx.fill();
    ctx.strokeStyle = strokeCol;
    ctx.lineWidth = isProbed ? 2.0 : 1.0;
    ctx.stroke();

    // Center core
    ctx.beginPath();
    ctx.arc(ros.x, ros.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = (isRebel && this.state !== 'INVESTIGATING') ? '#B5A3FF' : 'rgba(245, 241, 232, 0.4)';
    ctx.fill();

    // Specimen ID tag below rosette
    ctx.shadowBlur = 0;
    ctx.font = '400 9px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = ros.inspected ? 'rgba(245, 241, 232, 0.6)' : 'rgba(245, 241, 232, 0.2)';
    ctx.fillText(`#${ros.idStr}`, ros.x, ros.y + ros.radius + 14);

    ctx.restore();
  }

  renderProbeWire(ctx, ros) {
    ctx.save();
    ctx.strokeStyle = '#B5A3FF';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);

    // Draw sensor bracket around probed rosette
    const brR = ros.radius + 8;
    ctx.beginPath();
    ctx.arc(ros.x, ros.y, brR, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(ros.x - brR - 4, ros.y);
    ctx.lineTo(ros.x - brR + 4, ros.y);
    ctx.moveTo(ros.x + brR - 4, ros.y);
    ctx.lineTo(ros.x + brR + 4, ros.y);
    ctx.stroke();
    ctx.restore();
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    window.removeEventListener('resize', this.handleResize);
  }
}
