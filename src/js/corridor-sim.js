/**
 * The Museum of Incorrect Physics
 * Corridor of Invariants: Impossible Architectural Perspective Engine
 * 
 * Non-Euclidean Properties:
 * - Two discordant vanishing points that slowly drift out of phase
 * - Survey lines that bend with negative curvature
 * - Drifting architectural accession coordinates and broken vernier calipers
 * - Subtle 80/20 inverted upward drift
 */

export class CorridorPerspectiveSim {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = 0;
    this.height = 0;
    this.animId = null;
    this.time = 0;

    // Survey coordinate lines
    this.surveyLines = [
      { yRatio: 0.18, speed: 0.2, label: 'INVARIANT // CONSERVATION OF MOMENTUM: SUSPENDED', offset: 0 },
      { yRatio: 0.82, speed: -0.15, label: 'SURVEY // ZENO GEODESIC HORIZON Δλ = -0.042', offset: 120 },
      { yRatio: 0.50, speed: 0.28, label: 'DATUM // ZERO-G EQUILIBRIUM: NULLIFIED', offset: 240 }
    ];

    // Drifting measurements
    this.markers = [
      { x: 0.15, y: 0.25, text: 'REF: 001-GRV [g < 0]' },
      { x: 0.85, y: 0.28, text: 'REF: 002-TMP [t → ∞]' },
      { x: 0.12, y: 0.72, text: 'REF: 003-OPT [n = -1.33]' },
      { x: 0.88, y: 0.74, text: 'REF: 004-SYM [d ≠ 0]' }
    ];

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

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
  }

  update(dt) {
    this.time += dt;
    this.surveyLines.forEach(sl => {
      sl.offset += sl.speed * dt * 40;
    });
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const cx = this.width / 2;
    const cy = this.height / 2;

    // 1. Two Discordant Vanishing Points (Impossibly breaking perspective)
    const vp1X = cx + Math.sin(this.time * 0.4) * 45;
    const vp1Y = cy - 40 + Math.cos(this.time * 0.3) * 15;

    const vp2X = cx - Math.cos(this.time * 0.35) * 50;
    const vp2Y = cy + 50 + Math.sin(this.time * 0.45) * 20;

    ctx.save();

    // Subtle Perspective Rays from VP1
    ctx.strokeStyle = 'rgba(181, 163, 255, 0.08)';
    ctx.lineWidth = 1;
    const rayCount = 16;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const r = Math.max(this.width, this.height) * 1.2;
      ctx.beginPath();
      ctx.moveTo(vp1X, vp1Y);
      // Slight non-Euclidean curve
      const midX = (vp1X + Math.cos(angle) * r * 0.5) + Math.sin(this.time + i) * 18;
      const midY = (vp1Y + Math.sin(angle) * r * 0.5) + Math.cos(this.time + i) * 18;
      const endX = vp1X + Math.cos(angle) * r;
      const endY = vp1Y + Math.sin(angle) * r;
      ctx.quadraticCurveTo(midX, midY, endX, endY);
      ctx.stroke();
    }

    // Discordant Rays from VP2
    ctx.strokeStyle = 'rgba(245, 241, 232, 0.04)';
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + 0.25;
      const r = Math.max(this.width, this.height);
      ctx.beginPath();
      ctx.moveTo(vp2X, vp2Y);
      ctx.lineTo(vp2X + Math.cos(angle) * r, vp2Y + Math.sin(angle) * r);
      ctx.stroke();
    }

    // 2. Rows of Impossible Architectural Columns (Control / Myst atmospheric hall)
    const colPairs = 7;
    for (let c = colPairs; c >= 1; c--) {
      const zProgress = (c / colPairs);
      const colXOffset = Math.pow(zProgress, 1.4) * (this.width * 0.42);
      const colHeight = Math.pow(zProgress, 1.3) * (this.height * 0.75);
      const colWidth = Math.max(16, 44 * zProgress);
      const alpha = 0.08 + zProgress * 0.22;

      // Left Column
      const leftColX = cx - colXOffset;
      const topY = cy - colHeight / 2;
      const btmY = cy + colHeight / 2;

      ctx.strokeStyle = `rgba(181, 163, 255, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(leftColX - colWidth / 2, topY, colWidth, colHeight);

      // Fluting lines
      ctx.strokeStyle = `rgba(245, 241, 232, ${alpha * 0.35})`;
      ctx.beginPath();
      ctx.moveTo(leftColX, topY);
      ctx.lineTo(leftColX, btmY);
      ctx.stroke();

      // Right Column (Intentionally misaligned by 8px to break Euclidean symmetry!)
      const rightColX = cx + colXOffset;
      const rightTopY = topY - 8 * (1 - zProgress); // Incorrect perspective elevation!
      ctx.strokeStyle = `rgba(181, 163, 255, ${alpha})`;
      ctx.strokeRect(rightColX - colWidth / 2, rightTopY, colWidth, colHeight);

      ctx.strokeStyle = `rgba(245, 241, 232, ${alpha * 0.35})`;
      ctx.beginPath();
      ctx.moveTo(rightColX, rightTopY);
      ctx.lineTo(rightColX, btmY);
      ctx.stroke();

      // Capital / Arch beam connecting columns
      ctx.strokeStyle = `rgba(181, 163, 255, ${alpha * 0.6})`;
      ctx.beginPath();
      ctx.moveTo(leftColX + colWidth / 2, topY);
      ctx.lineTo(rightColX - colWidth / 2, rightTopY);
      ctx.stroke();
    }

    // 3. Distant Misaligned Vault Portals
    const portalW = 120;
    const portalH = 200;
    ctx.strokeStyle = 'rgba(181, 163, 255, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(cx - portalW / 2, cy - portalH / 2, portalW, portalH);

    // Carved Museum Impossible Orbit Logo inside the Portal Arch
    ctx.save();
    ctx.translate(cx, cy - portalH * 0.25);
    ctx.strokeStyle = 'rgba(181, 163, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 1.65);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    // Secondary Distant Doorway (Rotated 4 degrees impossibly)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(0.06);
    ctx.strokeStyle = 'rgba(149, 136, 255, 0.25)';
    ctx.strokeRect(-portalW * 0.35, -portalH * 0.35, portalW * 0.7, portalH * 0.7);
    ctx.restore();

    // Survey Horizontal Lines with Coordinate Labels
    ctx.font = '7.5px "IBM Plex Mono", monospace';
    ctx.fillStyle = 'rgba(245, 241, 232, 0.25)';
    ctx.letterSpacing = '0.24em';

    this.surveyLines.forEach((sl) => {
      const y = this.height * sl.yRatio;
      ctx.strokeStyle = 'rgba(245, 241, 232, 0.05)';
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();

      // Drifting text along line
      const textX = ((sl.offset % (this.width + 400)) - 200);
      ctx.fillText(sl.label, textX, y - 4);
    });

    // Accession Markers positioned in room margins
    ctx.fillStyle = 'rgba(181, 163, 255, 0.35)';
    this.markers.forEach((m) => {
      const px = this.width * m.x;
      const py = this.height * m.y;
      ctx.fillText(m.text, px, py);

      // Micro crosshair
      ctx.strokeStyle = 'rgba(181, 163, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(px - 6, py);
      ctx.lineTo(px + 6, py);
      ctx.moveTo(px, py - 6);
      ctx.lineTo(px, py + 6);
      ctx.stroke();
    });

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
