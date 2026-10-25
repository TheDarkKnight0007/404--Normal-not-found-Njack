/**
 * The Museum of Incorrect Physics
 * Newton Transition Engine
 * 
 * "When I click archive button:
 * Show a silhouette of Newton sitting under a tree.
 * Visitor can shake the tree using cursor movement.
 * The visitor expects: Apple falls.
 * Instead: Newton falls upward. Apple remains attached.
 * Physics violated. Transition begins."
 */

import { museumAudio } from './audio.js';

export class NewtonTransition {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.overlay = null;
    this.canvas = null;
    this.ctx = null;
    this.animId = null;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = 0;
    this.height = 0;
    this.time = 0;

    // Interaction State
    this.shakeEnergy = 0;
    this.isTriggered = false;
    this.shakeThreshold = 100;
    this.newtonYOffset = 0;
    this.newtonVelocity = 0;
    this.treeSway = 0;
    this.prevMouseX = null;

    this.initDOM();
  }

  initDOM() {
    let overlay = document.getElementById('newton-transition-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'newton-transition-overlay';
      overlay.className = 'newton-transition-overlay';
      overlay.innerHTML = `
        <canvas id="newton-canvas"></canvas>
        <div class="newton-ui">
          <span class="newton-badge">TRANSITIONAL THRESHOLD // 1687 PARADOX</span>
          <h2 class="newton-title">THE INCIDENT UNDER THE OAK</h2>
          <p class="newton-hint" id="newton-hint">[SWEEP CURSOR ACROSS BRANCHES TO SHAKE THE TREE]</p>
          <div class="newton-shake-meter">
            <div class="newton-shake-bar" id="newton-shake-bar"></div>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    this.overlay = overlay;
    this.canvas = overlay.querySelector('#newton-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.hintEl = overlay.querySelector('#newton-hint');
    this.shakeBar = overlay.querySelector('#newton-shake-bar');

    this.handleResize = this.handleResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.loop = this.loop.bind(this);
  }

  start() {
    if (!this.overlay || !this.canvas) return;

    this.overlay.classList.add('active');
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mousemove', this.onMouseMove);

    this.shakeEnergy = 0;
    this.isTriggered = false;
    this.newtonYOffset = 0;
    this.newtonVelocity = 0;
    this.treeSway = 0;

    if (this.hintEl) {
      this.hintEl.textContent = '[SWEEP CURSOR ACROSS BRANCHES TO SHAKE THE TREE]';
      this.hintEl.style.color = 'rgba(245, 241, 232, 0.7)';
    }

    museumAudio.playEnterResonance();
    this.animId = requestAnimationFrame(this.loop);
  }

  handleResize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  onMouseMove(e) {
    if (this.isTriggered) return;

    if (this.prevMouseX !== null) {
      const deltaX = Math.abs(e.clientX - this.prevMouseX);
      // If cursor is moving across upper half (tree canopy area)
      if (e.clientY < this.height * 0.75 && deltaX > 4) {
        this.shakeEnergy += deltaX * 0.35;
        this.treeSway = (e.clientX - this.prevMouseX) * 0.12;

        if (Math.random() < 0.15) {
          museumAudio.playMeshHum(180 + Math.random() * 80, 0.05);
        }
      }
    }
    this.prevMouseX = e.clientX;
  }

  triggerParadox() {
    if (this.isTriggered) return;
    this.isTriggered = true;

    // Audio cue: gravity snap & reverse whoosh
    museumAudio.playMeshTear();
    museumAudio.playSingularityCollapse();

    if (this.hintEl) {
      this.hintEl.textContent = 'GRAVITATIONAL ANOMALY: THE APPLE REMAINS. NEWTON FALLS UPWARD.';
      this.hintEl.style.color = 'var(--color-lavender)';
    }

    this.newtonVelocity = -1.2;

    // Finish transition after Newton ascends into clouds
    setTimeout(() => {
      this.overlay.classList.add('fade-out');
      museumAudio.playMonumentalReveal();

      setTimeout(() => {
        this.close();
        if (typeof this.onComplete === 'function') {
          this.onComplete();
        }
      }, 900);
    }, 2800);
  }

  close() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    if (this.overlay) {
      this.overlay.classList.remove('active', 'fade-out');
    }
  }

  loop() {
    this.time += 0.016;

    // Decay shake energy unless triggered
    if (!this.isTriggered) {
      this.shakeEnergy *= 0.96;
      this.treeSway *= 0.90;

      if (this.shakeBar) {
        const pct = Math.min(100, (this.shakeEnergy / this.shakeThreshold) * 100);
        this.shakeBar.style.width = `${pct}%`;
      }

      if (this.shakeEnergy >= this.shakeThreshold) {
        this.triggerParadox();
      }
    } else {
      // Newton falls UPWARD with upward acceleration!
      this.newtonVelocity -= 0.35;
      this.newtonYOffset += this.newtonVelocity;
    }

    this.render();
    this.animId = requestAnimationFrame(this.loop);
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const groundY = this.height * 0.72;
    const treeX = this.width * 0.52;
    const treeY = groundY;

    // 1. Grassy Mound / Horizon
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, groundY + 20);
    ctx.quadraticCurveTo(this.width * 0.5, groundY - 15, this.width, groundY + 20);
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.fillStyle = '#090810';
    ctx.fill();
    ctx.strokeStyle = 'rgba(181, 163, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 2. Ancient Oak Tree Trunk & Branches (sways with treeSway)
    const sway = Math.sin(this.time * 3) * (this.shakeEnergy * 0.08) + this.treeSway;
    ctx.beginPath();
    // Trunk base
    ctx.moveTo(treeX - 25, groundY);
    ctx.quadraticCurveTo(treeX - 10 + sway * 0.3, groundY - 140, treeX - 15 + sway, groundY - 260);
    // Left branch (holding the apple)
    ctx.quadraticCurveTo(treeX - 90 + sway * 1.2, groundY - 280, treeX - 140 + sway * 1.5, groundY - 240);
    ctx.lineTo(treeX - 130 + sway * 1.4, groundY - 235);
    ctx.quadraticCurveTo(treeX - 70 + sway * 1.1, groundY - 265, treeX + sway, groundY - 240);
    // Right branch
    ctx.quadraticCurveTo(treeX + 90 + sway * 1.2, groundY - 300, treeX + 160 + sway * 1.4, groundY - 260);
    ctx.lineTo(treeX + 150 + sway * 1.3, groundY - 255);
    ctx.quadraticCurveTo(treeX + 70 + sway * 1.0, groundY - 280, treeX + 25 + sway * 0.5, groundY - 140);
    ctx.quadraticCurveTo(treeX + 35, groundY - 30, treeX + 35, groundY);
    ctx.closePath();
    ctx.fillStyle = '#06050A';
    ctx.fill();
    ctx.strokeStyle = 'rgba(245, 241, 232, 0.15)';
    ctx.stroke();

    // Foliage Cloud Silhouette
    ctx.beginPath();
    ctx.arc(treeX - 70 + sway * 1.2, groundY - 310, 85, 0, Math.PI * 2);
    ctx.arc(treeX + 70 + sway * 1.2, groundY - 320, 95, 0, Math.PI * 2);
    ctx.arc(treeX + sway * 1.1, groundY - 360, 90, 0, Math.PI * 2);
    ctx.arc(treeX - 130 + sway * 1.3, groundY - 260, 60, 0, Math.PI * 2);
    ctx.arc(treeX + 140 + sway * 1.3, groundY - 270, 65, 0, Math.PI * 2);
    ctx.fillStyle = '#06050A';
    ctx.fill();

    // 3. The Apple (Hanging from branch at treeX - 130, groundY - 235)
    // The apple remains firmly attached even when shaken!
    const appleStemX = treeX - 130 + sway * 1.4;
    const appleStemY = groundY - 235;
    const appleX = appleStemX + Math.sin(this.time * 5) * (this.shakeEnergy * 0.05);
    const appleY = appleStemY + 26;

    // Stem
    ctx.beginPath();
    ctx.moveTo(appleStemX, appleStemY);
    ctx.lineTo(appleX, appleY - 8);
    ctx.strokeStyle = 'rgba(245, 241, 232, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Apple Body
    ctx.beginPath();
    ctx.arc(appleX, appleY, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#FF5050';
    ctx.fill();
    ctx.shadowColor = '#FF5050';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 4. Sir Isaac Newton Silhouette (Sitting under tree)
    // When paradox triggers, Newton ascends upward!
    const newtonX = treeX + 45;
    const newtonY = groundY - 10 + this.newtonYOffset;

    ctx.save();
    ctx.translate(newtonX, newtonY);

    if (this.isTriggered) {
      // Newton tilts slightly as he floats upward
      ctx.rotate(Math.sin(this.time * 6) * 0.15 - 0.1);
    }

    ctx.fillStyle = '#0E0C16';
    ctx.strokeStyle = 'rgba(181, 163, 255, 0.4)';
    ctx.lineWidth = 1.2;

    // Newton's Head & 17th Century Long Wig
    ctx.beginPath();
    ctx.arc(0, -55, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Wig locks cascading on shoulders
    ctx.beginPath();
    ctx.moveTo(-12, -50);
    ctx.quadraticCurveTo(-18, -35, -12, -25);
    ctx.lineTo(12, -25);
    ctx.quadraticCurveTo(18, -35, 12, -50);
    ctx.fill();

    // Torso / Frock Coat
    ctx.beginPath();
    ctx.moveTo(-14, -25);
    ctx.lineTo(14, -25);
    ctx.lineTo(20, 5);
    ctx.lineTo(-20, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Legs: Seated crossed on grass OR kicking in air when ascending
    if (!this.isTriggered) {
      // Seated peacefully
      ctx.beginPath();
      ctx.moveTo(-16, 5);
      ctx.lineTo(-35, 12);
      ctx.lineTo(-12, 16);
      ctx.lineTo(24, 16);
      ctx.lineTo(18, 5);
      ctx.fill();
      ctx.stroke();

      // Open book / manuscript on his lap
      ctx.beginPath();
      ctx.moveTo(-18, -2);
      ctx.lineTo(8, -8);
      ctx.lineTo(14, 2);
      ctx.lineTo(-12, 8);
      ctx.closePath();
      ctx.fillStyle = 'rgba(245, 241, 232, 0.7)';
      ctx.fill();
    } else {
      // Kicking upward into the sky!
      const kick = Math.sin(this.time * 12) * 14;
      ctx.beginPath();
      ctx.moveTo(-14, 5);
      ctx.lineTo(-24 + kick, 26);
      ctx.moveTo(14, 5);
      ctx.lineTo(24 - kick, 28);
      ctx.strokeStyle = 'rgba(181, 163, 255, 0.6)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Floating Quill
      ctx.beginPath();
      ctx.moveTo(18, -10 + Math.sin(this.time * 4) * 8);
      ctx.lineTo(28, -25 + Math.sin(this.time * 4) * 8);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
    ctx.restore();
  }
}
