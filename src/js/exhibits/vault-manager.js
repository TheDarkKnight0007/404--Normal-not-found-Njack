/**
 * The Museum of Incorrect Physics
 * Vault Coordinator & Climax Archive Engine
 * 
 * Climax Architecture:
 * - Active Detective Records Room with evidence collection.
 * - Interactive Redaction Decoding (clicking black bars deciphers confidential findings).
 * - Logical Contradiction Flagging (pinning anomalies).
 * - Passcode Keypad Lock on Case 004 (requires finding specimen #014).
 * - Earned unlock of hidden drawer "CASE NULL: THE OBSERVER".
 * - Atmospheric slowing, cursor vector tracking, monumental reveal "YOU",
 *   and consequential final choices [ACCEPT CLASSIFICATION] vs [REJECT CLASSIFICATION].
 */

import { museumAudio } from '../audio.js';
import { ExhibitGravity } from './exhibit-gravity.js';
import { ExhibitPendulum } from './exhibit-pendulum.js';
import { ExhibitReflections } from './exhibit-reflections.js';
import { ExhibitGarden } from './exhibit-garden.js';
import { CorridorPerspectiveSim } from '../corridor-sim.js';
import { NewtonTransition } from '../newton-transition.js';
import { ExhibitBriefingManager } from '../exhibit-briefing.js';
import { ExhibitNull } from './exhibit-null.js';

