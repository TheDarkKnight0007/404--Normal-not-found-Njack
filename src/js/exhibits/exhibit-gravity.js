/**
 * Exhibit 001: THE WEIGHT OF INVISIBLE THINGS (Gravity)
 * Theme: Invisible burdens, pressure, expectations, mental weight.
 * "Some weights cannot be measured."
 */

import { museumAudio } from '../audio.js';

export class ExhibitGravity {
  constructor(containerElement, onComplete) {
    this.container = containerElement;
    this.onComplete = onComplete;
    this.canvas = containerElement.querySelector('#gravity-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = 0;
    this.height = 0;
    this.animId = null;
    this.time = 0;

    // Cube state in 3D-projected space
    this.cube = {
      x: 0,
      y: 0,
      baseY: 0,
      targetY: 0,
      size: 78,
      mass: 1.0,
      calculatedWeight: 14.2, // kg
      isDragging: false,
      dragStartY: 0,
      fractured: false,
      fractureProgress: 0
    };

    // Floor Grid (Relativistic stress fabric)
    this.gridCols = 32;
    this.gridRows = 24;

    // Invisible Gravitational Masses hidden in the room
    this.invisibleMasses = [
      { xRatio: 0.28, yRatio: 0.38, strength: 34, label: 'EXPECTATION // UNSEEN' },
      { xRatio: 0.72, yRatio: 0.42, strength: 42, label: 'MEMORY // UNDISCLOSED' },
      { xRatio: 0.48, yRatio: 0.72, strength: 50, label: 'RESPONSIBILITY // SILENT' }
    ];

    // Heavy Cursor Reticle (Physical drag & viscosity)
    this.mouse = { x: -9999, y: -9999, realX: -9999, realY: -9999, isDown: false, viscosity: 0.18 };

    // Floating Dust Particles in the Gravity Chamber
    this.dust = [];

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    if (this.canvas) {
      this.canvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
      this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
      window.addEventListener('pointerup', () => this.onPointerUp());
    }

    // Interactive Lift Action Button
    const btnLift = this.container.querySelector('#btn-gravity-lift');
    if (btnLift) {
      btnLift.addEventListener('mousedown', () => this.startManualLift());
      btnLift.addEventListener('touchstart', () => this.startManualLift(), { passive: true });
    }

    const btnSurrender = this.container.querySelector('#btn-gravity-surrender');
    if (btnSurrender) {
      btnSurrender.addEventListener('click', () => this.triggerSingularityCollapse());
    }

    this.initDust();
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

    this.cube.x = this.width / 2;
    this.cube.baseY = this.height * 0.42;
    if (!this.cube.y) this.cube.y = this.cube.baseY;
  }

  initDust() {
    this.dust = [];
    for (let i = 0; i < 90; i++) {
      this.dust.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 1 + Math.random() * 1.5,
        alpha: 0.2 + Math.random() * 0.5
      });
    }
  }

  onPointerMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.realX = e.clientX - rect.left;
    this.mouse.realY = e.clientY - rect.top;

    // Check proximity to Cube and Invisible Masses for Viscous Drag
    const distToCube = Math.hypot(this.mouse.realX - this.cube.x, this.mouse.realY - this.cube.y);
    const cubeProximity = Math.max(0, 1.0 - distToCube / 320);

    // Dynamic Viscous drag: cursor moves slower when near heavy invisible mass
    this.mouse.viscosity = 0.20 * (1.0 - cubeProximity * 0.75); // Heaviness!
  }

  onPointerDown(e) {
    this.mouse.isDown = true;
    const dist = Math.hypot(this.mouse.realX - this.cube.x, this.mouse.realY - this.cube.y);
    if (dist < this.cube.size * 1.2 && !this.cube.fractured) {
      this.cube.isDragging = true;
      this.cube.dragStartY = this.mouse.realY;
      museumAudio.playGlassChime(440, 0.8);
    }
  }

  onPointerUp() {
    this.mouse.isDown = false;
    this.cube.isDragging = false;
  }

  startManualLift() {
    if (this.cube.fractured) return;
    this.cube.calculatedWeight *= 2.5;
    this.cube.targetY += 12; // Bends downward even when user tries to lift!
    museumAudio.playGravityStrain(Math.min(1.0, this.cube.calculatedWeight / 1000));
    this.updateHUD();

    if (this.cube.calculatedWeight > 5000) {
      this.triggerSingularityCollapse();
    }
  }

  triggerSingularityCollapse() {
    if (this.cube.fractured) return;
    this.cube.fractured = true;
    museumAudio.playSingularitySuck();

    const banner = this.container.querySelector('#gravity-fracture-banner');
    if (banner) banner.classList.add('active');

    setTimeout(() => {
      museumAudio.playEnterResonance();
      if (this.onComplete) this.onComplete();
    }, 2800);
  }

  updateHUD() {
    const weightEl = this.container.querySelector('#gravity-weight-val');
    const strainEl = this.container.querySelector('#gravity-strain-bar');
    if (weightEl) {
      if (this.cube.calculatedWeight >= 100000 || this.cube.fractured) {
        weightEl.textContent = 'WEIGHT: ∞ kg [NON-MEASURABLE]';
      } else {
        weightEl.textContent = `WEIGHT: ${Math.floor(this.cube.calculatedWeight).toLocaleString()} kg`;
      }
    }
    if (strainEl) {
      const pct = Math.min(100, Math.log10(this.cube.calculatedWeight + 1) * 22);
      strainEl.style.width = `${pct}%`;
    }
  }

  update(dt) {
    this.time += dt;

    // Smooth cursor inertia (Viscous heaviness)
    this.mouse.x += (this.mouse.realX - this.mouse.x) * this.mouse.viscosity;
    this.mouse.y += (this.mouse.realY - this.mouse.y) * this.mouse.viscosity;

    // Cube reacts to cursor approach: Sinking under invisible burden
    const distToCursor = Math.hypot(this.mouse.x - this.cube.x, this.mouse.y - this.cube.y);
    const approachStrength = Math.max(0, 1.0 - distToCursor / 340);

    if (!this.cube.fractured) {
      // Cube sags downward as cursor approaches
      const targetSink = this.cube.baseY + Math.pow(approachStrength, 1.8) * 90;
      this.cube.y += (targetSink - this.cube.y) * 0.08;

      // Weight increases as user approaches
      if (approachStrength > 0.1) {
        this.cube.calculatedWeight += approachStrength * 14;
        this.updateHUD();
        if (Math.random() < 0.04) {
          museumAudio.playGravityStrain(Math.min(1.0, this.cube.calculatedWeight / 800));
        }
      }
    } else {
      // Fractured: Cube drops into the floor void
      this.cube.fractureProgress = Math.min(1.0, this.cube.fractureProgress + dt * 0.8);
      this.cube.y += dt * 140;
    }

    // Dust particles drift toward invisible masses
    for (const p of this.dust) {
      p.x += p.vx;
      p.y += p.vy;

      // Pull toward cube
      const dx = this.cube.x - p.x;
      const dy = this.cube.y - p.y;
      const d = Math.hypot(dx, dy) + 1;
      if (d < 300) {
        p.vx += (dx / d) * 0.04;
        p.vy += (dy / d) * 0.04;
      }

      // Bounds
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;
    }
  }

  draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);

    const cx = this.width / 2;
    const floorY = this.height * 0.62;

    // 1. Draw Invisible Gravitational Wells (Faint metric distortion rings)
    this.invisibleMasses.forEach((im) => {
      const imX = this.width * im.xRatio;
      const imY = this.height * im.yRatio;
      const dist = Math.hypot(this.mouse.x - imX, this.mouse.y - imY);
      const isRevealed = dist < 160;

      if (isRevealed) {
        const alpha = (160 - dist) / 160;
        ctx.strokeStyle = `rgba(181, 163, 255, ${alpha * 0.35})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.arc(imX, imY, 40 + Math.sin(this.time * 3) * 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = '9px "IBM Plex Mono", monospace';
        ctx.fillStyle = `rgba(181, 163, 255, ${alpha * 0.7})`;
        ctx.textAlign = 'center';
        ctx.fillText(im.label, imX, imY - 50);
      }
    });

    // 2. Draw Deforming Perspective Floor Grid
    ctx.save();
    const rows = 18;
    const cols = 26;
    const horizonY = this.height * 0.44;

    for (let r = 0; r < rows; r++) {
      const rowT = r / (rows - 1);
      const y = horizonY + Math.pow(rowT, 1.8) * (this.height - horizonY);

      ctx.beginPath();
      let started = false;

      for (let c = 0; c < cols; c++) {
        const colT = (c / (cols - 1) - 0.5) * 2;
        const spread = (rowT * 1.5 + 0.2);
        let x = cx + colT * (this.width * 0.65) * spread;

        // Bending downward under Cube's gravitational well
        const distFromCube = Math.hypot(x - this.cube.x, y - (this.cube.y + 40));
        const depressionRadius = 240;
        let dip = 0;
        if (distFromCube < depressionRadius) {
          const ratio = (depressionRadius - distFromCube) / depressionRadius;
          dip = Math.pow(ratio, 2) * (50 + Math.min(80, this.cube.calculatedWeight * 0.05));
        }

        if (!started) {
          ctx.moveTo(x, y + dip);
          started = true;
        } else {
          ctx.lineTo(x, y + dip);
        }
      }

      ctx.strokeStyle = `rgba(149, 136, 255, ${0.06 + rowT * 0.18})`;
      ctx.lineWidth = 1.0;
      ctx.stroke();
    }

    // Floor Cracks if fractured
    if (this.cube.fractureProgress > 0) {
      ctx.strokeStyle = `rgba(245, 241, 232, ${this.cube.fractureProgress * 0.8})`;
      ctx.lineWidth = 1.8;
      const fp = this.cube.fractureProgress;
      ctx.beginPath();
      ctx.moveTo(cx, floorY);
      ctx.lineTo(cx - 90 * fp, floorY + 45 * fp);
      ctx.lineTo(cx - 160 * fp, floorY + 110 * fp);
      ctx.moveTo(cx, floorY);
      ctx.lineTo(cx + 110 * fp, floorY + 60 * fp);
      ctx.lineTo(cx + 200 * fp, floorY + 130 * fp);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Draw Chamber Dust Flecks
    ctx.save();
    for (const p of this.dust) {
      ctx.fillStyle = `rgba(245, 241, 232, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 4. Draw Floating Monolithic Cube (Isometric/Perspective Wireframe with Solid Core)
    this.drawIsometricCube(ctx, this.cube.x, this.cube.y, this.cube.size);

    // 5. Draw Heavy Cursor Reticle (Visual indication of viscous drag)
    if (this.mouse.x > 0 && this.mouse.y > 0) {
      ctx.save();
      ctx.strokeStyle = 'rgba(181, 163, 255, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.mouse.x, this.mouse.y, 14, 0, Math.PI * 2);
      ctx.stroke();

      // Connecting tether showing cursor drag / lag
      ctx.strokeStyle = 'rgba(149, 136, 255, 0.25)';
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(this.mouse.realX, this.mouse.realY);
      ctx.lineTo(this.mouse.x, this.mouse.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawIsometricCube(ctx, cx, cy, s) {
    ctx.save();
    const h = s * 0.58;
    const w = s * 0.86;

    // Top face
    ctx.beginPath();
    ctx.moveTo(cx, cy - h);
    ctx.lineTo(cx + w, cy - h * 0.5);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx - w, cy - h * 0.5);
    ctx.closePath();
    ctx.fillStyle = '#151936';
    ctx.fill();
    ctx.strokeStyle = '#B5A3FF';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Left face
    ctx.beginPath();
    ctx.moveTo(cx - w, cy - h * 0.5);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + h);
    ctx.lineTo(cx - w, cy + h * 0.5);
    ctx.closePath();
    ctx.fillStyle = '#0d1020';
    ctx.fill();
    ctx.strokeStyle = 'rgba(181, 163, 255, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Right face
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + w, cy - h * 0.5);
    ctx.lineTo(cx + w, cy + h * 0.5);
    ctx.lineTo(cx, cy + h);
    ctx.closePath();
    ctx.fillStyle = '#080b17';
    ctx.fill();
    ctx.strokeStyle = 'rgba(149, 136, 255, 0.5)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Inner glowing core
    ctx.fillStyle = 'rgba(181, 163, 255, 0.25)';
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.22, 0, Math.PI * 2);
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
