/**
 * The Museum of Incorrect Physics
 * Einstein Spacetime Web & Inverted Gravitational Dust Typography Engine
 * 
 * Locked Color Identity (Zero Cyan):
 * - Dark Obsidian / Blue-Black: #080b17 / #0d1020
 * - Electric Lavender: #B5A3FF
 * - Radiant Purple / Deep Violet: #9588FF / #6E5AE8
 * - Archival Text: #F5F1E8
 * 
 * Experience Architecture:
 * 1. Einstein Spacetime Web (Curvilinear Geodesics & Abnormal Cursor Contraction)
 * 2. Inverted Gravity Disintegration (Web breaks into Planck dust accelerating upward)
 * 3. Exactly 3 Sentences with Smooth Particle Dissolution (No sudden word pop-outs):
 *    - "Every system seeks order."
 *    - "At least, that was the theory."
 *    - "Some things refuse to behave."
 * 4. Micro-Disintegration Hover (Hovering cursor breaks local particle bonds; they drift upward & reform)
 * 5. Physics-Defying Title:
 *    - "INCORRECT" has impossible negative-gravity glyph lift and upward-falling shadow.
 *    - "PHYSICS" undulates with zero-G superfluid buoyant wave motion.
 */

import { museumAudio } from './audio.js';

export class WorldGridBg {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Palette Constants (Zero Cyan)
    this.COLOR_BG = '#080b17';
    this.COLOR_LAVENDER = '#B5A3FF';
    this.COLOR_PURPLE = '#9588FF';
    this.COLOR_PURPLE_DEEP = '#6E5AE8';
    this.COLOR_TEXT = '#F5F1E8';

    // State Machine
    // 'SPACETIME_WEB' -> 'WEB_DISINTEGRATION' -> 'SENTENCE_1' -> 'SENTENCE_2' -> 'SENTENCE_3' -> 'TITLE_FORMATION' -> 'TITLE_ACTIVE'
    this.phase = 'SPACETIME_WEB';
    this.time = 0;
    this.phaseTime = 0;
    this.isSkipped = false;

