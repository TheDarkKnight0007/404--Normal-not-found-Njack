/**
 * The Museum of Incorrect Physics
 * The Non-Euclidean Anomaly Artifact Simulator
 * 
 * Disturbing Artifact Properties:
 * - Not always spherical: Surface subtly morphs and ripples non-linearly over time
 * - Independent reflection rotation: Internal caustic lattice spins on a separate axis
 * - Impossible shadow: Projects inversely toward the light source, refusing to shrink on elevation
 * - Gravitational lensing: Emits field ripples that warp local space
 */

export class ImpossibleSphereSim {
  constructor(canvasElement, specStatusElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.specStatus = specStatusElement;

    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.homeX = 0;
    this.homeY = 0;

    // Physical position
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.baseRadius = 52;

    // Disturbing morph phase
    this.morphPhase = 0;
    this.reflectionPhase = 0;

    // Interaction state
    this.isFloating = false;
    this.isFrozen = false;
    this.freezeTimer = 0;
    this.floatTimer = 0;

    this.pointerX = -9999;
    this.pointerY = -9999;
    this.isPointerInside = false;

    this.springStrength = 0.042;
    this.damping = 0.88;
    this.repelRadius = 180;
    this.repelForce = 1.45;

    this.animId = null;
    this.lastTime = performance.now();

    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handleResize = this.handleResize.bind(this);

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);

    this.canvas.addEventListener('pointermove', this.handlePointerMove, { passive: true });
    this.canvas.addEventListener('pointerleave', this.handlePointerLeave, { passive: true });
    this.canvas.addEventListener('pointerdown', this.handlePointerDown, { passive: false });

