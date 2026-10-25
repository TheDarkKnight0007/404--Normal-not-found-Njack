/**
 * The Museum of Incorrect Physics
 * Exhibit Curatorial Briefing System
 * 
 * "When entering ANY exhibit:
 * Do not immediately start gameplay.
 * Instead: Show a beautiful museum briefing sequence.
 * 1. Reality pauses.
 * 2. Exhibit title appears.
 * 3. Short impossible animation demonstrates the broken law.
 * 4. Clear presentation: MISSION, HOW, REWARD.
 * 5. Large elegant initiation button [BEGIN INVESTIGATION]."
 */

import { museumAudio } from './audio.js';

export const EXHIBIT_BRIEFINGS = {
  'vault-1': {
    title: 'THE WEIGHT OF INVISIBLE THINGS',
    accession: 'ACCESSION // 001-GRV',
    violationType: 'gravity',
    lawName: "NEWTON'S THIRD LAW // INVERTED",
    mission: 'Find the invisible celestial mass hidden in the chamber.',
    how: 'Drag the 3 field scanners around the floor. When their triangulation circles intersect, lock the coordinates.',
    reward: 'Collapse the invisible singularity and unlock Accession 001.',
    buttonLabel: '[BEGIN INVESTIGATION]',
    animSvg: `
      <div class="briefing-anim-box anim-gravity">
        <div class="anim-grav-floor"></div>
        <div class="anim-grav-rock" id="anim-grav-rock">
          <span class="rock-glyph">MASS: 0.00kg</span>
        </div>
        <div class="anim-grav-arrow-up">▲ ACCELERATING UPWARD (-1.28 m/s²)</div>
      </div>
    `
  },
  'vault-2': {
    title: 'THE PENDULUM THAT NEVER ARRIVES',
    accession: 'ACCESSION // 002-TMP',
    violationType: 'time',
    lawName: 'UNIDIRECTIONAL TIME // COMPROMISED',
    mission: 'Identify which clock measures real time.',
    how: 'Click on clocks to open the inspection loupe. Test their escapements, pause them, and compare their rhythm.',
    reward: 'Stabilize the asymptotic pendulum into stillness and unlock Accession 002.',
    buttonLabel: '[SYNCHRONIZE REALITY]',
    animSvg: `
      <div class="briefing-anim-box anim-time">
        <div class="anim-time-countdown" id="anim-time-countdown">
          <span class="count-digit count-1">3</span>
          <span class="count-digit count-2">2</span>
          <span class="count-digit count-3">1</span>
          <span class="count-digit count-anomaly">∞</span>
          <span class="count-digit count-glitch">-4</span>
        </div>
        <div class="anim-time-caption">CAUSALITY REFUSES LINEAR SEQUENCE</div>
      </div>
    `
  },
  'vault-3': {
    title: 'THE ROOM OF PERFECT REFLECTIONS',
    accession: 'ACCESSION // 003-OPT',
    violationType: 'optics',
    lawName: 'SNELL’S LAW & SPECULAR REFLECTION // EXTINCT',
    mission: 'Determine which mirror tells the truth.',
    how: 'Move your cursor across the room to observe who leads and who follows. Inspect each mirror to challenge it.',
    reward: 'Unmask the true observer and shatter optical deception.',
    buttonLabel: '[ENTER MIRROR GALLERY]',
    animSvg: `
      <div class="briefing-anim-box anim-optics">
        <div class="anim-mirror-half anim-mirror-left">
          <span class="anim-hand-left">✋ YOUR HAND</span>
        </div>
        <div class="anim-mirror-divider"></div>
        <div class="anim-mirror-half anim-mirror-right">
          <span class="anim-hand-right">✋ REFLECTION (MOVES FIRST)</span>
        </div>
      </div>
    `
  },
  'vault-4': {
    title: 'THE GARDEN OF EQUAL SHAPES',
    accession: 'ACCESSION // 004-SYM',
    violationType: 'symmetry',
    lawName: 'NOETHER’S CONSERVATION THEOREM // BREACHED',
    mission: 'Find the single flower that is actually alive.',
    how: 'Click flowers with your biometric stethoscope. Dead flowers flatline at 0 BPM. The living flower has a 72 BPM pulse.',
    reward: 'Decide the living specimen’s fate: preserve diversity or enforce mathematical conformity.',
    buttonLabel: '[INITIATE BIOMETRIC SCAN]',
    animSvg: `
      <div class="briefing-anim-box anim-symmetry">
        <div class="anim-flower-compare">
          <div class="anim-fl-item anim-fl-dead">
            <span class="fl-icon">❄</span>
            <span class="fl-label">35 SPECIMENS: 0 BPM [DEAD]</span>
          </div>
          <div class="anim-fl-item anim-fl-live">
            <span class="fl-icon fl-pulse">🌸</span>
            <span class="fl-label">1 SPECIMEN: 72 BPM [ALIVE]</span>
          </div>
        </div>
      </div>
    `
  }
};

export class ExhibitBriefingManager {
  constructor(onStart) {
    this.onStart = onStart;
    this.overlay = null;
    this.initDOM();
  }

  initDOM() {
    let overlay = document.getElementById('exhibit-briefing-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'exhibit-briefing-modal';
      overlay.className = 'exhibit-briefing-modal';
      document.body.appendChild(overlay);
    }
    this.overlay = overlay;
  }

  show(vaultId, callback) {
    const data = EXHIBIT_BRIEFINGS[vaultId];
    if (!data || !this.overlay) {
      if (typeof callback === 'function') callback();
      return;
    }

    museumAudio.playEnterResonance();

    this.overlay.innerHTML = `
      <div class="briefing-card" role="dialog" aria-modal="true" aria-labelledby="briefing-title">
        <header class="briefing-card-header">
          <div class="briefing-accession-row">
            <span class="briefing-accession">${data.accession}</span>
            <span class="briefing-law-violation">${data.lawName}</span>
          </div>
          <h2 class="briefing-title" id="briefing-title">${data.title}</h2>
        </header>

        <!-- Physics-Violating Demonstration Animation -->
        <div class="briefing-demo-wrap">
          ${data.animSvg}
        </div>

        <!-- 3-Block Usability Rules -->
        <div class="briefing-rules-grid">
          <div class="briefing-rule-block">
            <span class="rule-kicker">01 // THE MISSION</span>
            <p class="rule-text">${data.mission}</p>
          </div>
          <div class="briefing-rule-block">
            <span class="rule-kicker">02 // HOW TO PLAY</span>
            <p class="rule-text">${data.how}</p>
          </div>
          <div class="briefing-rule-block">
            <span class="rule-kicker">03 // THE REWARD</span>
            <p class="rule-text">${data.reward}</p>
          </div>
        </div>

        <!-- Start Button -->
        <footer class="briefing-card-footer">
          <button id="btn-start-investigation" class="btn-briefing-start" type="button">
            ${data.buttonLabel}
          </button>
        </footer>
      </div>
    `;

    this.overlay.classList.add('active');

    const startBtn = this.overlay.querySelector('#btn-start-investigation');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        museumAudio.playGlassChime(880, 0.4);
        this.overlay.classList.add('dissolving');

        setTimeout(() => {
          this.overlay.classList.remove('active', 'dissolving');
          if (typeof callback === 'function') {
            callback();
          }
        }, 600);
      }, { once: true });
    }
  }
}
