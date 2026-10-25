/**
 * The Museum of Incorrect Physics
 * Museum Memory & Curiosity Discovery Engine
 * 
 * Philosophy:
 * "The museum should remember previous actions.
 * Do not store scores. Store discoveries.
 * Reward curiosity, not completion.
 * The museum should feel alive."
 */

import { museumAudio } from './audio.js';

class MuseumMemoryStore {
  constructor() {
    // Persistent Discovery Registry (in-memory per session)
    this.discoveries = {
      // Exhibit 001: Gravity
      massLocated: false,
      massTriangulatedWithScanners: false,
      massCollapsed: false,

      // Exhibit 002: Time
      clockMistakes: [],
      clockPausedCount: 0,
      trueClockFound: false,

      // Exhibit 003: Optics
      testedMirrors: [],
      trustedWrongMirror: null,
      mirrorSecretRevealed: false,
      allMirrorsShattered: false,

      // Exhibit 004: Symmetry
      scannedFlowersCount: 0,
      livingFlowerDiscovered: false,
      flowerDecision: null, // 'PRESERVED' | 'DESTROYED'

      // Vitrine
      vitrinePerturbed: false,

      // Hidden Curiosity Discoveries (Rewarding patience and exploration)
      observedShadowLong: false,
      caughtRogueParticle: false,
      clickedMutatingMeasurement: 0,
      observedLogoClosing: false,
      staredAtReflectionStationary: false,
      shookNewtonTree: false
    };

    // Unlocked Curatorial Marginalia (Unlocked through curiosity)
    this.unlockedNotes = [];

    this.listeners = new Set();
  }

  record(key, value = true) {
    if (this.discoveries[key] === value) return;
    this.discoveries[key] = value;
    this.notify();
  }

  recordArrayItem(key, item) {
    if (Array.isArray(this.discoveries[key])) {
      if (!this.discoveries[key].includes(item)) {
        this.discoveries[key].push(item);
        this.notify();
      }
    }
  }

  unlockCuriosityNote(id, title, text) {
    if (this.unlockedNotes.some(n => n.id === id)) return;
    this.unlockedNotes.push({ id, title, text, timestamp: new Date().toLocaleTimeString() });

    museumAudio.playGlassChime(1560, 0.4);
    this.showCuriosityToast(title, text);
    this.notify();
  }

  showCuriosityToast(title, text) {
    let toast = document.getElementById('curiosity-discovery-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'curiosity-discovery-toast';
      toast.className = 'curiosity-discovery-toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <div class="toast-indicator">✦ ANOMALY NOTED BY ARCHIVE</div>
      <div class="toast-title">${title}</div>
      <div class="toast-body">${text}</div>
    `;

    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 4500);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(this.discoveries, this.unlockedNotes); } catch { /* Ignore */ }
    });
    this.updateDynamicPlaques();
  }

  /**
   * Memory Echoes: Updates environmental plaques based on prior actions!
   */
  updateDynamicPlaques() {
    // 1. If visitor collapsed singularity in Exhibit 001 -> plaque in Exhibit 002 reacts
    const pSub = document.querySelector('#scene-vault-2 .vault-sub-badge');
    if (pSub && this.discoveries.massCollapsed) {
      pSub.textContent = 'CHRONOMETRIC ANOMALY // GRAVITATIONAL WAKE RECORDED FROM ACCESSION 001';
      pSub.style.color = 'var(--color-lavender)';
    }

    // 2. If visitor trusted the wrong mirror in Exhibit 003 -> reflection whisper mocks choice
    const rWhisper = document.getElementById('reflections-whisper');
    if (rWhisper && this.discoveries.trustedWrongMirror) {
      const wrong = this.discoveries.trustedWrongMirror.toUpperCase();
      rWhisper.textContent = `MEMORY: YOU INITIALLY TRUSTED ${wrong} BEFORE REALIZING IT WAS LEADING YOU.`;
    }

    // 3. If visitor chose flower fate in Exhibit 004 -> archive document cites decision
    const caseSymBody = document.getElementById('dossier-case-body');
    if (caseSymBody && this.discoveries.flowerDecision) {
      const decisionNote = document.getElementById('dossier-memory-echo');
      if (!decisionNote) {
        const p = document.createElement('p');
        p.id = 'dossier-memory-echo';
        p.className = 'dossier-note dossier-memory-echo';
        p.innerHTML = `<strong>CURATORIAL RECORD OF OBSERVER:</strong> You decided to <em>${this.discoveries.flowerDecision}</em> Specimen #014. The archive has registered your moral divergence into permanent law.`;
        caseSymBody.appendChild(p);
      }
    }
  }
}

export const museumMemory = new MuseumMemoryStore();
window.museumMemory = museumMemory;