    this.canvas.setAttribute('tabindex', '0');
    this.canvas.setAttribute('role', 'button');
    this.canvas.setAttribute('aria-label', 'The Impossible Anomaly artifact. Tap or press Space to observe gravity malfunction.');
    this.canvas.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this.triggerAntiGravityTest();
      }
    });

    this.loop = this.loop.bind(this);
    this.animId = requestAnimationFrame(this.loop);
  }

  handleResize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 460;
    this.height = rect.height || 460;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.homeX = this.width / 2;
    this.homeY = this.height / 2 + 8;
    this.baseRadius = Math.max(42, Math.min(58, this.width * 0.125));

    if (!this.x && !this.y) {
      this.x = this.homeX;
      this.y = this.homeY;
    }
  }

  handlePointerMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointerX = e.clientX - rect.left;
    this.pointerY = e.clientY - rect.top;
    this.isPointerInside = true;
  }

  handlePointerLeave() {
    this.pointerX = -9999;
    this.pointerY = -9999;
    this.isPointerInside = false;
  }

  handlePointerDown(e) {
    e.preventDefault();
    this.triggerAntiGravityTest();
  }

  triggerAntiGravityTest() {
    this.isFrozen = true;
    this.freezeTimer = 240;
    this.vx = 0;
    this.vy = 0;

    if (this.specStatus) {
      this.specStatus.innerHTML = `
        <span class="anomaly-pip" style="background: #B5A3FF; border-color: #B5A3FF;"></span>
        GRAVITY STATUS: <span class="highlight-lavender">ANOMALY CONFIRMED (g = -1.28 m/s²)</span>
      `;
    }

    if (window.museumAudio) {
      window.museumAudio.playGlassChime(1318.51, 2.2);
      setTimeout(() => {
        if (window.museumAudio) window.museumAudio.playSphereAscent();
      }, 240);
    }

    if (window.worldGridBg) {
      window.worldGridBg.triggerShockwave(this.x, this.y);
    }

    setTimeout(() => {
      this.isFrozen = false;
      this.isFloating = true;
      this.floatTimer = 2900;
    }, 240);
  }

  update(dt) {
    // Morphing surface phase & independent internal reflection rotation
    this.morphPhase += 0.024;
    this.reflectionPhase -= 0.018; // spins opposite to exterior!

    if (this.isFrozen) {
      this.x += (Math.random() - 0.5) * 0.7;
      this.y += (Math.random() - 0.5) * 0.7;
      return;
    }

    if (this.isFloating) {
      this.floatTimer -= dt * 1000;
      const targetCeilingY = this.homeY - this.baseRadius * 2.3;
      this.vy += (targetCeilingY - this.y) * 0.055;
      this.vy *= 0.86;
      this.vx += Math.sin(performance.now() * 0.003) * 0.18;
      this.vx *= 0.88;

      if (this.floatTimer <= 0) {
        this.isFloating = false;
        if (this.specStatus) {
          this.specStatus.innerHTML = `
            <span class="anomaly-pip"></span>
            GRAVITY STATUS: <span class="highlight-purple">UNVERIFIED (RESIDUAL DRIFT)</span>
          `;
        }
      }
    } else {
      if (this.isPointerInside) {
        const dx = this.x - this.pointerX;
        const dy = this.y - this.pointerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.repelRadius && dist > 1) {
          const force = ((this.repelRadius - dist) / this.repelRadius) * this.repelForce;
          const nx = dx / dist;
          const ny = dy / dist;

          this.vx += nx * force * 1.85;
          this.vy += ny * force * 1.85;
        }
      }

      const springX = (this.homeX - this.x) * this.springStrength;
      const springY = (this.homeY - this.y) * this.springStrength;
      this.vx += springX;
      this.vy += springY;

      this.vx *= this.damping;
      this.vy *= this.damping;
    }

    this.x += this.vx;
    this.y += this.vy;

    const margin = this.baseRadius + 18;
    this.x = Math.max(margin, Math.min(this.width - margin, this.x));
    this.y = Math.max(margin, Math.min(this.height - margin, this.y));
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const groundY = this.homeY + this.baseRadius + 24;

    // 1. Vernier ground plane
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 241, 232, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, groundY);
    ctx.lineTo(this.width - 20, groundY);
    ctx.stroke();

    for (let tx = 25; tx <= this.width - 25; tx += 15) {
      const isMajor = (tx - 25) % 45 === 0;
      ctx.strokeStyle = isMajor ? 'rgba(181, 163, 255, 0.35)' : 'rgba(245, 241, 232, 0.05)';
      ctx.beginPath();
      ctx.moveTo(tx, groundY - (isMajor ? 6 : 3));
      ctx.lineTo(tx, groundY + (isMajor ? 6 : 3));
      ctx.stroke();
    }
    ctx.restore();

    // 2. The Severed / Impossible Shadow
    ctx.save();
    const deltaX = this.x - this.homeX;
    const shadowBaseX = this.homeX + (deltaX * 0.35) - 52;
    const shadowBaseY = groundY + 2;

    const heightFactor = Math.max(0.65, 1 + (this.homeY - this.y) / 90);
    const shadowRadiusX = this.baseRadius * (1.25 * heightFactor);
    const shadowRadiusY = this.baseRadius * 0.28;

    const shadowGrad = ctx.createRadialGradient(
      shadowBaseX, shadowBaseY, 0,
      shadowBaseX, shadowBaseY, shadowRadiusX
    );
    shadowGrad.addColorStop(0, 'rgba(4, 5, 12, 0.96)');
    shadowGrad.addColorStop(0.45, 'rgba(15, 18, 34, 0.7)');
    shadowGrad.addColorStop(0.85, 'rgba(181, 163, 255, 0.16)');
    shadowGrad.addColorStop(1, 'rgba(17, 19, 34, 0)');

    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(shadowBaseX, shadowBaseY, shadowRadiusX, shadowRadiusY, -0.28, 0, Math.PI * 2);
    ctx.fill();

    // Severance connection
    ctx.strokeStyle = 'rgba(181, 163, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 6]);
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(shadowBaseX, shadowBaseY);
    ctx.stroke();
    ctx.restore();

    // 3. Morphing, Non-Spherical Anomaly Body
    ctx.save();
    // Volumetric aura
    const auraGrad = ctx.createRadialGradient(
      this.x, this.y, this.baseRadius * 0.8,
      this.x, this.y, this.baseRadius * 1.9
    );
    auraGrad.addColorStop(0, 'rgba(181, 163, 255, 0.35)');
    auraGrad.addColorStop(0.5, 'rgba(149, 136, 255, 0.18)');
    auraGrad.addColorStop(1, 'rgba(17, 19, 34, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.baseRadius * 1.9, 0, Math.PI * 2);
    ctx.fill();

    // Construct the morphing non-Euclidean boundary
    const points = 32;
    ctx.beginPath();
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      // Morph distortion: ripples slightly non-spherically
      const rOffset = Math.sin(angle * 3 + this.morphPhase) * 2.8 + Math.cos(angle * 5 - this.morphPhase * 0.7) * 1.6;
      const r = this.baseRadius + rOffset;
      const px = this.x + Math.cos(angle) * r;
      const py = this.y + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    // Shading
    const lightX = this.x - this.baseRadius * 0.38;
    const lightY = this.y - this.baseRadius * 0.38;
    const sphereGrad = ctx.createRadialGradient(
      lightX, lightY, this.baseRadius * 0.06,
      this.x, this.y, this.baseRadius
    );
    sphereGrad.addColorStop(0, '#FFFFFF');
    sphereGrad.addColorStop(0.14, '#F3EFFF');
    sphereGrad.addColorStop(0.38, '#9588FF');
    sphereGrad.addColorStop(0.72, '#2C3259');
    sphereGrad.addColorStop(1, '#0E1020');
    ctx.fillStyle = sphereGrad;
    ctx.fill();

    // 4. Independent Counter-Rotating Interior Geometry
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1;
    for (let f = 0; f < 4; f++) {
      const a = this.reflectionPhase + (f * Math.PI / 4);
      ctx.beginPath();
      ctx.ellipse(
        this.x, this.y,
        this.baseRadius * 0.78, this.baseRadius * 0.38,
        a, 0, Math.PI * 2
      );
      ctx.stroke();
    }
    ctx.restore();

    // Chromatic rim caustics
    ctx.strokeStyle = 'rgba(181, 163, 255, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(this.x + 2, this.y + 2, this.baseRadius * 0.96, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(149, 136, 255, 0.65)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.baseRadius - 1, Math.PI * 0.12, Math.PI * 0.68);
    ctx.stroke();

    ctx.restore();
  }

  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.04);
    this.lastTime = currentTime;

    this.update(dt);
    this.draw();

    this.animId = requestAnimationFrame(this.loop);
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.handleResize);
  }
}
