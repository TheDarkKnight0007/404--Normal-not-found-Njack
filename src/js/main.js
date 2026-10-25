/**
 * The Museum of Incorrect Physics
 * Main Entry Point — Pure Vanilla JavaScript
 */

import { MuseumPrologue } from './prologue.js';
import { VaultManager } from './exhibits/vault-manager.js';
import { RealityIntrusionEngine } from './reality-intrusion.js';
import { ImpossibleMomentsEngine } from './impossible-moments.js';

document.addEventListener('DOMContentLoaded', () => {
  const realityEngine = new RealityIntrusionEngine();
  const impossibleEngine = new ImpossibleMomentsEngine();
  const prologue = new MuseumPrologue();
  const vaultManager = new VaultManager();

  window.museumVaultManager = vaultManager;
  window.realityIntrusionEngine = realityEngine;
  window.impossibleMomentsEngine = impossibleEngine;
});
