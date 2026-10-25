/**
 * Exhibit 001: THE WEIGHT OF INVISIBLE THINGS (Gravity)
 * Active Gameplay: 3-Scanner Triangulation System
 * 
 * Objective: Locate the invisible celestial body hidden in the chamber.
 * Mechanics:
 * - 3 Draggable Field Scanners: Scanner α, Scanner β, Scanner γ.
 * - Player drags the scanners across the chamber.
 * - Each scanner computes its local distance and gravitational strain to the hidden mass.
 * - Visual radar arcs radiate from each scanner proportional to its distance.
 * - Triangulation vector lines connect all 3 scanners.
 * - When all 3 scanners triangulate the hidden mass, confidence reaches >= 85%.
 * - Player clicks [PULSE PROBE // COLLAPSE SINGULARITY] to collapse spacetime inward.
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

    // The Invisible Celestial Body (Secret coordinate in room)
    this.singularity = {
      xRatio: 0.62,
      yRatio: 0.44,
      x: 0,
      y: 0,
      radius: 46,
      discovered: false,
      collapsed: false,
      collapseProgress: 0
    };

    // 3 Draggable Field Scanners
    this.scanners = [
      {
        id: 'alpha',
        label: 'SCANNER α',
        xRatio: 0.22,
        yRatio: 0.30,
        x: 0,
        y: 0,
        radius: 26,
        color: '#B5A3FF',
        distance: 999,
        strain: 0,
        isDragging: false
      },
      {
        id: 'beta',
        label: 'SCANNER β',
        xRatio: 0.25,
        yRatio: 0.72,
        x: 0,
        y: 0,
        radius: 26,
        color: '#70E0D0',
        distance: 999,
        strain: 0,
        isDragging: false
      },
      {
        id: 'gamma',
        label: 'SCANNER γ',
        xRatio: 0.78,
        yRatio: 0.70,
        x: 0,
        y: 0,
        radius: 26,
        color: '#E8D44D',
        distance: 999,
        strain: 0,
        isDragging: false
      }
    ];

    this.activeDraggingScanner = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    // Triangulation confidence (0% to 100%)
    this.triangulationConfidence = 0;

    // Floor Spacetime Mesh
    this.gridCols = 28;
    this.gridRows = 16;
    this.gridNodes = [];

    // Floating Cosmic Dust Particles
    this.dust = [];

    // UI Overlay elements
    this.lockUI = containerElement.querySelector('#singularity-lock-ui');
    this.scannerStatus = containerElement.querySelector('#gravity-scanner-status');
    this.strainDisplay = containerElement.querySelector('#gravity-strain-display');
    this.fractureBanner = containerElement.querySelector('#gravity-fracture-banner');

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    if (this.canvas) {
      this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
      window.addEventListener('pointermove', (e) => this.onPointerMove(e));
      window.addEventListener('pointerup', () => this.onPointerUp());
      window.addEventListener('pointercancel', () => this.onPointerUp());
    }

    if (this.lockUI) {
      this.lockUI.addEventListener('click', () => this.triggerSingularityCollapse());
    }

    this.initGrid();
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

    // Position singularity
    this.singularity.x = this.width * this.singularity.xRatio;
    this.singularity.y = this.height * this.singularity.yRatio;

    // Position scanners if not dragged yet
    this.scanners.forEach((scanner) => {
      if (!scanner.hasBeenMoved) {
        scanner.x = this.width * scanner.xRatio;
        scanner.y = this.height * scanner.yRatio;
      }
    });

    this.initGrid();
  }

  initGrid() {
    this.gridNodes = [];
    const cellW = this.width / this.gridCols;
    const cellH = this.height / this.gridRows;

    for (let r = 0; r <= this.gridRows; r++) {
      for (let c = 0; c <= this.gridCols; c++) {
        const ox = c * cellW;
        const oy = r * cellH;
        this.gridNodes.push({
          ox,
          oy,
          x: ox,
          y: oy,
          vx: 0,
          vy: 0
        });
      }
    }
  }

  initDust() {
    this.dust = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      this.dust.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.8 + 0.8,
        opacity: Math.random() * 0.4 + 0.15
      });
    }
  }

  onPointerDown(e) {
    if (this.singularity.collapsed) return;
    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    // Check if clicked inside any scanner grab handle (expanded hit area)
    for (let i = this.scanners.length - 1; i >= 0; i--) {
      const scanner = this.scanners[i];
      const dist = Math.hypot(px - scanner.x, py - scanner.y);
      if (dist <= scanner.radius + 14) {
        this.activeDraggingScanner = scanner;
        scanner.isDragging = true;
        scanner.hasBeenMoved = true;
        this.dragOffsetX = px - scanner.x;
        this.dragOffsetY = py - scanner.y;

        museumAudio.playGlassChime(580, 0.2);
        this.updateHUD();
        return;
      }
    }
  }

  onPointerMove(e) {
    if (!this.activeDraggingScanner || !this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    // Clamp to canvas bounds
    const newX = Math.max(30, Math.min(this.width - 30, px - this.dragOffsetX));
    const newY = Math.max(30, Math.min(this.height - 30, py - this.dragOffsetY));

    this.activeDraggingScanner.x = newX;
    this.activeDraggingScanner.y = newY;

    // Soft audio click during movement
    if (Math.random() < 0.1) {
      museumAudio.playMeshHum(220, 0.05);
    }

    this.updateTriangulation();
  }

  onPointerUp() {
    if (this.activeDraggingScanner) {
      this.activeDraggingScanner.isDragging = false;
      this.activeDraggingScanner = null;
      museumAudio.playGlassChime(440, 0.15);
      this.updateHUD();
    }
  }

  updateTriangulation() {
    const sx = this.singularity.x;
    const sy = this.singularity.y;

    let totalStrain = 0;
    let inRangeCount = 0;

    // Maximum radar range is half width
    const maxRadarDist = Math.max(300, this.width * 0.45);

    this.scanners.forEach((scanner) => {
      const dist = Math.hypot(scanner.x - sx, scanner.y - sy);
      scanner.distance = dist;
      // Strain formula: higher when closer
      const rawStrain = Math.max(0, 1 - dist / maxRadarDist);
      scanner.strain = Math.pow(rawStrain, 1.4);
      totalStrain += scanner.strain;

      if (dist < maxRadarDist) inRangeCount++;
    });

    // Triangulation is confident when:
    // 1. All 3 scanners have a signal
    // 2. Average distance is reasonable (< 320px)
    // 3. The 3 scanners form a triangle enclosing or surrounding the anomaly
    const avgDist = (this.scanners[0].distance + this.scanners[1].distance + this.scanners[2].distance) / 3;
    const isEnclosed = this.checkPointInTriangle(
      sx, sy,
      this.scanners[0].x, this.scanners[0].y,
      this.scanners[1].x, this.scanners[1].y,
      this.scanners[2].x, this.scanners[2].y
    );

    let confidence = 0;
    if (isEnclosed) {
      // If point is inside the triangle formed by the 3 scanners:
      const proximityFactor = Math.max(0, 1 - (avgDist - 60) / 280);
      confidence = Math.min(1.0, 0.65 + proximityFactor * 0.35);
    } else {
      // If outside triangle, confidence scales with how close all 3 are
      const proximityFactor = Math.max(0, 1 - avgDist / 350);
      confidence = Math.min(0.80, proximityFactor * 0.80);
    }

    this.triangulationConfidence = confidence;

    // Check if target is locked
    if (this.triangulationConfidence >= 0.85 && !this.singularity.discovered) {
      this.singularity.discovered = true;
      museumAudio.playGlassChime(880, 0.8);
    } else if (this.triangulationConfidence < 0.85 && this.singularity.discovered) {
      this.singularity.discovered = false;
    }

    this.updateHUD();
  }

  checkPointInTriangle(px, py, x1, y1, x2, y2, x3, y3) {
    const d1 = (px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
    const d2 = (px - x3) * (y2 - y3) - (x2 - x3) * (py - y3);
    const d3 = (px - x1) * (y3 - y1) - (x3 - x1) * (py - y1);
    const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
    return !(hasNeg && hasPos);
  }

  updateHUD() {
    if (this.scannerStatus) {
      const activeName = this.activeDraggingScanner ? this.activeDraggingScanner.label : 'ALL IDLE';
      this.scannerStatus.textContent = `SCANNERS: α [${Math.round(this.scanners[0].distance)}m] · β [${Math.round(this.scanners[1].distance)}m] · γ [${Math.round(this.scanners[2].distance)}m] · ACTIVE: ${activeName}`;
    }

    if (this.strainDisplay) {
      const pct = Math.round(this.triangulationConfidence * 100);
      const isLocked = this.triangulationConfidence >= 0.85;
      this.strainDisplay.textContent = `TRIANGULATION LOCK: ${pct}% · ${isLocked ? 'TARGET ACQUIRED' : 'ALIGN SCANNERS'}`;
      this.strainDisplay.style.color = isLocked ? 'var(--color-lavender)' : 'var(--color-text-muted)';
    }

    if (this.lockUI) {
      if (this.singularity.discovered && !this.singularity.collapsed) {
        this.lockUI.style.display = 'flex';
        this.lockUI.style.left = `${this.singularity.x}px`;
        this.lockUI.style.top = `${this.singularity.y}px`;
      } else {
        this.lockUI.style.display = 'none';
      }
    }
  }

  triggerSingularityCollapse() {
    if (this.singularity.collapsed) return;
    this.singularity.collapsed = true;

    // Dramatic Collapse Audio
    museumAudio.playSingularityCollapse();

    if (this.lockUI) this.lockUI.style.display = 'none';

    // Show resolution banner after collapse animation
    setTimeout(() => {
      if (this.fractureBanner) {
        this.fractureBanner.classList.add('banner-visible');
        museumAudio.playTheoryFailure();
      }
      if (typeof this.onComplete === 'function') {
        this.onComplete();
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

    const sx = this.singularity.x;
    const sy = this.singularity.y;

    // 1. Spacetime Grid Warping
    this.renderGrid(ctx, sx, sy);

    // 2. Cosmic Dust Particles
    this.renderDust(ctx, sx, sy);

    // 3. Triangulation Vectors & Radar Waves between Scanners
    this.renderTriangulationNetwork(ctx, sx, sy);

    // 4. Render 3 Draggable Scanners
    this.renderScanners(ctx);

    // 5. Singularity Collapse Effect (When Discovered & Triggered)
    if (this.singularity.collapsed) {
      this.renderCollapse(ctx, sx, sy);
    }
  }

  renderGrid(ctx, sx, sy) {
    ctx.save();
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = 'rgba(245, 241, 232, 0.07)';

    const cellW = this.width / this.gridCols;
    const cellH = this.height / this.gridRows;

    // Compute node displacement towards singularity and scanners
    for (let i = 0; i < this.gridNodes.length; i++) {
      const node = this.gridNodes[i];
      let dx = 0;
      let dy = 0;

      // Displacement from invisible mass
      const distToMass = Math.hypot(node.ox - sx, node.oy - sy);
      if (distToMass > 1) {
        const pull = Math.min(24, 800 / (distToMass + 20));
        dx += (sx - node.ox) / distToMass * pull;
        dy += (sy - node.oy) / distToMass * pull;
      }

      // Minor displacement from each scanner
      this.scanners.forEach(sc => {
        const distToSc = Math.hypot(node.ox - sc.x, node.oy - sc.y);
        if (distToSc > 1 && distToSc < 120) {
          const push = (120 - distToSc) * 0.08;
          dx += (sc.x - node.ox) / distToSc * push;
          dy += (sc.y - node.oy) / distToSc * push;
        }
      });

      node.x = node.ox + dx;
      node.y = node.oy + dy;
    }

    // Draw horizontal grid lines
    for (let r = 0; r <= this.gridRows; r++) {
      ctx.beginPath();
      for (let c = 0; c <= this.gridCols; c++) {
        const node = this.gridNodes[r * (this.gridCols + 1) + c];
        if (c === 0) ctx.moveTo(node.x, node.y);
        else ctx.lineTo(node.x, node.y);
      }
      ctx.stroke();
    }

    // Draw vertical grid lines
    for (let c = 0; c <= this.gridCols; c++) {
      ctx.beginPath();
      for (let r = 0; r <= this.gridRows; r++) {
        const node = this.gridNodes[r * (this.gridCols + 1) + c];
        if (r === 0) ctx.moveTo(node.x, node.y);
        else ctx.lineTo(node.x, node.y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  renderDust(ctx, sx, sy) {
    ctx.save();
    this.dust.forEach(p => {
      // Drift
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around bounds
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Gravitational acceleration toward mass
      const dist = Math.hypot(p.x - sx, p.y - sy);
      if (dist > 10 && dist < 260) {
        p.vx += (sx - p.x) / dist * 0.04;
        p.vy += (sy - p.y) / dist * 0.04;
      }
      p.vx *= 0.98;
      p.vy *= 0.98;

      ctx.fillStyle = `rgba(181, 163, 255, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  renderTriangulationNetwork(ctx, sx, sy) {
    ctx.save();

    // 1. Draw dashed triangulation polygon connecting the 3 scanners
    ctx.setLineDash([4, 6]);
    ctx.lineWidth = 1.2;
    const isLocked = this.triangulationConfidence >= 0.85;
    ctx.strokeStyle = isLocked ? 'rgba(181, 163, 255, 0.65)' : 'rgba(245, 241, 232, 0.2)';

    ctx.beginPath();
    ctx.moveTo(this.scanners[0].x, this.scanners[0].y);
    ctx.lineTo(this.scanners[1].x, this.scanners[1].y);
    ctx.lineTo(this.scanners[2].x, this.scanners[2].y);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Radar range arcs from each scanner
    this.scanners.forEach((scanner) => {
      const r = scanner.distance;
      if (r > 10 && r < 600) {
        ctx.beginPath();
        ctx.arc(scanner.x, scanner.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `${scanner.color}33`;
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // Pulsing radar wave
        const pulseR = (r + (this.time * 60) % 80) % (r + 40);
        ctx.beginPath();
        ctx.arc(scanner.x, scanner.y, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `${scanner.color}15`;
        ctx.stroke();
      }
    });

    // 3. If locked, draw the triangulated coordinate convergence point
    if (this.triangulationConfidence >= 0.85) {
      ctx.strokeStyle = '#B5A3FF';
      ctx.lineWidth = 1.5;

      // Lines from all 3 scanners converging on the anomaly
      this.scanners.forEach(sc => {
        ctx.beginPath();
        ctx.moveTo(sc.x, sc.y);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = 'rgba(181, 163, 255, 0.35)';
        ctx.stroke();
      });

      // Target reticle at anomaly
      const reticleR = 28 + Math.sin(this.time * 6) * 4;
      ctx.beginPath();
      ctx.arc(sx, sy, reticleR, 0, Math.PI * 2);
      ctx.strokeStyle = '#B5A3FF';
      ctx.stroke();

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(sx - 38, sy);
      ctx.lineTo(sx + 38, sy);
      ctx.moveTo(sx, sy - 38);
      ctx.lineTo(sx, sy + 38);
      ctx.stroke();
    }
    ctx.restore();
  }

  renderScanners(ctx) {
    this.scanners.forEach((scanner) => {
      ctx.save();
      const isDrag = scanner.isDragging;

      // Outer Glow
      if (isDrag) {
        ctx.shadowColor = scanner.color;
        ctx.shadowBlur = 18;
      }

      // Outer ring
      ctx.beginPath();
      ctx.arc(scanner.x, scanner.y, scanner.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(14, 13, 22, 0.88)';
      ctx.fill();
      ctx.lineWidth = isDrag ? 2.2 : 1.5;
      ctx.strokeStyle = scanner.color;
      ctx.stroke();

      // Inner pulse dot
      ctx.beginPath();
      ctx.arc(scanner.x, scanner.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = scanner.color;
      ctx.fill();

      // Mechanical Pod Label and Distance readout
      ctx.shadowBlur = 0;
      ctx.font = '500 10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = scanner.color;
      ctx.fillText(scanner.label, scanner.x, scanner.y - scanner.radius - 8);

      ctx.font = '400 9px "IBM Plex Mono", monospace';
      ctx.fillStyle = 'rgba(245, 241, 232, 0.7)';
      ctx.fillText(`d: ${Math.round(scanner.distance)}m`, scanner.x, scanner.y + scanner.radius + 14);

      // Drag affordance hint
      if (!scanner.hasBeenMoved) {
        ctx.fillStyle = 'rgba(245, 241, 232, 0.4)';
        ctx.fillText('[DRAG]', scanner.x, scanner.y + scanner.radius + 26);
      }

      ctx.restore();
    });
  }

  renderCollapse(ctx, sx, sy) {
    this.singularity.collapseProgress += 0.015;
    const p = Math.min(1.0, this.singularity.collapseProgress);

    ctx.save();
    // Expanding shockwave ring
    const shockR = p * Math.max(this.width, this.height);
    ctx.beginPath();
    ctx.arc(sx, sy, shockR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(181, 163, 255, ${Math.max(0, 0.8 - p * 0.8)})`;
    ctx.lineWidth = 4 * (1 - p);
    ctx.stroke();

    // Central collapsed celestial body core
    const coreR = Math.max(2, 60 * (1 - p));
    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, coreR * 2);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.4, '#B5A3FF');
    grad.addColorStop(1, 'rgba(181, 163, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(sx, sy, coreR * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
  }
}
