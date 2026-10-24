/**
 * The Museum of Incorrect Physics
 * Continuous Einstein Spacetime Mesh & Exhibition Stage Coordinator
 */

import { museumAudio } from './audio.js';
import { WorldGridBg } from './grid-bg.js';
import { ImpossibleSphereSim } from './sphere-sim.js';

export class MuseumPrologue {
  constructor() {
    this.stageContainer = document.getElementById('cinematic-stage');
    this.skipBtn = document.getElementById('btn-skip-prologue');
    this.audioToggle = document.getElementById('btn-audio-toggle');
    this.sphereSim = null;
    this.gridBg = null;

    this.isSkipped = false;
    this.hasRevealedThreshold = false;

    this.init();
  }

  init() {
    window.museumAudio = museumAudio;

    const bgCanvas = document.getElementById('viewport-canvas-bg');
    if (bgCanvas) {
      this.gridBg = new WorldGridBg(bgCanvas);
      window.worldGridBg = this.gridBg;
    }

    // Audio interaction unlock
    const unlockAudio = () => {
      museumAudio.ensureContext();
      museumAudio.startAmbientDrone();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('mousemove', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('mousemove', unlockAudio);

    if (this.audioToggle) {
      this.audioToggle.addEventListener('click', () => {
        museumAudio.isMuted = !museumAudio.isMuted;
        this.audioToggle.textContent = museumAudio.isMuted ? 'AUDIO: MUTED' : 'AUDIO: OPERATIONAL';
        if (!museumAudio.isMuted) {
          museumAudio.startAmbientDrone();
        }
      });
    }

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => this.jumpToThreshold());
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.jumpToThreshold();
      }
    });

    this.setupCursor();

    // Start with 100% black screen, zero UI, pure void
    document.body.classList.add('opening-film-mode');
    this.setSceneVisibility('scene-1-void');

    if (this.gridBg) {
      this.gridBg.startOpeningSequence();
    }

    // Monitor for continuous transition into the Title / Threshold
    this.monitorPhaseTransition();
  }

  setupCursor() {
    const ring = document.getElementById('curatorial-cursor');
    const dot = document.getElementById('curatorial-cursor-dot');
    if (!ring || !dot) return;

    window.addEventListener('mousemove', (e) => {
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    }, { passive: true });

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('button, a, canvas, [role="button"]')) {
        document.body.classList.add('cursor-hover-active');
      } else {
        document.body.classList.remove('cursor-hover-active');
      }
    });
  }

  monitorPhaseTransition() {
    const checkInterval = setInterval(() => {
      if (!this.gridBg) return;

      if ((this.gridBg.phase === 'TITLE_ACTIVE' || this.gridBg.phase === 'TITLE_REVEAL' || this.gridBg.phase === 'HALL_UNFOLD') && !this.hasRevealedThreshold) {
        this.hasRevealedThreshold = true;
        clearInterval(checkInterval);
        this.mountThreshold();
      }
    }, 100);
  }

  jumpToThreshold() {
    this.isSkipped = true;
    museumAudio.ensureContext();
    museumAudio.startAmbientDrone();

    if (this.gridBg) {
      this.gridBg.skipToThreshold();
    }
    this.mountThreshold();
  }

  mountThreshold() {
    this.setSceneVisibility('scene-6-threshold');
    document.body.classList.remove('opening-film-mode');

    if (this.skipBtn) {
      this.skipBtn.style.display = 'none';
    }

    const sphereCanvas = document.getElementById('sphere-canvas-interactive');
    const specStatus = document.getElementById('spec-gravity-status');
    if (sphereCanvas && specStatus && !this.sphereSim) {
      this.sphereSim = new ImpossibleSphereSim(sphereCanvas, specStatus);
    }

    const btnCross = document.getElementById('btn-cross-threshold');
    if (btnCross) {
      btnCross.addEventListener('click', (e) => {
        e.preventDefault();
        this.triggerTitleToHallTransformation();
      });
      btnCross.addEventListener('mouseenter', () => {
        museumAudio.playGlassChime(659.25, 0.4);
      });
      // Inverted physical law: repulsive gravitational mass causes button to tilt away from pointer
      btnCross.addEventListener('mousemove', (e) => {
        const rect = btnCross.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        btnCross.style.transform = `translateY(-4px) perspective(400px) rotateX(${-py * 18}deg) rotateY(${px * 18}deg)`;
      });
      btnCross.addEventListener('mouseleave', () => {
        btnCross.style.transform = '';
      });
    }

    window.addEventListener('keydown', (e) => {
      if ((e.code === 'KeyE' || e.code === 'Enter') && !e.metaKey && !e.ctrlKey) {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
        this.triggerTitleToHallTransformation();
      }
    });

    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = 'Reality destabilization complete. You stand at the Anomaly Vitrine threshold.';
    }
  }

  // =========================================================================
  // TITLE TO HALL TRANSFORMATION
  // Title collapses into geometry, geometry unfolds into 3D architecture
  // =========================================================================
  triggerTitleToHallTransformation() {
    const stage = document.getElementById('cinematic-stage');
    if (stage) stage.classList.add('title-collapsing');

    museumAudio.playEnterResonance();

    if (this.gridBg) {
      this.gridBg.triggerShockwave(window.innerWidth / 2, window.innerHeight / 2);
      this.gridBg.startHallUnfold(() => {
        const aperture = document.getElementById('aperture-curtain');
        if (aperture) {
          aperture.classList.add('active');
        }
      });
    } else {
      const aperture = document.getElementById('aperture-curtain');
      if (aperture) aperture.classList.add('active');
    }

    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = 'Typography collapsed into architectural geometry. Entering Exhibition Hall.';
    }

    const btnReturn = document.getElementById('btn-chamber-return');
    if (btnReturn) {
      btnReturn.addEventListener('click', () => {
        const aperture = document.getElementById('aperture-curtain');
        if (aperture) aperture.classList.remove('active');
        if (stage) stage.classList.remove('title-collapsing');
        museumAudio.playGlassChime(330, 0.6);
      });
    }
  }

  setSceneVisibility(activeSceneId) {
    const allScenes = document.querySelectorAll('.cinematic-scene');
    allScenes.forEach(scene => {
      if (scene.id === activeSceneId) {
        scene.classList.add('scene-active');
      } else {
        scene.classList.remove('scene-active');
      }
    });
  }
}