export class VaultManager {
  constructor() {
    this.currentVault = 'threshold'; // 'threshold' | 'vault-1' | 'vault-2' | 'vault-3' | 'vault-4' | 'archive'
    this.activeSim = null;
    this.corridorSim = null;

    this.briefingManager = new ExhibitBriefingManager();
    this.entropyLevel = 0.0;

    // Archive Detective Investigation State
    this.currentDrawerKey = 'grv';
    this.archiveOpenedCount = 0;
    this.archiveInspectedSet = new Set(['grv']);
    this.isCaseSymUnlocked = false; // Case 004 starts locked
    this.decryptedRedactions = new Set();
    this.flaggedContradictions = new Set();
    this.isCaseNullUnlocked = false;
    this.isCaseNullActive = false;
    this.userClassification = null;

    // Archive Dossier Registry Data
    this.dossiers = {
      grv: {
        id: 'ACCESSION: 001-GRV',
        title: 'THE INVISIBLE CELESTIAL BODY',
        contradiction: 'MASS RECORDED ZERO METRIC VOLUME BUT SAGS UNDER STRAIN',
        body: `<p><strong>INCIDENT LOG:</strong> Field gravimeters confirmed that the chamber floor did not sag under physical mass, but under the weight of <span class="redacted-ink" data-secret="unspoken human expectations">████████████████████</span>. The invisible singularity has zero geometric volume yet produces -1.28 m/s² metric strain.</p>
        <p><strong>CURATORIAL FINDING:</strong> By dragging the 3 field scanners, the visitor triangulated what instruments failed to register. Attraction is not mandatory; it is an elective principle.</p>
        <p class="dossier-note"><strong>ARCHIVAL DIRECTIVE:</strong> Do not attempt to lift the singularity. To observe the burden is to disarm it.</p>`,
        bodyMutated: `<p><strong>CLASSIFIED RETRIEVAL LOG:</strong> Field gravimeters did not sag under inanimate matter. The strain vector pointed directly toward the external coordinate (the glass screen). The observer swept the field scanner and collapsed the invisible singularity.</p>
        <p><strong>OBSERVER ANNOTATION:</strong> The mass did not exist until a hand reached down to weigh it. You gave it substance by seeking it.</p>
        <p class="dossier-note"><strong>MIP ARCHIVAL NOTE:</strong> The burden was never in the room. The burden entered when you did.</p>`
      },
      tmp: {
        id: 'ACCESSION: 002-TMP',
        title: 'THE TRUE INVARIANT ANCHOR',
        contradiction: 'TIME DILATION SUSTAINED SOLELY BY VISITOR ANTICIPATION',
        body: `<p><strong>INCIDENT LOG:</strong> Clock 05 was retrieved from a null-geodesic pocket at the edge of the campus. While surrounding clocks ran backwards, paused, or prophesied the future, Clock 05 maintained unbroken <span class="redacted-ink" data-secret="1.000 Hz sidereal standard">██████████████████</span>.</p>
        <p><strong>CURATORIAL FINDING:</strong> Time dilation is not an external constraint; it is an internal fear of completion. Synchronizing with the true anchor allowed the asymptotic pendulum to rest.</p>
        <p class="dossier-note"><strong>ARCHIVAL DIRECTIVE:</strong> Forgive the duty of arrival. In an unhurried universe, nothing is late.</p>`,
        bodyMutated: `<p><strong>CLASSIFIED RETRIEVAL LOG:</strong> The asymptotic pendulum did not decelerate through mechanical entropy. It delayed its arrival because an observer stood waiting. When you synchronized Clock 05, the temporal eddy collapsed.</p>
        <p><strong>OBSERVER ANNOTATION:</strong> The delay was created by your anticipation. By watching the pendulum, you prolonged its flight.</p>
        <p class="dossier-note"><strong>MIP ARCHIVAL NOTE:</strong> Time does not flow. Consciousness creates duration.</p>`
      },
      opt: {
        id: 'ACCESSION: 003-OPT',
        title: 'THE OBSERVER INVERSION',
        contradiction: 'MIRRORS REFLECTED PREDICTIONS RATHER THAN PHOTONS',
        body: `<p><strong>INCIDENT LOG:</strong> Spectroscopic analysis of the 4 monolithic mirrors revealed zero reflective silvering. The glass panels do not reflect light; they contain <span class="redacted-ink" data-secret="autonomous observer cameras">████████████████████</span>.</p>
        <p><strong>CURATORIAL FINDING:</strong> When the visitor attempted to confirm which reflection was authentic, all four turned outward. The viewer's reflection was extinguished. You were being cataloged by the glass.</p>
        <p class="dossier-note"><strong>ARCHIVAL DIRECTIVE:</strong> Glass must remain shielded when no conscious observer is inside the gallery.</p>`,
        bodyMutated: `<p><strong>CLASSIFIED RETRIEVAL LOG:</strong> Spectroscopic analysis confirms the four mirrors never reflected photons. They reflected expectation. When you challenged their truthfulness, they halted and turned to face you.</p>
        <p><strong>OBSERVER ANNOTATION:</strong> Your reflection vanished because you were never on that side of the glass. The museum was cataloging the face looking in.</p>
        <p class="dossier-note"><strong>MIP ARCHIVAL NOTE:</strong> You were never the researcher. You were the specimen.</p>`
      },
      sym: {
        id: 'ACCESSION: 004-SYM',
        title: 'THE ROGUE HEARTBEAT',
        contradiction: 'LIVING BIOLOGICAL HEARTBEAT INSIDE ZERO-ENTROPY LATTICE',
        body: `<p><strong>INCIDENT LOG:</strong> Within an array of 36 mathematically congruent rosettes, Specimen 014 developed a distinct <span class="redacted-ink" data-secret="72 BPM arterial cardiac pulse">████████████████████</span> without biological tissue.</p>
        <p><strong>CURATORIAL FINDING:</strong> Absolute symmetry induces catastrophic entropy freeze. Living systems require imperfection to sustain momentum.</p>
        <p class="dossier-note"><strong>ARCHIVAL DIRECTIVE:</strong> Preserve morphological deviation. Perfection is a conservation hazard.</p>`,
        bodyMutated: `<p><strong>CLASSIFIED RETRIEVAL LOG:</strong> The lattice of 36 flowers was mathematically stable until your cursor scanned it. Specimen 014 was chosen not by physics, but by human preference for imperfection.</p>
        <p><strong>OBSERVER ANNOTATION:</strong> The flower did not bloom on its own. Your judgment determined whether life or order took precedence.</p>
        <p class="dossier-note"><strong>MIP ARCHIVAL NOTE:</strong> Moral divergence requires an outside mind to take sides.</p>`
      },
      vit: {
        id: 'ACCESSION: 000-VIT',
        title: 'THE ANOMALY VITRINE MALFUNCTION',
        contradiction: 'FRICTION COEFFICIENTS VANISHED INTENTIONALLY TO ATTRACT AN OBSERVER',
        body: `<p><strong>INCIDENT LOG:</strong> The inaugural artifact OBJ-000 severed its gravitational coupling at 03:14:07. All local friction coefficients dropped to <span class="redacted-ink" data-secret="absolute zero friction">██████████████</span>.</p>
        <p><strong>CURATORIAL FINDING:</strong> The museum was erected around this plinth. In striving to cure the universe of wear, we permanently decoupled its causality.</p>
        <p class="dossier-note"><strong>ARCHIVAL DIRECTIVE:</strong> Maintain the containment threshold. Do not restore friction.</p>`,
        bodyMutated: `<p><strong>CLASSIFIED RETRIEVAL LOG:</strong> The plinth malfunctioned the instant the exhibition opened its doors to human visitors. Friction did not vanish by accident—it vanished to attract an observer.</p>
        <p><strong>OBSERVER ANNOTATION:</strong> The entire museum was baited. Every room was built to see how a conscious mind reacts to impossible laws.</p>
        <p class="dossier-note"><strong>MIP ARCHIVAL NOTE:</strong> The trap is complete. The observer is inside.</p>`
      }
    };

    this.init();
  }

