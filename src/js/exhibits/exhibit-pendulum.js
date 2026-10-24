/**
 * Exhibit 002: THE PENDULUM THAT NEVER ARRIVES (Time)
 * Theme: Procrastination, perfectionism, never reaching goals, infinite delay.
 * "I have been almost there for years."
 */

import { museumAudio } from '../audio.js';

export class ExhibitPendulum {
  constructor(containerElement, onComplete) {
    this.container = containerElement;
    this.onComplete = onComplete;
    this.canvas = containerElement.querySelector('#pendulum-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = 0;
    this.height = 0;
    this.animId = null;
    this.time = 0;

    // Pendulum Physics
    this.pivotX = 0;
    this.pivotY = 0;
    this.armLength = 320;
    this.bobRadius = 24;

    this.angle = 0;
    this.maxAngle = 0.82; // Radians (~47°)
    this.angularVelocity = 0.95;
    this.direction = 1;

    // Zeno's Relativistic Asymptotic Factor
    this.zenoDilation = 1.0;
    this.closestApproach = 0.9998;
    this.isFrozen = false;
    this.freezeTimer = 0;

    // Mouse Interaction
    this.mouse = { x: -9999, y: -9999, isDown: false };
    this.bobX = 0;
    this.bobY = 0;

    // Conflicting Clocks in Chamber
    this.clock1 = 0;
    this.clock2 = 0;
    this.clock3 = 0;

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

    const btnPush = this.container.querySelector('#btn-pendulum-push');
    if (btnPush) {
      btnPush.addEventListener('click', () => this.pushPendulum(1.8));
    }

    const btnSurrender = this.container.querySelector('#btn-pendulum-surrender');
    if (btnSurrender) {
      btnSurrender.addEventListener('click', () => this.triggerTimeFreeze());
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

    this.pivotX = this.width / 2;
    this.pivotY = Math.max(20, this.height * 0.08);
    this.armLength = Math.min(this.height * 0.62, 420);
    this.bobRadius = Math.max(20, Math.min(28, this.width * 0.024));
  }

  onPointerMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;

    if (this.mouse.isDown && !this.isFrozen) {
      const dx = this.mouse.x - this.pivotX;
      const dy = this.mouse.y - this.pivotY;
      const targetAngle = Math.atan2(dx, dy);
      this.angle = Math.max(-this.maxAngle * 0.999, Math.min(this.maxAngle * 0.999, targetAngle));
    }
  }

  onPointerDown(e) {
    this.mouse.isDown = true;
    const dist = Math.hypot(this.mouse.x - this.bobX, this.mouse.y - this.bobY);
    if (dist < this.bobRadius * 2.2 && !this.isFrozen) {
      this.pushPendulum(1.4);
    }
  }

  onPointerUp() {
    this.mouse.isDown = false;
  }

  pushPendulum(extraImpulse = 1.2) {
    if (this.isFrozen) return;
    this.angularVelocity = Math.abs(this.angularVelocity) * extraImpulse + 0.6;
    museumAudio.playPendulumWhoosh(this.angularVelocity);

    const dialEl = this.container.querySelector('#pendulum-dilation-val');
    if (dialEl) {
      const dilation = Math.floor(this.angularVelocity * 14200);
      dialEl.textContent = `TIME DILATION: ${dilation.toLocaleString()}×`;
    }
  }

  triggerTimeFreeze() {
    if (this.isFrozen) return;
    this.isFrozen = true;
    museumAudio.playFailurePulse();

    const banner = this.container.querySelector('#pendulum-freeze-banner');
    if (banner) banner.classList.add('active');

    setTimeout(() => {
      museumAudio.playMirrorRefract();
      if (this.onComplete) this.onComplete();
    }, 2800);
  }

  update(dt) {
    this.time += dt;

    if (this.isFrozen) {
      this.freezeTimer += dt;
      return;
    }

    // Clocks disagree and stretch
    this.clock1 += dt * 1.0; // Standard observer
    this.clock2 += dt * (0.12 + Math.abs(this.angle) * 0.2); // Dilated
    this.clock3 += dt * (2.8 - Math.abs(this.angle) * 2.5); // Stuttering

    // Asymptotic Zeno Dynamics:
    // As angle approaches maxAngle, velocity exponentially decelerates to infinitesimal values!
    const normalizedAngle = Math.abs(this.angle) / this.maxAngle; // 0 to ~0.9999
    const distanceToApex = Math.max(0.0001, 1.0 - normalizedAngle);

    // Zeno dampening factor: never reaches 1.0
    const zenoBrake = Math.pow(distanceToApex, 1.4);

    const baseSpeed = 1.4;
    const effectiveSpeed = (baseSpeed * zenoBrake + 0.015) * this.direction;
    this.angle += effectiveSpeed * dt;

    // Switch direction once it touches the asymptotic barrier (~0.998)
    if (this.angle >= this.maxAngle * 0.998) {
      this.direction = -1;
      this.angle = this.maxAngle * 0.998;
      museumAudio.playPendulumWhoosh(0.5);
    } else if (this.angle <= -this.maxAngle * 0.998) {
      this.direction = 1;
      this.angle = -this.maxAngle * 0.998;
      museumAudio.playPendulumWhoosh(0.5);
    }

    // Calculate Bob Coordinates
    this.bobX = this.pivotX + Math.sin(this.angle) * this.armLength;
    this.bobY = this.pivotY + Math.cos(this.angle) * this.armLength;

    // Update Procrastination HUD
    const statusEl = this.container.querySelector('#pendulum-completion-val');
    if (statusEl) {
      const pct = (normalizedAngle * 99.98).toFixed(3);
      statusEl.textContent = `COMPLETION: ${pct}% [DESTINATION UNREACHABLE]`;
    }
  }

  draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);

