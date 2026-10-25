/**
 * Exhibit 002: THE PENDULUM THAT NEVER ARRIVES (Time)
 * Active Gameplay: The Five Disagreeing Clocks
 * 
 * Objective: Inspect 5 conflicting clocks, test their mechanisms, and determine which one measures real time.
 * Mechanics:
 * - 5 clocks in room with no giveaway labels (Clock 01 to Clock 05).
 * - Clicking a clock opens the Chronometer Inspection Loupe.
 * - Actions:
 *   - [PAUSE / RESUME CLOCK]: Player tests if clock obeys pause commands or continues running.
 *   - [LOG OBSERVATION]: Adds observation to investigator's notebook.
 *   - [DECLARE THIS CLOCK REALITY]: Submits the player's choice.
 * - Lying clocks trigger distinct dramatic failures:
 *   - Clock 1 (Retrograde): Causality reverses!
 *   - Clock 2 (Hesitant): Time freezes and stutters!
 *   - Clock 3 (Accelerating): Tachyonic runaway!
 *   - Clock 4 (Precognitive): Future ghost hand divergence!
 * - True Clock (Clock 5 / Sidereal Anchor):
 *   - The pendulum completes its swing and rests.
 *   - Accession 002 unlocked.
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

    // Asymptotic Zeno Pendulum
    this.pendulum = {
      pivotX: 0,
      pivotY: 0,
      armLength: 280,
      angle: 0.72,
      maxAngle: 0.75,
      speed: 0.9,
      isArrested: false
    };

    // 5 Architectural Clocks (Neutral identifiers to encourage investigation)
    this.clocks = [
      {
        id: 'clock-1',
        label: 'CLOCK 01',
        xRatio: 0.16,
        yRatio: 0.30,
        radius: 38,
        angle: 0,
        type: 'retrograde',
        isTarget: false,
        isPaused: false,
        desc: 'Escapement sweeps counter-clockwise. Seconds decrease toward negative infinity.',
        obsNote: 'Ticks in reverse. Retrocausal escapement.'
      },
      {
        id: 'clock-2',
        label: 'CLOCK 02',
        xRatio: 0.20,
        yRatio: 0.74,
        radius: 36,
        angle: 0,
        type: 'hesitant',
        isTarget: false,
        isPaused: false,
        pauseTimer: 0,
        desc: 'Escapement freezes for 2.5 seconds every 4 seconds, then jerks forward.',
        obsNote: 'Intermittent stalling. Temporal eddy.'
      },
      {
        id: 'clock-3',
        label: 'CLOCK 03',
        xRatio: 0.80,
        yRatio: 0.30,
        radius: 38,
        angle: 0,
        type: 'tachyonic',
        isTarget: false,
        isPaused: false,
        speedMul: 1.0,
        desc: 'Gears accelerate exponentially. Hand blurs as it races into runaway speed.',
        obsNote: 'Exponential acceleration. Tachyonic inflation.'
      },
      {
        id: 'clock-4',
        label: 'CLOCK 04',
        xRatio: 0.82,
        yRatio: 0.74,
        radius: 36,
        angle: 0,
        type: 'oracle',
        isTarget: false,
        isPaused: false,
        desc: 'Has two superimposed second hands: one tracks the present, the second anticipates 15s into the future.',
        obsNote: 'Double hands. Ghost hand projects ahead.'
      },
      {
        id: 'clock-5',
        label: 'CLOCK 05',
        xRatio: 0.50,
        yRatio: 0.22,
        radius: 46,
        angle: 0,
        type: 'anchor',
        isTarget: true,
        isPaused: false,
        desc: 'Unwavering 1.000 Hz sidereal standard (60 beats/min). Immune to local gravity or observer bias.',
        obsNote: 'Steady 1.000 Hz invariant beat. True sidereal anchor.'
      }
    ];

    this.selectedClock = null;
    this.inspectedClock = null;
    this.recordedObservations = new Set();
    this.solved = false;

    // DOM UI Elements
    this.inspectorPanel = containerElement.querySelector('#clock-inspector-panel');
    this.inspClockId = containerElement.querySelector('#insp-clock-id');
    this.inspClockDesc = containerElement.querySelector('#insp-clock-desc');
    this.btnCloseInsp = containerElement.querySelector('#btn-close-clock-insp');
    this.btnTogglePause = containerElement.querySelector('#btn-toggle-pause-clock');
    this.btnLogObs = containerElement.querySelector('#btn-log-clock-obs');
    this.btnDeclare = containerElement.querySelector('#btn-declare-clock');

    this.feedbackAlert = containerElement.querySelector('#clock-feedback-alert');
    this.feedbackText = containerElement.querySelector('#clock-feedback-text');

    this.logCountEl = containerElement.querySelector('#log-count');
    this.logEntriesEl = containerElement.querySelector('#logbook-entries');
    this.statusHud = containerElement.querySelector('#pendulum-investigation-status');
    this.dilationVal = containerElement.querySelector('#pendulum-dilation-val');
    this.freezeBanner = containerElement.querySelector('#pendulum-freeze-banner');

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    if (this.canvas) {
      this.canvas.addEventListener('pointerdown', (e) => this.onCanvasClick(e));
      this.canvas.addEventListener('pointermove', (e) => this.onCanvasMove(e));
    }

    if (this.btnCloseInsp) {
      this.btnCloseInsp.addEventListener('click', () => this.closeInspector());
    }

    if (this.btnTogglePause) {
      this.btnTogglePause.addEventListener('click', () => this.togglePauseClock());
    }

    if (this.btnLogObs) {
      this.btnLogObs.addEventListener('click', () => this.logObservation());
    }

    if (this.btnDeclare) {
      this.btnDeclare.addEventListener('click', () => this.declareCurrentClock());
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

    this.pendulum.pivotX = this.width * 0.5;
    this.pendulum.pivotY = 40;
    this.pendulum.armLength = Math.min(this.height * 0.55, 300);

    this.clocks.forEach((clock) => {
      clock.x = this.width * clock.xRatio;
      clock.y = this.height * clock.yRatio;
    });
  }

  onCanvasClick(e) {
    if (this.solved) return;
    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    for (let i = 0; i < this.clocks.length; i++) {
      const clock = this.clocks[i];
      const dist = Math.hypot(px - clock.x, py - clock.y);
      if (dist <= clock.radius + 12) {
        this.openInspector(clock);
        museumAudio.playGlassChime(640, 0.2);
        return;
      }
    }
  }

  onCanvasMove(e) {
    if (this.solved) return;
    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    let hovered = null;
    for (let i = 0; i < this.clocks.length; i++) {
      const clock = this.clocks[i];
      const dist = Math.hypot(px - clock.x, py - clock.y);
      if (dist <= clock.radius + 12) {
        hovered = clock;
        break;
      }
    }

    this.canvas.style.cursor = hovered ? 'pointer' : 'default';
  }

  openInspector(clock) {
    this.inspectedClock = clock;
    if (this.inspectorPanel) {
      this.inspectorPanel.style.display = 'flex';
      if (this.inspClockId) this.inspClockId.textContent = clock.label;
      if (this.inspClockDesc) this.inspClockDesc.textContent = clock.desc;
      if (this.btnTogglePause) {
        this.btnTogglePause.textContent = clock.isPaused ? '[RESUME CLOCK]' : '[PAUSE CLOCK]';
      }
    }
  }

  closeInspector() {
    this.inspectedClock = null;
    if (this.inspectorPanel) {
      this.inspectorPanel.style.display = 'none';
    }
  }

  togglePauseClock() {
    if (!this.inspectedClock) return;
    this.inspectedClock.isPaused = !this.inspectedClock.isPaused;
    museumAudio.playGlassChime(420, 0.15);
    if (this.btnTogglePause) {
      this.btnTogglePause.textContent = this.inspectedClock.isPaused ? '[RESUME CLOCK]' : '[PAUSE CLOCK]';
    }
  }

  logObservation() {
    if (!this.inspectedClock) return;
    const clk = this.inspectedClock;
    this.recordedObservations.add(clk.id);

    // Update Logbook UI
    if (this.logCountEl) this.logCountEl.textContent = this.recordedObservations.size;
    if (this.logEntriesEl) {
      // Remove empty hint if first entry
      const emptyEl = this.logEntriesEl.querySelector('.log-empty');
      if (emptyEl) emptyEl.remove();

      // Check if entry already in DOM
      let existing = this.logEntriesEl.querySelector(`[data-clock-id="${clk.id}"]`);
      if (!existing) {
        const li = document.createElement('li');
        li.setAttribute('data-clock-id', clk.id);
        li.className = 'log-item';
        li.innerHTML = `<strong>${clk.label}:</strong> ${clk.obsNote}`;
        this.logEntriesEl.appendChild(li);
      }
    }

    museumAudio.playGlassChime(880, 0.2);
    if (this.statusHud) {
      this.statusHud.textContent = `OBSERVATION RECORDED FOR ${clk.label}. COMPARE WITH OTHER CLOCKS.`;
    }
  }

  declareCurrentClock() {
    if (!this.inspectedClock) return;
    const clock = this.inspectedClock;

    if (clock.isTarget) {
      // SUCCESS: True Invariant Anchor Chosen!
      this.handleSuccess(clock);
    } else {
      // WRONG CLOCK: Specific Consequence
      this.handleFailure(clock);
    }
  }

  handleFailure(clock) {
    museumAudio.playTheoryFailure();

    let msg = '';
    if (clock.type === 'retrograde') {
      msg = 'FALSE: Clock 01 reverses causality. Time flows into the past; reality cannot hold.';
      this.flashGlitch('rgba(255, 90, 90, 0.2)');
    } else if (clock.type === 'hesitant') {
      msg = 'FALSE: Clock 02 stalls intermittently. Reality cannot be anchored to hesitant time.';
      this.flashGlitch('rgba(140, 140, 255, 0.2)');
    } else if (clock.type === 'tachyonic') {
      msg = 'FALSE: Clock 03 accelerates into runaway dilation. Matter would vaporize.';
      this.flashGlitch('rgba(255, 180, 50, 0.2)');
    } else if (clock.type === 'oracle') {
      msg = 'FALSE: Clock 04 projects uncommitted futures. Reality only exists in the present.';
      this.flashGlitch('rgba(200, 100, 255, 0.2)');
    }

    if (this.feedbackAlert && this.feedbackText) {
      this.feedbackText.textContent = msg;
      this.feedbackAlert.style.display = 'flex';
      setTimeout(() => {
        if (this.feedbackAlert) this.feedbackAlert.style.display = 'none';
      }, 4500);
    }

    if (this.statusHud) {
      this.statusHud.textContent = `REJECTED: ${clock.label} FAILED REALITY CRITERIA. TEST ANOTHER.`;
    }
  }

  flashGlitch(color) {
    if (!this.container) return;
    this.container.style.boxShadow = `inset 0 0 80px ${color}`;
    setTimeout(() => {
      if (this.container) this.container.style.boxShadow = 'none';
    }, 600);
  }

  handleSuccess(clock) {
    this.solved = true;
    this.closeInspector();
    this.pendulum.isArrested = true;

    // Play triumphant monumental reveal audio
    museumAudio.playMonumentalReveal();

    if (this.statusHud) {
      this.statusHud.textContent = `INVARIANT DISCOVERED: ${clock.label} IS THE TRUE CLOCK. TIME STABILIZED.`;
      this.statusHud.style.color = 'var(--color-lavender)';
    }

    if (this.dilationVal) {
      this.dilationVal.textContent = '1.000 Hz · SIDEREAL HARMONY RESTORED';
      this.dilationVal.style.color = 'var(--color-lavender)';
    }

    setTimeout(() => {
      if (this.freezeBanner) {
        this.freezeBanner.classList.add('banner-visible');
        museumAudio.playGlassChime(440, 1.5);
      }
      if (typeof this.onComplete === 'function') {
        this.onComplete();
      }
    }, 1500);
  }

  loop() {
    this.time += 0.016;
    this.updateClockMechanisms();
    this.render();
    this.animId = requestAnimationFrame(this.loop);
  }

  updateClockMechanisms() {
    if (this.solved) return;

    this.clocks.forEach(c => {
      if (c.isPaused) return;

      if (c.type === 'retrograde') {
        // Ticks backward
        c.angle -= 0.04;
      } else if (c.type === 'hesitant') {
        // Pauses every 4 seconds for 2.5 seconds
        c.pauseTimer = (c.pauseTimer || 0) + 0.016;
        if (c.pauseTimer % 5 < 2.5) {
          c.angle += 0.08;
        }
      } else if (c.type === 'tachyonic') {
        // Runs runaway faster and faster
        c.speedMul = 1.0 + Math.sin(this.time * 0.8) * 0.8;
        c.angle += 0.12 * c.speedMul;
      } else if (c.type === 'oracle') {
        // Double hand tracking
        c.angle += 0.035;
      } else if (c.type === 'anchor') {
        // True 1-second ticks (60 bpm)
        c.angle = (this.time * (Math.PI * 2 / 60)) * 60; // 1 full rotation per 60s, smooth or stepped
      }
    });
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render giant Zeno Pendulum
    this.renderPendulum(ctx);

    // 2. Render 5 Clocks
    this.renderClocks(ctx);
  }

  renderPendulum(ctx) {
    const p = this.pendulum;
    ctx.save();

    // If not arrested, asymptotic swing
    if (!p.isArrested) {
      // Asymptote: never reaches maxAngle
      p.angle = Math.sin(this.time * p.speed) * p.maxAngle * 0.96;
    } else {
      // Rest at center vertical
      p.angle *= 0.94;
    }

    const bobX = p.pivotX + Math.sin(p.angle) * p.armLength;
    const bobY = p.pivotY + Math.cos(p.angle) * p.armLength;

    // Pivot mount
    ctx.beginPath();
    ctx.arc(p.pivotX, p.pivotY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#B5A3FF';
    ctx.fill();

    // Rod
    ctx.beginPath();
    ctx.moveTo(p.pivotX, p.pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.strokeStyle = 'rgba(245, 241, 232, 0.35)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Pendulum Bob
    ctx.beginPath();
    ctx.arc(bobX, bobY, 24, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(24, 22, 36, 0.95)';
    ctx.fill();
    ctx.strokeStyle = p.isArrested ? '#B5A3FF' : 'rgba(245, 241, 232, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner brass ring
    ctx.beginPath();
    ctx.arc(bobX, bobY, 8, 0, Math.PI * 2);
    ctx.fillStyle = p.isArrested ? '#B5A3FF' : 'rgba(181, 163, 255, 0.5)';
    ctx.fill();

    ctx.restore();
  }

  renderClocks(ctx) {
    this.clocks.forEach(c => {
      ctx.save();
      const isSelected = this.inspectedClock && this.inspectedClock.id === c.id;

      // Glow on selected clock
      if (isSelected) {
        ctx.shadowColor = '#B5A3FF';
        ctx.shadowBlur = 18;
      }

      // Outer bezel
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(16, 15, 24, 0.92)';
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#B5A3FF' : 'rgba(245, 241, 232, 0.35)';
      ctx.lineWidth = isSelected ? 2.5 : 1.2;
      ctx.stroke();

      // Dial ticks (12 cardinal ticks)
      for (let i = 0; i < 12; i++) {
        const rad = (i / 12) * Math.PI * 2;
        const innerR = c.radius - (i % 3 === 0 ? 8 : 4);
        const outerR = c.radius - 2;
        ctx.beginPath();
        ctx.moveTo(c.x + Math.sin(rad) * innerR, c.y - Math.cos(rad) * innerR);
        ctx.lineTo(c.x + Math.sin(rad) * outerR, c.y - Math.cos(rad) * outerR);
        ctx.strokeStyle = 'rgba(245, 241, 232, 0.4)';
        ctx.lineWidth = i % 3 === 0 ? 1.5 : 0.8;
        ctx.stroke();
      }

      // Special ghost hand for Clock 4
      if (c.type === 'oracle') {
        const ghostAngle = c.angle + 1.2;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x + Math.sin(ghostAngle) * (c.radius * 0.75), c.y - Math.cos(ghostAngle) * (c.radius * 0.75));
        ctx.strokeStyle = 'rgba(181, 163, 255, 0.35)';
        ctx.setLineDash([2, 4]);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Main Hand
      const handLen = c.radius * 0.7;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(c.x + Math.sin(c.angle) * handLen, c.y - Math.cos(c.angle) * handLen);
      ctx.strokeStyle = isSelected ? '#B5A3FF' : '#F5F1E8';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Center pivot
      ctx.beginPath();
      ctx.arc(c.x, c.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#B5A3FF';
      ctx.fill();

      // Neutral Clock Label
      ctx.shadowBlur = 0;
      ctx.font = '500 11px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = isSelected ? '#B5A3FF' : 'rgba(245, 241, 232, 0.75)';
      ctx.fillText(c.label, c.x, c.y + c.radius + 18);

      // Status indicator if logged
      if (this.recordedObservations.has(c.id)) {
        ctx.font = '400 9px "IBM Plex Mono", monospace';
        ctx.fillStyle = '#70E0D0';
        ctx.fillText('[LOGGED]', c.x, c.y + c.radius + 30);
      }

      ctx.restore();
    });
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    window.removeEventListener('resize', this.handleResize);
  }
}