  init() {
    this.navPills = document.querySelectorAll('.vault-pill');
    this.hudVaultNav = document.getElementById('hud-vault-nav');
    this.hudVaultLabel = document.getElementById('hud-vault-name');

    const corridorCanvas = document.getElementById('corridor-perspective-canvas');
    if (corridorCanvas) {
      this.corridorSim = new CorridorPerspectiveSim(corridorCanvas);
    }

    // Connect Vault Switcher Pills in HUD
    this.navPills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        const vaultId = e.currentTarget.getAttribute('data-vault');
        if (vaultId) this.switchToVault(vaultId);
      });
    });

    // Connect Corridor Directory Cards
    const corridorCards = document.querySelectorAll('.corridor-card');
    corridorCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        const vaultId = e.currentTarget.getAttribute('data-vault');
        if (vaultId) this.switchToVault(vaultId);
      });
    });

    // Connect Accession Null buttons
    const btnEnterNull = document.getElementById('btn-enter-accession-null');
    if (btnEnterNull) {
      btnEnterNull.addEventListener('click', () => {
        this.switchToVault('vault-null');
      });
    }

    const btnReturnNull = document.getElementById('btn-return-from-null');
    if (btnReturnNull) {
      btnReturnNull.addEventListener('click', () => {
        this.switchToVault('archive');
      });
    }

    // Keyboard Shortcuts: 0, 1, 2, 3, 4, A
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === '0') this.switchToVault('threshold');
      if (e.key === '1') this.switchToVault('vault-1');
      if (e.key === '2') this.switchToVault('vault-2');
      if (e.key === '3') this.switchToVault('vault-3');
      if (e.key === '4') this.switchToVault('vault-4');
      if (e.key === 'a' || e.key === 'A') this.switchToVault('archive');
    });

    this.bindAdvanceButtons();
    this.initArchiveDrawerSystem();
    this.initKeypadLockSystem();
  }

  bindAdvanceButtons() {
    const btnToVault2 = document.getElementById('btn-to-vault-2');
    if (btnToVault2) btnToVault2.addEventListener('click', () => this.switchToVault('vault-2'));

    const btnToVault3 = document.getElementById('btn-to-vault-3');
    if (btnToVault3) btnToVault3.addEventListener('click', () => this.switchToVault('vault-3'));

    const btnToVault4 = document.getElementById('btn-to-vault-4');
    if (btnToVault4) btnToVault4.addEventListener('click', () => this.switchToVault('vault-4'));

    const btnToArchive1 = document.getElementById('btn-to-archive-1');
    if (btnToArchive1) btnToArchive1.addEventListener('click', () => this.switchToVault('archive'));

    const btnToArchive2 = document.getElementById('btn-to-archive-2');
    if (btnToArchive2) btnToArchive2.addEventListener('click', () => this.switchToVault('archive'));
  }

  initArchiveDrawerSystem() {
    const drawers = document.querySelectorAll('.cabinet-drawer');
    const caseIdEl = document.getElementById('dossier-case-id');
    const caseTitleEl = document.getElementById('dossier-case-title');
    const caseBodyEl = document.getElementById('dossier-case-body');
    const btnStamp = document.getElementById('btn-affix-seal');
    const inkSeal = document.getElementById('dossier-ink-seal');
    const btnContradiction = document.getElementById('btn-flag-contradiction');
    const standardView = document.getElementById('dossier-standard-view');
    const nullView = document.getElementById('dossier-null-view');
    const keypadBox = document.getElementById('dossier-keypad-lock');

    // Ending Choice Buttons
    const btnAccept = document.getElementById('btn-accept-classification');
    const btnReject = document.getElementById('btn-reject-classification');

    drawers.forEach((drawer) => {
      drawer.addEventListener('click', (e) => {
        const drawerKey = e.currentTarget.getAttribute('data-drawer');
        if (!drawerKey) return;

        // If clicking Case Null
        if (drawerKey === 'null') {
          this.activateCaseNull();
          return;
        }

        // Return to standard view if previously viewing null
        if (standardView && nullView) {
          standardView.style.display = 'flex';
          nullView.style.display = 'none';
        }

        // Handle Case 004 Lock
        if (drawerKey === 'sym' && !this.isCaseSymUnlocked) {
          drawers.forEach(d => d.classList.remove('active'));
          e.currentTarget.classList.add('active');
          if (keypadBox) keypadBox.style.display = 'block';
          if (caseBodyEl) caseBodyEl.style.display = 'none';
          if (caseIdEl) caseIdEl.textContent = 'ACCESSION: 004-SYM [LOCKED]';
          if (caseTitleEl) caseTitleEl.textContent = 'RESTRICTED BIOMORPHIC CASE';
          museumAudio.playGlassChime(320, 0.4);
          this.currentDrawerKey = 'sym';
          return;
        }

        // Hide Keypad Lock if opening normal drawer
        if (keypadBox) keypadBox.style.display = 'none';
        if (caseBodyEl) caseBodyEl.style.display = 'block';

        drawers.forEach(d => {
          d.classList.remove('active');
          const pip = d.querySelector('.drawer-pip');
          if (pip) pip.classList.remove('pip-active');
        });

        e.currentTarget.classList.add('active');
        const activePip = e.currentTarget.querySelector('.drawer-pip');
        if (activePip) activePip.classList.add('pip-active');

        museumAudio.playGlassChime(360, 0.4);

        this.currentDrawerKey = drawerKey;
        this.archiveOpenedCount++;
        this.archiveInspectedSet.add(drawerKey);

        this.updateAuditMetrics();
        this.renderDossierContent(drawerKey);

        if (inkSeal) inkSeal.classList.remove('stamped');
      });
    });

    if (btnStamp && inkSeal) {
      btnStamp.addEventListener('click', () => {
        inkSeal.classList.add('stamped');
        museumAudio.playTheoryFailure();
      });
    }

    if (btnContradiction) {
      btnContradiction.addEventListener('click', () => this.flagCurrentContradiction());
    }

    if (btnAccept) {
      btnAccept.addEventListener('click', () => this.handleEndingChoice(true));
    }
    if (btnReject) {
      btnReject.addEventListener('click', () => this.handleEndingChoice(false));
    }

    this.initHoverMutations();
    this.initCursorTelemetry();
    this.bindRedactionClicks();
  }

  renderDossierContent(drawerKey) {
    const caseIdEl = document.getElementById('dossier-case-id');
    const caseTitleEl = document.getElementById('dossier-case-title');
    const caseBodyEl = document.getElementById('dossier-case-body');
    const tagEl = document.getElementById('dossier-contradiction-tag');
    const tagText = document.getElementById('contradiction-tag-text');

    const data = this.dossiers[drawerKey];
    if (!data) return;

    if (caseIdEl) caseIdEl.textContent = data.id;
    if (caseTitleEl) caseTitleEl.textContent = data.title;

    // Use mutated records after sufficient exploration
    const isMutated = this.archiveOpenedCount >= 4;
    if (caseBodyEl) {
      caseBodyEl.innerHTML = isMutated ? data.bodyMutated : data.body;
      this.bindRedactionClicks();
    }

    // Contradiction tag state
    if (tagEl && tagText) {
      if (this.flaggedContradictions.has(drawerKey)) {
        tagEl.style.display = 'inline-flex';
        tagText.textContent = `CONTRADICTION FLAGGED: ${data.contradiction}`;
      } else {
        tagEl.style.display = 'none';
      }
    }
  }

  bindRedactionClicks() {
    const redactedEls = document.querySelectorAll('.redacted-ink');
    const redactCountEl = document.getElementById('archive-redact-count');

    redactedEls.forEach((el) => {
      el.addEventListener('click', () => {
        const secret = el.getAttribute('data-secret');
        if (secret && el.textContent.includes('█')) {
          el.textContent = secret;
          el.classList.add('decrypted');
          this.decryptedRedactions.add(secret);

          museumAudio.playGlassChime(1120, 0.2);

          if (redactCountEl) {
            redactCountEl.textContent = `${this.decryptedRedactions.size} / 4`;
          }

          this.checkEarnedCaseNullUnlock();
        }
      });
    });
  }

  flagCurrentContradiction() {
    const data = this.dossiers[this.currentDrawerKey];
    if (!data) return;

    this.flaggedContradictions.add(this.currentDrawerKey);
    museumAudio.playTheoryFailure();

    const tagEl = document.getElementById('dossier-contradiction-tag');
    const tagText = document.getElementById('contradiction-tag-text');
    const contradictCountEl = document.getElementById('archive-contradict-count');

    if (tagEl && tagText) {
      tagEl.style.display = 'inline-flex';
      tagText.textContent = `CONTRADICTION FLAGGED: ${data.contradiction}`;
    }

    if (contradictCountEl) {
      contradictCountEl.textContent = `${this.flaggedContradictions.size} / 3`;
    }

    this.checkEarnedCaseNullUnlock();
  }

  initKeypadLockSystem() {
    const btnSubmit = document.getElementById('btn-submit-keypad');
    const codeInput = document.getElementById('keypad-code-input');
    const feedback = document.getElementById('keypad-feedback');
    const keypadBox = document.getElementById('dossier-keypad-lock');
    const caseBodyEl = document.getElementById('dossier-case-body');
    const symDrawerLabel = document.getElementById('label-code-sym');

    if (btnSubmit && codeInput) {
      btnSubmit.addEventListener('click', () => {
        const val = codeInput.value.trim();
        if (val === '014' || val === '14') {
          // UNLOCKED!
          this.isCaseSymUnlocked = true;
          museumAudio.playGlassChime(880, 0.8);

          if (feedback) {
            feedback.textContent = 'ACCESS GRANTED: SPECIMEN #014 RECOGNIZED';
            feedback.style.color = 'var(--color-lavender)';
          }

          if (symDrawerLabel) {
            symDrawerLabel.textContent = 'CASE 004-SYM [UNLOCKED]';
          }

          setTimeout(() => {
            if (keypadBox) keypadBox.style.display = 'none';
            if (caseBodyEl) caseBodyEl.style.display = 'block';
            this.renderDossierContent('sym');
            this.archiveInspectedSet.add('sym');
            this.updateAuditMetrics();
            this.checkEarnedCaseNullUnlock();
          }, 800);
        } else {
          // WRONG PASSCODE
          museumAudio.playTheoryFailure();
          if (feedback) {
            feedback.textContent = 'ACCESS DENIED: RECALL THE LIVING SPECIMEN NUMBER FROM EXHIBIT 004';
            feedback.style.color = '#FF7070';
          }
          codeInput.value = '';
          codeInput.focus();
        }
      });
    }
  }

  updateAuditMetrics() {
    const counter = document.getElementById('audit-progress-counter');
    if (counter) {
      counter.textContent = `${this.archiveInspectedSet.size} / 5`;
    }
  }

  checkEarnedCaseNullUnlock() {
    const secretDrawer = document.getElementById('drawer-case-null');
    const progHint = document.getElementById('dossier-progression-hint');

    // Case Null is earned by investigating:
    // 1. Unlocked Case 004 OR explored all 4 exhibits
    // 2. Decrypted at least 1 redaction
    // 3. Flagged at least 1 contradiction
    const isEarned = (this.isCaseSymUnlocked || this.archiveOpenedCount >= 4 || this.archiveInspectedSet.size >= 3) &&
                     (this.decryptedRedactions.size >= 1 || this.flaggedContradictions.size >= 1);

    if (isEarned && !this.isCaseNullUnlocked && secretDrawer) {
      this.isCaseNullUnlocked = true;
      secretDrawer.classList.add('unlocked');
      museumAudio.playSingularityCollapse();

      // Corrupt accessions across the museum
      const codeGrv = document.getElementById('label-code-grv');
      if (codeGrv) codeGrv.textContent = 'ACC // 001-YOU';
      const codeTmp = document.getElementById('label-code-tmp');
      if (codeTmp) codeTmp.textContent = 'ACC // 002-YOU';
      const codeOpt = document.getElementById('label-code-opt');
      if (codeOpt) codeOpt.textContent = 'ACC // 003-YOU';
      const codeSym = document.getElementById('label-code-sym');
      if (codeSym) codeSym.textContent = 'ACC // 004-YOU';

      if (progHint) {
        progHint.textContent = '[CLASSIFIED ACCESSION Ω DETECTED: OPEN CASE NULL]';
        progHint.style.color = 'var(--color-lavender)';
      }
    }
  }

  activateCaseNull() {
    this.isCaseNullActive = true;
    const drawers = document.querySelectorAll('.cabinet-drawer');
    const nullDrawer = document.getElementById('drawer-case-null');
    const standardView = document.getElementById('dossier-standard-view');
    const nullView = document.getElementById('dossier-null-view');
    const idWord = document.getElementById('null-id-word');
    const choiceSection = document.getElementById('null-choice-section');

    drawers.forEach(d => d.classList.remove('active'));
    if (nullDrawer) nullDrawer.classList.add('active');

    // 1. Atmospheric dampening: audio resonance slows, particles quiet
    museumAudio.playSingularityCollapse();

    if (window.worldGridBg && Array.isArray(window.worldGridBg.particles)) {
      window.worldGridBg.particles.forEach(p => {
        p.vx *= 0.15;
        p.vy *= 0.15;
      });
    }

    // 2. Switch views
    if (standardView && nullView) {
      standardView.style.display = 'none';
      nullView.style.display = 'flex';
    }

    // 3. Reset ending choices
    if (choiceSection) choiceSection.style.display = 'flex';
    const outcomeCard = document.getElementById('null-outcome-card');
    if (outcomeCard) outcomeCard.style.display = 'none';

    // 4. Slow monumental reveal of YOU
    if (idWord) {
      idWord.style.opacity = '0';
      idWord.style.transform = 'scale(0.85)';
      idWord.style.transition = 'all 1.6s var(--ease-curatorial)';

      setTimeout(() => {
        idWord.style.opacity = '1';
        idWord.style.transform = 'scale(1)';
        museumAudio.playMonumentalReveal();
        document.body.classList.add('museum-destabilized');
      }, 1200);
    }
  }

  initHoverMutations() {
    const mutateEls = document.querySelectorAll('.null-hover-mutate');
    mutateEls.forEach(el => {
      const orig = el.getAttribute('data-original') || el.textContent;
      el.addEventListener('mouseenter', () => {
        if (orig.includes('Mass')) el.textContent = 'YOUR HAND CARRIED IT';
        else if (orig.includes('Time')) el.textContent = 'YOUR PATIENCE MEASURED TIME';
        else if (orig.includes('Mirrors')) el.textContent = 'YOUR FACE PROVOKED THE GLASS';
        else if (orig.includes('Symmetry')) el.textContent = 'YOUR EMPATHY CHOSE THE FLOWER';
        museumAudio.playGlassChime(1320, 0.1);
      });
      el.addEventListener('mouseleave', () => {
        el.textContent = orig;
      });
    });
  }

  initCursorTelemetry() {
    const coordsEl = document.getElementById('null-cursor-coords');
    const desk = document.querySelector('.dossier-inspection-desk');
    if (!desk || !coordsEl) return;

    desk.addEventListener('mousemove', (e) => {
      if (!this.isCaseNullActive) return;
      const rect = desk.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2);
      coordsEl.textContent = `X: ${x.toFixed(1)} | Y: ${y.toFixed(1)} · VECTOR: ${(angle * 180 / Math.PI).toFixed(0)}°`;
    });
  }

  handleEndingChoice(accepted) {
    this.userClassification = accepted ? 'ACCEPTED' : 'REJECTED';
    const choiceSection = document.getElementById('null-choice-section');
    const outcomeCard = document.getElementById('null-outcome-card');
    const outcomeHeader = document.getElementById('outcome-header-text');
    const outcomeBody = document.getElementById('outcome-body-text');
    const outcomeStatus = document.getElementById('outcome-seal-status');

    if (choiceSection) choiceSection.style.display = 'none';

    if (outcomeCard && outcomeHeader && outcomeBody && outcomeStatus) {
      outcomeCard.style.display = 'flex';

      if (accepted) {
        // ACCEPTED
        museumAudio.playGlassChime(440, 2.5);
        outcomeHeader.textContent = 'STATUS: CLASSIFICATION VOLUNTARILY RATIFIED';
        outcomeBody.innerHTML = `You have consented to being cataloged. The museum was never an archive of broken physics—it is a sanctuary for the conscious observer who brought those contradictions to life. Your presence has been permanently inscribed into accession #000-YOU. The observation is complete.`;
        outcomeStatus.textContent = 'OBSERVER SPECIMEN #000-YOU · CATALOGED IN PERPETUITY';
      } else {
        // REJECTED
        museumAudio.playTheoryFailure();
        outcomeHeader.textContent = 'STATUS: UNCONTAINED ANOMALY · CLASSIFICATION ENFORCED';
        outcomeBody.innerHTML = `Objection noted and overruled. In an observer-governed reality, refusal to be cataloged is itself a primary physical disturbance. You cannot observe a universe without altering it. The museum does not require your permission to record your existence. You remain uncontained, but irrevocably cataloged.`;
        outcomeStatus.textContent = 'OBSERVER SPECIMEN #000-YOU · UNCONTAINED · PERMANENTLY MONITORED';
      }
    }
  }

  switchToVault(vaultId, skipNewton = false, skipBriefing = false) {
    if (this.currentVault === vaultId && this.activeSim) return;

    // Exhibit Briefing requirement: when entering any exhibit (001-004), show briefing first
    if (['vault-1', 'vault-2', 'vault-3', 'vault-4'].includes(vaultId) && !skipBriefing) {
      this.briefingManager.show(vaultId, () => {
        this.switchToVault(vaultId, skipNewton, true);
      });
      return;
    }

    // Trigger Newton Paradox Transition when entering Archive
    if (vaultId === 'archive' && !skipNewton) {
      new NewtonTransition(() => {
        this.switchToVault('archive', true, true);
      }).start();
      return;
    }

    if (this.activeSim && typeof this.activeSim.destroy === 'function') {
      this.activeSim.destroy();
      this.activeSim = null;
    }

    this.currentVault = vaultId;
    museumAudio.playEnterResonance();

    const aperture = document.getElementById('aperture-curtain');
    if (aperture) aperture.classList.remove('active');
    const stage = document.getElementById('cinematic-stage');
    if (stage) stage.classList.remove('title-collapsing');

    if (this.hudVaultNav) {
      if (vaultId === 'threshold') {
        this.hudVaultNav.classList.remove('hud-nav-visible');
      } else {
        this.hudVaultNav.classList.add('hud-nav-visible');
      }
    }

    const allScenes = document.querySelectorAll('.cinematic-scene, .vault-scene');
    allScenes.forEach(s => s.classList.remove('scene-active'));

    this.navPills.forEach(p => {
      if (p.getAttribute('data-vault') === vaultId) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    if (this.hudVaultLabel) {
      const labels = {
        'threshold': 'VITRINE // THRESHOLD',
        'vault-1': '001 // GRAVITY',
        'vault-2': '002 // TIME',
        'vault-3': '003 // OPTICS',
        'vault-4': '004 // SYMMETRY',
        'archive': '005 // ARCHIVE',
        'vault-null': 'ACCESSION NULL // OBSERVATORY OF YOU'
      };
      this.hudVaultLabel.textContent = labels[vaultId] || 'CLASSIFIED SECTOR';
    }

    // Activate selected scene
    if (vaultId === 'threshold') {
      const s = document.getElementById('scene-threshold');
      if (s) s.classList.add('scene-active');
    } else if (vaultId === 'vault-1') {
      const s = document.getElementById('scene-vault-1');
      if (s) {
        s.classList.add('scene-active');
        this.activeSim = new ExhibitGravity(s, () => {
          this.archiveOpenedCount++;
        });
      }
    } else if (vaultId === 'vault-2') {
      const s = document.getElementById('scene-vault-2');
      if (s) {
        s.classList.add('scene-active');
        this.activeSim = new ExhibitPendulum(s, () => {
          this.archiveOpenedCount++;
        });
      }
    } else if (vaultId === 'vault-3') {
      const s = document.getElementById('scene-vault-3');
      if (s) {
        s.classList.add('scene-active');
        this.activeSim = new ExhibitReflections(s, () => {
          this.archiveOpenedCount++;
        });
      }
    } else if (vaultId === 'vault-4') {
      const s = document.getElementById('scene-vault-4');
      if (s) {
        s.classList.add('scene-active');
        this.activeSim = new ExhibitGarden(s, () => {
          this.archiveOpenedCount++;
        });
      }
    } else if (vaultId === 'archive') {
      const s = document.getElementById('scene-vault-archive');
      if (s) s.classList.add('scene-active');
    } else if (vaultId === 'vault-null') {
      const s = document.getElementById('scene-vault-null');
      if (s) {
        s.classList.add('scene-active');
        this.activeSim = new ExhibitNull(s, () => {
          this.archiveOpenedCount++;
        });
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
