/**
 * The Museum of Incorrect Physics
 * Vault Coordinator & Architectural Stage Manager
 */

import { museumAudio } from '../audio.js';
import { ExhibitGravity } from './exhibit-gravity.js';
import { ExhibitPendulum } from './exhibit-pendulum.js';
import { ExhibitReflections } from './exhibit-reflections.js';
import { ExhibitGarden } from './exhibit-garden.js';

export class VaultManager {
  constructor() {
    this.currentVault = 'threshold'; // 'threshold' | 'vault-1' | 'vault-2' | 'vault-3' | 'vault-4' | 'archive'
    this.activeSim = null;

    this.navPills = document.querySelectorAll('.vault-pill');
    this.hudVaultLabel = document.getElementById('hud-current-vault-label');

    this.init();
  }

  init() {
    // Connect Vault Switcher Pills in HUD
    this.navPills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        const vaultId = e.currentTarget.getAttribute('data-vault');
        if (vaultId) this.switchToVault(vaultId);
      });
    });

    // Keyboard Navigation for Quick Examination: 0, 1, 2, 3, 4, A
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === '0') this.switchToVault('threshold');
      if (e.key === '1') this.switchToVault('vault-1');
      if (e.key === '2') this.switchToVault('vault-2');
      if (e.key === '3') this.switchToVault('vault-3');
      if (e.key === '4') this.switchToVault('vault-4');
      if (e.key === 'a' || e.key === 'A') this.switchToVault('archive');
    });

    // Internal Next-Vault Advance Buttons
    this.bindAdvanceButtons();
  }

  bindAdvanceButtons() {
    // Gateway from Threshold into Vault 1
    const btnCross = document.getElementById('btn-cross-threshold');
    if (btnCross) {
      btnCross.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchToVault('vault-1');
      });
    }

    // Vault 1 -> Vault 2
    const btnToVault2 = document.getElementById('btn-to-vault-2');
    if (btnToVault2) {
      btnToVault2.addEventListener('click', () => this.switchToVault('vault-2'));
    }

    // Vault 2 -> Vault 3
    const btnToVault3 = document.getElementById('btn-to-vault-3');
    if (btnToVault3) {
      btnToVault3.addEventListener('click', () => this.switchToVault('vault-3'));
    }

    // Vault 3 -> Vault 4
    const btnToVault4 = document.getElementById('btn-to-vault-4');
    if (btnToVault4) {
      btnToVault4.addEventListener('click', () => this.switchToVault('vault-4'));
    }

    // Vault 4 -> Archive
    const btnToArchive = document.getElementById('btn-to-archive');
    if (btnToArchive) {
      btnToArchive.addEventListener('click', () => this.switchToVault('archive'));
    }

    // Archive Return to Vitrine
    const btnRestart = document.getElementById('btn-archive-restart');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => this.switchToVault('threshold'));
    }
  }

  switchToVault(vaultId) {
    if (this.currentVault === vaultId && this.activeSim) return;

    // 1. Destroy Current Running Simulation
    if (this.activeSim && typeof this.activeSim.destroy === 'function') {
      this.activeSim.destroy();
      this.activeSim = null;
    }

    this.currentVault = vaultId;
    museumAudio.playEnterResonance();

    // 2. Hide all Vault Sections
    const allScenes = document.querySelectorAll('.cinematic-scene, .vault-scene');
    allScenes.forEach(s => s.classList.remove('scene-active'));

    // 3. Update HUD Pills
    this.navPills.forEach(p => {
      if (p.getAttribute('data-vault') === vaultId) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    // 4. Activate Selected Vault & Mount Simulation
    switch (vaultId) {
      case 'threshold': {
        const threshold = document.getElementById('scene-6-threshold');
        if (threshold) threshold.classList.add('scene-active');
        if (this.hudVaultLabel) this.hudVaultLabel.textContent = 'EXHIBIT 000 // ANOMALY VITRINE';
        break;
      }

      case 'vault-1': {
        const v1 = document.getElementById('scene-vault-1');
        if (v1) {
          v1.classList.add('scene-active');
          this.activeSim = new ExhibitGravity(v1, () => {
            const nextBtn = v1.querySelector('#btn-to-vault-2');
            if (nextBtn) nextBtn.classList.add('visible');
          });
        }
        if (this.hudVaultLabel) this.hudVaultLabel.textContent = 'EXHIBIT 001 // GRAVITY';
        break;
      }

      case 'vault-2': {
        const v2 = document.getElementById('scene-vault-2');
        if (v2) {
          v2.classList.add('scene-active');
          this.activeSim = new ExhibitPendulum(v2, () => {
            const nextBtn = v2.querySelector('#btn-to-vault-3');
            if (nextBtn) nextBtn.classList.add('visible');
          });
        }
        if (this.hudVaultLabel) this.hudVaultLabel.textContent = 'EXHIBIT 002 // TIME';
        break;
      }

      case 'vault-3': {
        const v3 = document.getElementById('scene-vault-3');
        if (v3) {
          v3.classList.add('scene-active');
          this.activeSim = new ExhibitReflections(v3, () => {
            const nextBtn = v3.querySelector('#btn-to-vault-4');
            if (nextBtn) nextBtn.classList.add('visible');
          });
        }
        if (this.hudVaultLabel) this.hudVaultLabel.textContent = 'EXHIBIT 003 // OPTICS';
        break;
      }

      case 'vault-4': {
        const v4 = document.getElementById('scene-vault-4');
        if (v4) {
          v4.classList.add('scene-active');
          this.activeSim = new ExhibitGarden(v4, () => {
            const nextBtn = v4.querySelector('#btn-to-archive');
            if (nextBtn) nextBtn.classList.add('visible');
          });
        }
        if (this.hudVaultLabel) this.hudVaultLabel.textContent = 'EXHIBIT 004 // SYMMETRY';
        break;
      }

      case 'archive': {
        const arch = document.getElementById('scene-vault-archive');
        if (arch) arch.classList.add('scene-active');
        if (this.hudVaultLabel) this.hudVaultLabel.textContent = 'CURATORIAL ARCHIVE // REGISTRY';
        break;
      }
    }

    const liveRegion = document.getElementById('live-region');
    if (liveRegion && this.hudVaultLabel) {
      liveRegion.textContent = `Entered ${this.hudVaultLabel.textContent}.`;
    }
  }
}