    // Pointer Tracking
    this.mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      vx: 0,
      vy: 0,
      isOver: false
    };

    // Einstein Spacetime Mesh Topology (64 cols x 42 rows)
    this.cols = 64;
    this.rows = 42;
    this.nodes = [];
    this.meshAlpha = 0;

    // Dust Particles (Minute Planck Flecks)
    this.particles = [];
    this.maxParticles = 2400;

    // Offscreen Text Sampler
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCtx = this.offscreenCanvas.getContext('2d', { willReadFrequently: true });

    // Shockwaves
    this.shockwaves = [];

    // Current Sentence Data
    this.currentSentenceIdx = 0;
    this.sentences = [
      'Every system seeks order.',
      'At least, that was the theory.',
      'Some things refuse to behave.'
    ];
    this.sentenceData = null;

    // Hall Unfolding
    this.hallUnfolding = false;
    this.hallUnfoldProgress = 0;

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    window.addEventListener('mousemove', (e) => this.onPointerMove(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      this.mouse.isOver = false;
    });

    this.buildSpacetimeMesh();

    // Start Animation Loop
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.offscreenCanvas.width = this.width;
    this.offscreenCanvas.height = this.height;

    if (this.nodes.length === 0) {
      this.buildSpacetimeMesh();
    }
  }

  onPointerMove(clientX, clientY) {
    this.mouse.vx = clientX - (this.mouse.prevX || clientX);
    this.mouse.vy = clientY - (this.mouse.prevY || clientY);
    this.mouse.prevX = this.mouse.x;
    this.mouse.prevY = this.mouse.y;
    this.mouse.x = clientX;
    this.mouse.y = clientY;
    this.mouse.isOver = true;

    if (this.phase === 'SPACETIME_WEB') {
      const speed = Math.hypot(this.mouse.vx, this.mouse.vy);
      if (speed > 4 && Math.random() < 0.2) {
        museumAudio.playMeshHum(110 + Math.min(speed * 4, 180), Math.min(1.0, speed / 14));
      }
    }
  }

  // =========================================================================
  // 1. EINSTEIN SPACETIME WEB BUILDER (Curvilinear Geodesics & Relativistic Depth)
  // =========================================================================
  buildSpacetimeMesh() {
    this.nodes = [];
    const meshWidth = Math.max(this.width * 1.5, 1800);
    const meshDepth = Math.max(this.height * 2.5, 2000);
    const startX = -meshWidth / 2;
    const startZ = -meshDepth / 2;
    const stepX = meshWidth / (this.cols - 1);
    const stepZ = meshDepth / (this.rows - 1);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x0 = startX + c * stepX;
        const z0 = startZ + r * stepZ;
        const distFromCenter = Math.hypot(x0, z0);

        // Einsteinian natural spacetime curvature: subtle gravitational depression in fabric
        const naturalCurvature = -65 * Math.exp(-Math.pow(distFromCenter / 700, 2));

        this.nodes.push({
          c,
          r,
          x0,
          y0: naturalCurvature,
          z0,
          x: x0,
          y: naturalCurvature,
          z: z0,
          vx: 0,
          vy: 0,
          vz: 0,
          dispX: 0,
          dispY: 0,
          elevation: naturalCurvature,
          sx: 0,
          sy: 0,
          scale: 1,
          rotZ: 0
        });
      }
    }
  }

  project3D(x, y, z) {
    const fov = 860;
    const cameraY = -340;
    const cameraZ = -820;
    const pitch = 1.15; // ~66° deep cinematic perspective

    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);

    const relY = y - cameraY;
    const relZ = z - cameraZ;

    const rotY = relY * cosP - relZ * sinP;
    const rotZ = relY * sinP + relZ * cosP;

    const scale = fov / (rotZ + fov);
    const sx = this.width / 2 + x * scale;
    const sy = this.height / 2 + rotY * scale + 20;

    return { sx, sy, scale, rotZ };
  }

  startOpeningSequence() {
    this.phase = 'SPACETIME_WEB';
    this.phaseTime = 0;
    this.meshAlpha = 0;
    museumAudio.playGlassChime(440, 2.5);
  }

  skipToThreshold() {
    this.isSkipped = true;
    this.phase = 'TITLE_ACTIVE';
    this.meshAlpha = 0;
    this.particles = [];
    document.body.classList.remove('opening-film-mode');
    document.body.classList.remove('reality-shudder');
    document.body.classList.remove('vacuum-freeze');

    const thresholdScene = document.getElementById('scene-6-threshold');
    if (thresholdScene) thresholdScene.classList.add('scene-active');
  }

  // =========================================================================
  // 2. DISINTEGRATION INTO INVERTED DUST PARTICLES
  // =========================================================================
  disintegrateMeshToInvertedDust() {
    this.particles = [];
    const stride = 1; // Take nodes to form thousands of minute dust flecks
    const totalNodes = this.nodes.length;

    for (let i = 0; i < totalNodes; i += stride) {
      const n = this.nodes[i];
      // Start at projected screen position
      this.particles.push({
        id: i,
        x: n.sx + (Math.random() - 0.5) * 6,
        y: n.sy + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 2.2,
        // Inverted gravity: starts with small upward drift, accelerates upward
        vy: -0.6 - Math.random() * 1.8,
        targetX: n.sx,
        targetY: n.sy,
        alpha: 0.8 + Math.random() * 0.2,
        radius: 0.85 + Math.random() * 1.1, // Minute Planck dust
        baseColor: Math.random() < 0.35 ? this.COLOR_LAVENDER : (Math.random() < 0.65 ? this.COLOR_PURPLE : this.COLOR_TEXT),
        color: this.COLOR_LAVENDER,
        isDispersed: false,
        disperseTime: 0
      });
      if (this.particles.length >= this.maxParticles) break;
    }
  }

  // =========================================================================
  // 3. TEXT TARGET SAMPLING (Offscreen Canvas)
  // =========================================================================
  prepareSentence(sentenceText) {
    const isMobile = this.width < 768;
    const fontSize = isMobile ? Math.floor(Math.min(this.width * 0.08, 42)) : Math.floor(Math.min(this.width * 0.052, 72));
    const centerY = this.height * 0.48;

    const ctx = this.offscreenCtx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `600 ${fontSize}px "Playfair Display", Georgia, serif`;

    let lines = [sentenceText];
    if (isMobile && sentenceText.length > 20) {
      const mid = sentenceText.lastIndexOf(' ', Math.floor(sentenceText.length / 2));
      if (mid > 0) {
        lines = [sentenceText.slice(0, mid), sentenceText.slice(mid + 1)];
      }
    }

    const lineHeight = fontSize * 1.25;
    const totalH = lines.length * lineHeight;
    const startY = centerY - totalH / 2 + lineHeight / 2;

    lines.forEach((line, idx) => {
      ctx.fillText(line, w / 2, startY + idx * lineHeight);
    });

    const imgData = ctx.getImageData(0, 0, w, h).data;
    const sampledPoints = [];
    const step = isMobile ? 3 : 4;

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const index = (y * w + x) * 4;
        const alpha = imgData[index + 3];
        if (alpha > 120) {
          sampledPoints.push({
            x: x + (Math.random() - 0.5) * 1.5,
            y: y + (Math.random() - 0.5) * 1.5
          });
        }
      }
    }

    // Assign target coordinates to dust particles
    if (sampledPoints.length > 0) {
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        const t = sampledPoints[i % sampledPoints.length];
        p.targetX = t.x;
        p.targetY = t.y;
        p.isDispersed = false;
      }
    }

    this.sentenceData = {
      text: sentenceText,
      lines,
      fontSize,
      centerY,
      startY,
      lineHeight,
      sampledPoints
    };
  }

  // =========================================================================
  // 4. GRAVITATIONAL LENSING SINGULARITY TARGETS (COSMIC ACCRETION RING)
  // Replaces particle letters with an impossible relativistic geodesic ring
  // =========================================================================
  prepareSingularityTargets() {
    const isMobile = this.width < 768;
    const w = this.width;
    const h = this.height;

    // Center of gravitational anomaly (aligned with future vitrine location)
    const cx = isMobile ? w * 0.5 : w * 0.70;
    const cy = h * 0.50;

    const sampledPoints = [];
    const ringCount = 6;
    const baseRadius = isMobile ? 80 : 130;

    for (let ring = 0; ring < ringCount; ring++) {
      const radius = baseRadius + ring * (isMobile ? 18 : 28);
      const pointsInRing = Math.floor(60 + ring * 35);

      for (let p = 0; p < pointsInRing; p++) {
        const theta = (p / pointsInRing) * Math.PI * 2;
        // Relativistic spiral perturbation
        const rPerturbed = radius + Math.sin(theta * 3 + ring) * 12;
        sampledPoints.push({
          x: cx + Math.cos(theta) * rPerturbed,
          y: cy + Math.sin(theta) * rPerturbed * 0.72 // Projected orbital incline
        });
      }
    }

    // Assign targets to particles
    if (sampledPoints.length > 0) {
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        const t = sampledPoints[i % sampledPoints.length];
        p.targetX = t.x;
        p.targetY = t.y;
        p.isDispersed = false;
      }
    }
  }

  // =========================================================================
  // 5. UPDATE CYCLE & STATE TIMING
  // =========================================================================
  update(dt) {
    this.time += dt;
    this.phaseTime += dt;

    // Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed;
      sw.intensity = 1.0 - (sw.radius / sw.maxRadius);
      if (sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
      }
    }

    switch (this.phase) {
      // PHASE 1: Einstein Spacetime Web with Abnormal Cursor Contraction
      case 'SPACETIME_WEB': {
        this.meshAlpha = Math.min(1.0, this.phaseTime / 1.2);
        this.updateSpacetimeMesh();

        // 4.0 seconds for user to play with and experience the negative-gravity contraction
        if (this.phaseTime >= 4.2) {
          this.phase = 'WEB_DISINTEGRATION';
          this.phaseTime = 0;
          museumAudio.playMeshTear();
          this.disintegrateMeshToInvertedDust();
          this.triggerShockwave(this.width / 2, this.height * 0.5);
        }
        break;
      }

      // PHASE 2: Inverted Gravity Evaporation (Falling upwards)
      case 'WEB_DISINTEGRATION': {
        this.meshAlpha = Math.max(0, 1.0 - this.phaseTime / 0.8);
        this.updateInvertedDustEvaporation(dt);

        if (this.phaseTime >= 1.6) {
          this.phase = 'SENTENCE_1';
          this.phaseTime = 0;
          this.prepareSentence(this.sentences[0]);
          museumAudio.playInvertedWind();
        }
        break;
      }

      // PHASE 3: Sentence 1 ("Every system seeks order.")
      case 'SENTENCE_1': {
        this.updateSentenceParticles(dt);
        // 3.4 seconds total: 1.2s coalesce + 2.2s read & interact
        if (this.phaseTime >= 3.4) {
          this.phase = 'SENTENCE_2';
          this.phaseTime = 0;
          this.prepareSentence(this.sentences[1]);
          museumAudio.playGlassChime(660, 2.0);
        }
        break;
      }

      // PHASE 4: Sentence 2 ("At least, that was the theory.")
      case 'SENTENCE_2': {
        this.updateSentenceParticles(dt);
        if (this.phaseTime >= 3.4) {
          this.phase = 'SENTENCE_3';
          this.phaseTime = 0;
          this.prepareSentence(this.sentences[2]);
          museumAudio.playTheoryFailure();
        }
        break;
      }

      // PHASE 5: Sentence 3 ("Some things refuse to behave.")
      case 'SENTENCE_3': {
        this.updateSentenceParticles(dt);
        if (this.phaseTime >= 3.4) {
          this.phase = 'TITLE_FORMATION';
          this.phaseTime = 0;
          this.prepareSingularityTargets();
          museumAudio.playMonumentalReveal();
          this.triggerShockwave(this.width * 0.70, this.height * 0.50);
        }
        break;
      }

      // PHASE 6: Title Formation (INCORRECT broken physics, PHYSICS zero-g wave)
      case 'TITLE_FORMATION': {
        this.updateTitleParticles(dt);
        if (this.phaseTime >= 3.6) {
          this.phase = 'TITLE_ACTIVE';
          this.phaseTime = 0;
          document.body.classList.remove('opening-film-mode');

          // CULL PARTICLES BY 96%: Keep only a handful of distant flecks to prevent particle soup
          this.particles = this.particles.slice(0, 75);
          for (const p of this.particles) {
            p.vx = (Math.random() - 0.5) * 1.5;
            p.vy = -0.4 - Math.random() * 0.8;
            p.isDispersed = true;
            // Push away from left editorial text area
            if (p.x < this.width * 0.52) {
              p.x = this.width * 0.52 + Math.random() * (this.width * 0.45);
            }
          }

          const thresholdScene = document.getElementById('scene-6-threshold');
          if (thresholdScene) thresholdScene.classList.add('scene-active');
        }
        break;
      }

      // PHASE 7: Ambient Continuous Life in Exhibit Vitrine
      case 'TITLE_ACTIVE':
      case 'HALL_UNFOLD': {
        this.updateAmbientParticles(dt);
        break;
      }
    }
  }

  // =========================================================================
  // MESH DYNAMICS: EINSTEIN GEODESICS & ABNORMAL CURSOR CONTRACTION
  // =========================================================================
  updateSpacetimeMesh() {
    const mouse = this.mouse;
    const mx = mouse.x;
    const my = mouse.y;
    // Repulsive radius: 26% viewport width
    const repulseRadius = Math.max(this.width * 0.26, 260);

    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];

      // Ambient gravitational ripple across the manifold
      const ambientWave = Math.sin(this.time * 1.8 + n.c * 0.12 + n.r * 0.18) * 4.2;

      // Project node to screen
      const proj = this.project3D(n.x + n.dispX, n.y + n.elevation + ambientWave, n.z + n.dispY);
      n.sx = proj.sx;
      n.sy = proj.sy;
      n.scale = proj.scale;
      n.rotZ = proj.rotZ;

      // ABNORMAL CURSOR CONTRACTION (NEGATIVE SPATIAL WARPING):
      // When cursor approaches, the web abnormally contracts AWAY from the cursor.
      // Nodes are pushed away radially in screen coordinates and plunge deeper into negative depth!
      if (mouse.isOver) {
        const dx = n.sx - mx;
        const dy = n.sy - my;
        const dist = Math.hypot(dx, dy);

        if (dist < repulseRadius) {
          const ratio = (repulseRadius - dist) / repulseRadius;
          const pinchStrength = Math.pow(ratio, 2.2);

          // Contraction: pushing nodes outward radially away from the cursor
          const push = pinchStrength * 48;
          const angle = Math.atan2(dy, dx);
          n.dispX += Math.cos(angle) * push * 0.25;
          n.dispY += Math.sin(angle) * push * 0.25;

          // Deep metric depression away from the viewer (dropping in Y / Z)
          n.elevation -= pinchStrength * 55;
        }
      }

      // Elastic spring recovery: restoring to relaxed geodesic grid
      n.dispX *= 0.88;
      n.dispY *= 0.88;
      n.elevation = n.elevation * 0.88 + n.y0 * 0.12;
    }
  }

  // =========================================================================
  // INVERTED DUST EVAPORATION (ACCELERATING UPWARD LIKE FALLING INTO CEILING)
  // =========================================================================
  updateInvertedDustEvaporation(dt) {
    for (const p of this.particles) {
      // Inverted gravity: negative acceleration along Y axis
      p.vy -= 0.14; // Accelerating upward like inverted free-fall!
      p.vx += Math.sin(this.time * 4.0 + p.id) * 0.12;

      p.x += p.vx;
      p.y += p.vy;

      // Slight drag
      p.vx *= 0.98;
    }
  }

  // =========================================================================
  // PARTICLES FLUID CONDENSATION & DISSOLUTION FOR SENTENCES
  // Includes Tactile ReactBits-Style Cursor Hover Micro-Disintegration!
  // =========================================================================
  updateSentenceParticles(dt) {
    const t = this.phaseTime;
    const mouse = this.mouse;
    const hoverRadius = 80;

    // Phase Time Breakdown:
    // 0s to 1.1s: Dust flows smoothly from previous state into new sentence targets
    // 1.1s to 2.8s: Sentence holds in pristine, readable form with reactive hover micro-disintegration
    // 2.8s to 3.4s: Sentence dissolves smoothly, particles breaking bonds into fine ascending dust
    const isDissolving = t >= 2.8;
    const progress = Math.min(1.0, t / 1.1);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      if (isDissolving) {
        // Particles dissolve like fine dust, evaporating upward into next sentence
        const dissolveT = (t - 2.8) / 0.6;
        p.vy -= 0.12 * dissolveT;
        p.vx += Math.sin(this.time * 5 + p.id) * 0.25;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        continue;
      }

      // Cursor Hover Micro-Disintegration:
      // If cursor is near this particle, localized disintegration occurs!
      if (mouse.isOver && !isDissolving) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < hoverRadius) {
          p.isDispersed = true;
          p.disperseTime = 1.0;
          // Blast upward in reverse gravity
          const force = (hoverRadius - dist) / hoverRadius;
          p.vy -= 0.7 * force;
          p.vx += (dx / (dist + 0.1)) * 1.4 * force;
        }
      }

      if (p.isDispersed) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.05; // upward drift
        p.vx *= 0.92;
        p.disperseTime -= dt * 1.5;

        // When disperse time expires, spring back to target
        if (p.disperseTime <= 0) {
          p.isDispersed = false;
        }
      } else {
        // Smooth fluid steering toward target coordinate
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const speed = 0.08 + progress * 0.14;

        p.vx = (p.vx + dx * speed) * 0.78;
        p.vy = (p.vy + dy * speed) * 0.78;
        p.x += p.vx;
        p.y += p.vy;
      }
    }
  }

  // =========================================================================
  // TITLE FORMATION PARTICLES
  // =========================================================================
  updateTitleParticles(dt) {
    const mouse = this.mouse;
    const hoverRadius = 90;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      if (mouse.isOver) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < hoverRadius) {
          p.isDispersed = true;
          const force = (hoverRadius - dist) / hoverRadius;
          p.vy -= 0.6 * force;
          p.vx += (dx / (dist + 0.1)) * 1.2 * force;
        }
      }

      if (p.isDispersed) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.04;
        p.vx *= 0.92;
        if (Math.hypot(p.targetX - p.x, p.targetY - p.y) < 20) {
          p.isDispersed = false;
        }
      } else {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.vx = (p.vx + dx * 0.12) * 0.80;
        p.vy = (p.vy + dy * 0.12) * 0.80;
        p.x += p.vx;
        p.y += p.vy;
      }
    }
  }

  // =========================================================================
  // AMBIENT PARTICLES (90% UPWARD, 10% DOWNWARD/SIDEWAYS DRIFT)
  // Safe reading zones rigorously preserved
  // =========================================================================
  updateAmbientParticles(dt) {
    const isThresholdActive = document.getElementById('scene-6-threshold')?.classList.contains('scene-active');
    const safeZoneRight = this.width * 0.52; // Left half reserved for editorial reading comfort
    const mouse = this.mouse;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Physics Failure: 90% drift upward, 10% drift downward or horizontally
      const isRogue = (p.id % 10 === 0);
      if (isRogue) {
        p.y += 0.28; // 10% fall downward
        p.x -= Math.cos(this.time * 0.8 + p.id) * 0.24; // drift against prevailing drift
      } else {
        p.y -= 0.42; // 90% rise upward (anti-gravity standard)
        p.x += Math.sin(this.time * 0.65 + p.id) * 0.16;
      }

      // Cursor Intrusion: Abnormal attraction / repulsion
      if (mouse.isOver) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110) {
          const force = (110 - dist) / 110;
          if (p.id % 5 === 0) {
            // Abnormal attraction: 20% of particles are pulled INTO cursor
            p.x -= (dx / (dist + 1)) * force * 1.5;
            p.y -= (dy / (dist + 1)) * force * 1.5;
          } else {
            // Standard repulsion: 80% move away
            p.x += (dx / (dist + 1)) * force * 2.2;
            p.y += (dy / (dist + 1)) * force * 2.2;
          }
        }
      }

      // Safe reading zone enforcement: prevent particles from obscuring text
      if (isThresholdActive && p.x < safeZoneRight) {
        p.x += 1.8; // Repel out of reading zone toward peripheral empty space
        p.alpha = Math.max(0.01, p.alpha * 0.85); // Fade to near invisible inside text zone
      } else {
        p.alpha = 0.22;
      }

      // Boundary respawn with inverted bias
      if (p.y < -20) {
        p.y = this.height + 20;
        p.x = safeZoneRight + Math.random() * (this.width - safeZoneRight);
      } else if (p.y > this.height + 20) {
        p.y = -20;
        p.x = safeZoneRight + Math.random() * (this.width - safeZoneRight);
      }
    }
  }

  // =========================================================================
  // ARCHITECTURAL SURVEY LINES & IMPOSSIBLE MEASUREMENTS
  // Replaces dust noise with confident museum restraint
  // =========================================================================
  drawArchitecturalLines() {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 241, 232, 0.06)';
    ctx.lineWidth = 1;

    // Horizontal baseline survey line
    const surveyY = this.height - 28;
    ctx.beginPath();
    ctx.moveTo(32, surveyY);
    ctx.lineTo(this.width - 32, surveyY);
    ctx.stroke();

    // Geometric survey ticks along baseline (No text collision)
    const tickStep = 64;
    for (let x = 32; x <= this.width - 32; x += tickStep) {
      ctx.beginPath();
      ctx.moveTo(x, surveyY - 3);
      ctx.lineTo(x, surveyY + 3);
      ctx.stroke();
    }

    ctx.restore();
  }

  triggerShockwave(originX, originY) {
    this.shockwaves.push({
      x: originX || this.width / 2,
      y: originY || this.height / 2,
      radius: 0,
      maxRadius: Math.max(this.width, this.height) * 1.3,
      intensity: 1.0,
      speed: 26
    });
  }

  startHallUnfold(onComplete) {
    this.hallUnfolding = true;
    this.hallUnfoldProgress = 0;
    this.phase = 'HALL_UNFOLD';

    const interval = setInterval(() => {
      this.hallUnfoldProgress += 0.016;
      if (this.hallUnfoldProgress >= 1) {
        clearInterval(interval);
        this.hallUnfoldProgress = 1;
        if (onComplete) onComplete();
      }
    }, 16);
  }

  // =========================================================================
  // MASTER DRAW PIPELINE (LOCKED PALETTE: ZERO CYAN)
  // =========================================================================
  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Deep Obsidian / Void Background
    ctx.fillStyle = this.COLOR_BG;
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle Radial Vignette
    const bgGrad = ctx.createRadialGradient(
      this.width / 2, this.height * 0.45, 50,
      this.width / 2, this.height * 0.45, Math.max(this.width, this.height) * 0.8
    );
    bgGrad.addColorStop(0, 'rgba(21, 25, 54, 0.45)');
    bgGrad.addColorStop(1, 'rgba(8, 11, 23, 0.98)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // -----------------------------------------------------------------------
    // A. DRAW EINSTEIN SPACETIME MESH (Curvilinear Geodesics & Relativistic Grid)
    // -----------------------------------------------------------------------
    if (this.meshAlpha > 0.001) {
      this.drawSpacetimeMesh();
    }

    // -----------------------------------------------------------------------
    // B. DRAW DUST PARTICLES (During Disintegration, Sentences & Titles)
    // -----------------------------------------------------------------------
    if (this.particles.length > 0) {
      this.drawDustParticles();
    }

    // -----------------------------------------------------------------------
    // C. ARCHITECTURAL SURVEY LINES (Confidence & Restraint)
    // -----------------------------------------------------------------------
    if (this.phase === 'TITLE_ACTIVE' || this.phase === 'HALL_UNFOLD') {
      this.drawArchitecturalLines();
    }

    // -----------------------------------------------------------------------
    // D. DRAW READABLE TYPOGRAPHY (Overlay during Sentences & Physics-Defying Title)
    // -----------------------------------------------------------------------
    if (this.phase === 'SENTENCE_1' || this.phase === 'SENTENCE_2' || this.phase === 'SENTENCE_3') {
      this.drawSentenceTypography();
    } else if (this.phase === 'TITLE_FORMATION') {
      this.drawSingularityLensing();
    }

    // -----------------------------------------------------------------------
    // D. SHOCKWAVES
    // -----------------------------------------------------------------------
    for (const sw of this.shockwaves) {
      ctx.save();
      ctx.strokeStyle = `rgba(181, 163, 255, ${sw.intensity * 0.6})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();

      if (sw.radius > 60) {
        ctx.strokeStyle = `rgba(149, 136, 255, ${sw.intensity * 0.35})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius - 40, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // -----------------------------------------------------------------------
    // E. HALL ARCHITECTURE UNFOLDING
    // -----------------------------------------------------------------------
    if (this.hallUnfolding) {
      this.drawHallArchitecture();
    }
  }

  // =========================================================================
  // DRAW SPACETIME MESH: EINSTEIN'S RELATIVISTIC SHEET
  // =========================================================================
  drawSpacetimeMesh() {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = this.meshAlpha;

    // Latitudinal Curvilinear Geodesics
    for (let r = 0; r < this.rows; r++) {
      ctx.beginPath();
      let started = false;
      for (let c = 0; c < this.cols; c++) {
        const node = this.nodes[r * this.cols + c];
        if (!started) {
          ctx.moveTo(node.sx, node.sy);
          started = true;
        } else {
          ctx.lineTo(node.sx, node.sy);
        }
      }
      // Depth gradient: deeper rows fade into the relativistic horizon
      const depthRatio = r / this.rows;
      ctx.strokeStyle = `rgba(149, 136, 255, ${0.12 + depthRatio * 0.28})`;
      ctx.lineWidth = 1.0;
      ctx.stroke();
    }

    // Longitudinal Geodesics
    for (let c = 0; c < this.cols; c++) {
      ctx.beginPath();
      let started = false;
      for (let r = 0; r < this.rows; r++) {
        const node = this.nodes[r * this.cols + c];
        if (!started) {
          ctx.moveTo(node.sx, node.sy);
          started = true;
        } else {
          ctx.lineTo(node.sx, node.sy);
        }
      }
      const isAccent = c % 4 === 0;
      ctx.strokeStyle = isAccent ? `rgba(181, 163, 255, 0.35)` : `rgba(245, 241, 232, 0.09)`;
      ctx.lineWidth = isAccent ? 1.2 : 0.7;
      ctx.stroke();
    }

    // Spacetime Coordinate Nodes
    for (let i = 0; i < this.nodes.length; i += 2) {
      const node = this.nodes[i];
      const isPushed = Math.hypot(node.dispX, node.dispY) > 3 || Math.abs(node.elevation) > 15;
      const radius = isPushed ? 2.5 : 1.1;

      ctx.fillStyle = isPushed ? this.COLOR_LAVENDER : 'rgba(245, 241, 232, 0.45)';
      ctx.beginPath();
      ctx.arc(node.sx, node.sy, radius, 0, Math.PI * 2);
      ctx.fill();

      if (isPushed) {
        ctx.fillStyle = 'rgba(181, 163, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, radius * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Curvature Reticle when mouse is hovering
    if (this.mouse.isOver && this.phase === 'SPACETIME_WEB') {
      const mx = this.mouse.x;
      const my = this.mouse.y;
      ctx.strokeStyle = 'rgba(181, 163, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(mx, my, 28, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(149, 136, 255, 0.2)';
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(mx, my, 80, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  // =========================================================================
  // DRAW DUST PARTICLES (MINUTE PLANCK PARTICLES)
  // =========================================================================
  drawDustParticles() {
    const ctx = this.ctx;
    ctx.save();

    for (const p of this.particles) {
      ctx.fillStyle = p.baseColor;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Subtle glow for dispersed flecks drifting upward
      if (p.isDispersed) {
        ctx.fillStyle = 'rgba(181, 163, 255, 0.25)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // =========================================================================
  // DRAW CRISP EDITORIAL TYPOGRAPHY OVER PARTICLES
  // Smoothly Cross-Faded & Readable without Effort
  // =========================================================================
  drawSentenceTypography() {
    if (!this.sentenceData) return;
    const ctx = this.ctx;
    const t = this.phaseTime;
    const q = this.sentenceData;

    // Cross-fade:
    // 0s - 1.1s: Particles are coalescing into letters (textAlpha 0 -> 1)
    // 1.1s - 2.8s: Full pristine readability (textAlpha = 1.0)
    // 2.8s - 3.4s: Dissolution into ascending dust (textAlpha 1 -> 0)
    let textAlpha = 0;
    if (t < 1.1) {
      textAlpha = Math.pow(t / 1.1, 2);
    } else if (t < 2.8) {
      textAlpha = 1.0;
    } else {
      textAlpha = Math.max(0, 1.0 - (t - 2.8) / 0.6);
    }

    if (textAlpha > 0.02) {
      ctx.save();
      ctx.globalAlpha = textAlpha;
      ctx.font = `600 ${q.fontSize}px "Playfair Display", Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = this.COLOR_TEXT;

      const cx = this.width / 2;
      q.lines.forEach((line, idx) => {
        const y = q.startY + idx * q.lineHeight;
        ctx.fillText(line, cx, y);
      });
      ctx.restore();
    }
  }

  // =========================================================================
  // COSMIC GRAVITATIONAL LENSING SINGULARITY (REPLACES PARTICLE WORDS)
  // Swirling relativistic accretion ring that collapses gracefully without obscuring text
  // =========================================================================
  drawSingularityLensing() {
    const ctx = this.ctx;
    const t = this.phaseTime;
    const isMobile = this.width < 768;
    const cx = isMobile ? this.width * 0.5 : this.width * 0.70;
    const cy = this.height * 0.50;

    const ringAlpha = Math.min(1.0, t / 1.0);
    ctx.save();
    ctx.globalAlpha = ringAlpha;

    // Relativistic gravitational lensing glow
    const glowGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, isMobile ? 180 : 280);
    glowGrad.addColorStop(0, 'rgba(181, 163, 255, 0.22)');
    glowGrad.addColorStop(0.4, 'rgba(149, 136, 255, 0.12)');
    glowGrad.addColorStop(0.8, 'rgba(110, 90, 232, 0.04)');
    glowGrad.addColorStop(1, 'rgba(8, 11, 23, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, isMobile ? 180 : 280, 0, Math.PI * 2);
    ctx.fill();

    // Event Horizon Photonic Rings
    const baseR = isMobile ? 90 : 140;
    for (let i = 0; i < 3; i++) {
      const r = baseR + i * 28 + Math.sin(this.time * 2.5 + i) * 6;
      ctx.strokeStyle = i === 0 ? 'rgba(181, 163, 255, 0.45)' : 'rgba(149, 136, 255, 0.22)';
      ctx.lineWidth = i === 0 ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.72, this.time * 0.25 * (i % 2 === 0 ? 1 : -1), 0, Math.PI * 2);
      ctx.stroke();
    }

    // Tangential Relativistic Photon Geodesic Ticks
    const tickCount = 18;
    ctx.strokeStyle = 'rgba(245, 241, 232, 0.35)';
    ctx.lineWidth = 1;
    for (let j = 0; j < tickCount; j++) {
      const angle = (j / tickCount) * Math.PI * 2 + this.time * 0.6;
      const rInner = baseR - 8;
      const rOuter = baseR + 8;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * rInner, cy + Math.sin(angle) * rInner * 0.72);
      ctx.lineTo(cx + Math.cos(angle) * rOuter, cy + Math.sin(angle) * rOuter * 0.72);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawHallArchitecture() {
    const ctx = this.ctx;
    const p = this.hallUnfoldProgress;
    const cx = this.width / 2;
    const cy = this.height / 2;

    ctx.save();
    ctx.strokeStyle = `rgba(245, 241, 232, ${p * 0.4})`;
    ctx.lineWidth = 1.0;

    const rays = 24;
    for (let i = 0; i < rays; i++) {
      const angle = (i / rays) * Math.PI * 2;
      const rOuter = Math.max(this.width, this.height) * p;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * rOuter, cy + Math.sin(angle) * rOuter);
      ctx.stroke();
    }

    for (let ring = 1; ring <= 5; ring++) {
      const r = (ring / 5) * Math.min(this.width, this.height) * 0.5 * p;
      ctx.strokeStyle = ring === 5 ? 'rgba(149, 136, 255, 0.45)' : 'rgba(181, 163, 255, 0.18)';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  loop() {
    this.update(0.016);
    this.draw();
    requestAnimationFrame(this.loop);
  }
}