    const px = this.pivotX;
    const py = this.pivotY;
    const bx = this.bobX;
    const by = this.bobY;

    // 1. Draw Destination Markers (The Unreachable Ends: Left & Right)
    const leftDestX = px + Math.sin(-this.maxAngle) * this.armLength;
    const leftDestY = py + Math.cos(-this.maxAngle) * this.armLength;
    const rightDestX = px + Math.sin(this.maxAngle) * this.armLength;
    const rightDestY = py + Math.cos(this.maxAngle) * this.armLength;

    ctx.save();
    [
      { x: leftDestX, y: leftDestY, label: 'GOAL α // THE IDEAL' },
      { x: rightDestX, y: rightDestY, label: 'GOAL β // COMPLETION' }
    ].forEach((dest) => {
      // Glow ring
      ctx.strokeStyle = 'rgba(181, 163, 255, 0.45)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.arc(dest.x, dest.y, this.bobRadius * 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Cardinal mark
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(dest.x, dest.y, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '8.5px "IBM Plex Mono", monospace';
      ctx.fillStyle = 'rgba(245, 241, 232, 0.65)';
      ctx.textAlign = 'center';
      ctx.fillText(dest.label, dest.x, dest.y + 40);
    });

    // Arc Path (Trajectory)
    ctx.strokeStyle = 'rgba(149, 136, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(px, py, this.armLength, Math.PI / 2 - this.maxAngle, Math.PI / 2 + this.maxAngle);
    ctx.stroke();
    ctx.restore();

    // 2. Draw Pendulum Wire (Hairline high-tension silver/lavender beam)
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 241, 232, 0.75)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(bx, by);
    ctx.stroke();

    // Secondary tension aura
    ctx.strokeStyle = 'rgba(181, 163, 255, 0.25)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(bx, by);
    ctx.stroke();

    // Pivot mount
    ctx.fillStyle = '#151936';
    ctx.beginPath();
    ctx.arc(px, py, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#B5A3FF';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // 3. Draw Massive Polished Pendulum Bob
    ctx.save();
    // Shadow cast downward
    ctx.fillStyle = 'rgba(8, 11, 23, 0.65)';
    ctx.beginPath();
    ctx.arc(bx, by + 18, this.bobRadius * 1.1, 0, Math.PI * 2);
    ctx.fill();

    // Spherical Bob Gradient
    const grad = ctx.createRadialGradient(
      bx - this.bobRadius * 0.35, by - this.bobRadius * 0.35, this.bobRadius * 0.1,
      bx, by, this.bobRadius
    );
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.35, '#B5A3FF');
    grad.addColorStop(0.75, '#6E5AE8');
    grad.addColorStop(1, '#0d1020');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(bx, by, this.bobRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(245, 241, 232, 0.85)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Equator Coordinate Ring on Bob
    ctx.strokeStyle = 'rgba(245, 241, 232, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(bx, by, this.bobRadius, this.bobRadius * 0.35, this.angle, 0, Math.PI * 2);
    ctx.stroke();

    // Temporal Shatter shards if frozen
    if (this.isFrozen) {
      const shards = 18;
      ctx.strokeStyle = 'rgba(181, 163, 255, 0.8)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < shards; i++) {
        const ang = (i / shards) * Math.PI * 2;
        const r1 = this.bobRadius * 1.2;
        const r2 = r1 + this.freezeTimer * 45;
        ctx.beginPath();
        ctx.moveTo(bx + Math.cos(ang) * r1, by + Math.sin(ang) * r1);
        ctx.lineTo(bx + Math.cos(ang + 0.3) * r2, by + Math.sin(ang + 0.3) * r2);
        ctx.stroke();
      }
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
