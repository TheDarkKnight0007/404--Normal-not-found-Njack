/**
 * The Museum of Incorrect Physics
 * Procedural Web Audio Engine (Cinematic Short Film Grade)
 */

class MuseumAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.droneGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.droneFilter = null;
    this.isDroneRunning = false;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  startAmbientDrone() {
    if (this.isMuted || this.isDroneRunning) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.0001, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.09, now + 4);

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(110, now);

      // Deep sub-harmonic drone (43.65 Hz - F1 / cosmic hum)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(43.65, now);

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(43.95, now); // acoustic binaural beating

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.isDroneRunning = true;
    } catch {
      // Fallback
    }
  }

  freezeForVacuum(duration = 3.0) {
    if (!this.ctx || !this.droneGain) return;
    try {
      const now = this.ctx.currentTime;
      this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
      this.droneGain.gain.linearRampToValueAtTime(0.00001, now + 0.05);

      setTimeout(() => {
        if (!this.isMuted && this.ctx && this.droneGain) {
          const resumeTime = this.ctx.currentTime;
          this.droneGain.gain.setValueAtTime(0.0001, resumeTime);
          this.droneGain.gain.exponentialRampToValueAtTime(0.08, resumeTime + 2.0);
        }
      }, duration * 1000);
    } catch {
      // Fallback
    }
  }

  playInvertedWind() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Synthesized soft noise wind
      const bufferSize = this.ctx.sampleRate * 2.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.2;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(180, now);
      filter.frequency.exponentialRampToValueAtTime(480, now + 1.2);
      filter.frequency.exponentialRampToValueAtTime(140, now + 2.5);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch {
      // Fallback
    }
  }

  playGlassChime(freq = 1174.66, duration = 2.4) {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + duration + 0.1);
    } catch {
      // Fallback
    }
  }

  playFailurePulse() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Heavy low frequency impact + descending portamento
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(75, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 1.5);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 1.7);
    } catch {
      // Fallback
    }
  }

  playLetterArrival(freq = 880) {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.09);
    } catch {
      // Fallback
    }
  }

  playMonumentalReveal() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [65.41, 98.0, 130.81, 196.0, 261.63, 392.0];

      freqs.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.09 / (i + 1), now + 0.25 + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(now + 4.5);
      });
    } catch {
      // Fallback
    }
  }

  playEnterResonance() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [55, 110, 165, 220, 440];

      freqs.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.exponentialRampToValueAtTime(f * 0.98, now + 3);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12 / (i + 1), now + 0.1 + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(now + 3.0);
      });
    } catch {
      // Fallback
    }
  }

  playMeshHum(freq = 140, intensity = 0.5) {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(Math.min(0.08, 0.04 * intensity), now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.45);
    } catch {
      // Fallback
    }
  }

  playMeshTear() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // High-tension string snap sound
      const freqs = [1860, 2480, 3120];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + idx * 0.04);
        osc.frequency.exponentialRampToValueAtTime(f * 0.4, now + 0.25 + idx * 0.04);

        gain.gain.setValueAtTime(0.001, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.05 / (idx + 1), now + idx * 0.04 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28 + idx * 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + 0.35 + idx * 0.04);
      });
    } catch {
      // Fallback
    }
  }

  playOrderCollapse() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Inward descending gravitational sink
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(36, now + 1.6);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(90, now + 1.6);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.14, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 1.9);
    } catch {
      // Fallback
    }
  }

  playSingularitySuck() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 1.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(60, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 1.2);
      filter.frequency.exponentialRampToValueAtTime(80, now + 1.8);
      filter.Q.setValueAtTime(8, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // Fallback
    }
  }

  playTheoryAccumulation() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Rising harmonic tension
      const freqs = [110, 220, 330, 440, 550, 660];
      freqs.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.exponentialRampToValueAtTime(f * 1.35, now + 2.2);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.04 / (i + 1), now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(now + 2.5);
      });
    } catch {
      // Fallback
    }
  }

  playTheoryFailure() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // 1. Sudden vacuum silence/drop, then massive detonation
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(24, now + 2.2);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55, now);
      osc2.frequency.exponentialRampToValueAtTime(18, now + 2.5);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, now);
      filter.frequency.exponentialRampToValueAtTime(60, now + 2.2);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.24, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc2.start();
      osc.stop(now + 2.9);
      osc2.stop(now + 2.9);
    } catch {
      // Fallback
    }
  }

  playSphereAscent() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 1.8);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 2.3);
    } catch {
      // Fallback
    }
  playGravityStrain(ratio = 0.5) {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(35 + ratio * 45, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08 * Math.min(1.0, ratio), now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.45);
    } catch {
      // Fallback
    }
  }

  playPendulumWhoosh(speed = 1.0) {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140 + speed * 60, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.6);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.7);
    } catch {
      // Fallback
    }
  }

  playMirrorRefract() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [880, 1174, 1318].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.05);
        gain.gain.setValueAtTime(0.001, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.04, now + i * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 1.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 1.3);
      });
    } catch {
      // Fallback
    }
  }

  playBloomChord() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // D Major warm harmonic chord
      [293.66, 369.99, 440.00, 587.33, 739.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.08 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 3.0);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 3.2);
      });
    } catch {
      // Fallback
    }
  }
}

export const museumAudio = new MuseumAudioEngine();
