/**
 * The Museum of Incorrect Physics
 * Reality Crash & Physical Typography Engine
 * 
 * First Text Sequence:
 * 1. "THE OBSERVATION WAS NOT EXPECTED." (Small, centered system message) -> Fades out
 * 2. "RETRYING REALITY..." (Small, centered system message) -> Fades out
 * 3. "FAILURE." (Colossal: 22vw - 25vw, Reality Crashed)
 * 
 * Followed by Physical Typography Violations:
 * 4. "Every system seeks order." -> "ORDER" collapses inward
 * 5. "Every equation seeks certainty." -> Solid reflection precedes ghostly original
 * 6. "Every anomaly must be corrected." -> Singularity vortex
 * 7. The Theory Break -> 3.0s Dead silence, "At least...", rogue "THEORY" breaks away
 */

import { museumAudio } from './audio.js';

export class BrokenTypography {
  /**
   * The First Text (System Crash Sequence)
   * Small system messages followed by colossal 22vw FAILURE.
   */
  static renderSystemCrashSequence(container, onComplete) {
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'reality-crash-wrapper';
    container.appendChild(wrapper);

    // Step 1: Small centered "THE OBSERVATION WAS NOT EXPECTED."
    const line1 = document.createElement('div');
    line1.className = 'system-msg-line msg-observation';
    line1.textContent = 'THE OBSERVATION WAS NOT EXPECTED.';
    wrapper.appendChild(line1);

    setTimeout(() => {
      line1.classList.add('active');
      museumAudio.playGlassChime(784, 1.8);
    }, 300);

    // Fade out Step 1
    setTimeout(() => {
      line1.classList.remove('active');
      line1.classList.add('fade-out');
    }, 2400);

    // Step 2: Small centered "RETRYING REALITY..."
    setTimeout(() => {
      const line2 = document.createElement('div');
      line2.className = 'system-msg-line msg-retrying';
      line2.textContent = 'RETRYING REALITY...';
      wrapper.appendChild(line2);

      setTimeout(() => {
        line2.classList.add('active');
        museumAudio.playInvertedWind();
      }, 100);

      // Fade out Step 2
      setTimeout(() => {
        line2.classList.remove('active');
        line2.classList.add('fade-out');
      }, 2000);
    }, 2700);

    // Step 3: MASSIVE "FAILURE." (22vw - 25vw across viewport)
    setTimeout(() => {
      container.innerHTML = '';
      const failureEl = document.createElement('div');
      failureEl.className = 'colossal-failure-text';
      failureEl.textContent = 'FAILURE.';
      container.appendChild(failureEl);

      setTimeout(() => {
        failureEl.classList.add('visible');
        museumAudio.playFailurePulse();
        // Violently shudder the reality of the viewport
        document.body.classList.add('reality-shudder');
        setTimeout(() => document.body.classList.remove('reality-shudder'), 700);
        if (window.worldGridBg) {
          window.worldGridBg.triggerShockwave(window.innerWidth / 2, window.innerHeight / 2);
        }
      }, 150);

      // FAILURE shatters and dissipates into the philosophical sequence
      setTimeout(() => {
        failureEl.classList.add('dissolve-up');
        setTimeout(onComplete, 1400);
      }, 2800);
    }, 5400);
  }

  /**
   * Sentence 1: "Every system seeks order."
   * Everything disappears except "ORDER", which grows heavy and collapses inward.
   */
  static renderOrderCollapse(container, onComplete) {
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'broken-quote-order';
    container.appendChild(wrapper);

    const words = ["Every", "system", "seeks", "order."];
    const wordElements = [];

    words.forEach((word) => {
      const wSpan = document.createElement('span');
      wSpan.className = word.toLowerCase().includes('order') ? 'word-order-target' : 'word-transient';
      
      const letters = word.split('').map((ch) => {
        const lSpan = document.createElement('span');
        lSpan.className = 'malfunctioning-char';
        lSpan.textContent = ch;
        const r = Math.random();
        if (r < 0.33) {
          lSpan.style.transform = `translateY(${50 + Math.random() * 80}px)`;
        } else if (r < 0.66) {
          lSpan.style.transform = `translateY(${-50 - Math.random() * 80}px)`;
        } else {
          lSpan.style.transform = `translateX(${(Math.random() - 0.5) * 160}px)`;
        }
        lSpan.style.opacity = '0';
        wSpan.appendChild(lSpan);
        return lSpan;
      });

      wrapper.appendChild(wSpan);
      wrapper.appendChild(document.createTextNode(' '));
      wordElements.push({ word, el: wSpan, letters });
    });

    const allLetters = wrapper.querySelectorAll('.malfunctioning-char');
    const shuffled = Array.from(allLetters).sort(() => Math.random() - 0.5);

    shuffled.forEach((ch, idx) => {
      setTimeout(() => {
        ch.style.transition = 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
        ch.style.transform = 'translate(0, 0)';
        ch.style.opacity = '1';
        if (idx % 3 === 0) {
          museumAudio.playLetterArrival(600 + idx * 24);
        }
      }, idx * 60);
    });

    const assembleTime = shuffled.length * 60 + 800;

    setTimeout(() => {
      wordElements.forEach(({ word, el }) => {
        if (!word.toLowerCase().includes('order')) {
          el.style.transition = 'opacity 0.6s ease, transform 0.8s ease';
          el.style.opacity = '0';
          el.style.transform = 'translateY(15px)';
        }
      });

      const orderEl = wrapper.querySelector('.word-order-target');
      if (orderEl) {
        orderEl.classList.add('order-heavy');
        museumAudio.playGlassChime(330, 2.5);

        setTimeout(() => {
          orderEl.classList.add('order-collapse-inward');
          museumAudio.playFailurePulse();
          if (window.worldGridBg) {
            window.worldGridBg.triggerShockwave(window.innerWidth / 2, window.innerHeight / 2);
          }
          setTimeout(onComplete, 1600);
        }, 1600);
      } else {
        setTimeout(onComplete, 1500);
      }
    }, assembleTime + 1800);
  }

  /**
   * Sentence 2: "Every equation seeks certainty."
   * Inverted reflection appears FIRST (solid), original appears LATER (ghostly).
   */
  static renderCertaintyReflection(container, onComplete) {
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'broken-quote-certainty';
    container.appendChild(wrapper);

    const text = "Every equation seeks certainty.";

    const reflection = document.createElement('div');
    reflection.className = 'retrocausal-reflection';
    reflection.textContent = text;
    wrapper.appendChild(reflection);

    const original = document.createElement('div');
    original.className = 'retrocausal-original';
    original.textContent = text;
    wrapper.appendChild(original);

    setTimeout(() => {
      reflection.classList.add('reflection-solid');
      museumAudio.playGlassChime(880, 2.0);
    }, 150);

    setTimeout(() => {
      original.classList.add('original-ghost');
      museumAudio.playGlassChime(440, 2.0);
    }, 800);

    setTimeout(() => {
      reflection.classList.remove('reflection-solid');
      reflection.classList.add('reflection-fake');
      original.classList.remove('original-ghost');
      original.classList.add('original-real');
    }, 2400);

    setTimeout(() => {
      wrapper.classList.add('certainty-vanish');
      setTimeout(onComplete, 1400);
    }, 4200);
  }

  /**
   * Sentence 3: "Every anomaly must be corrected."
   * Singularity black hole pulls words inward.
   */
  static renderSingularityAnomaly(container, onComplete) {
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'broken-quote-singularity';
    container.appendChild(wrapper);

    const text = "Every anomaly must be corrected.";
    const words = text.split(' ');

    words.forEach((w) => {
      const wSpan = document.createElement('span');
      wSpan.className = 'singularity-word';
      w.split('').forEach((ch) => {
        const lSpan = document.createElement('span');
        lSpan.className = 'singularity-char';
        lSpan.textContent = ch;
        wSpan.appendChild(lSpan);
      });
      wrapper.appendChild(wSpan);
      wrapper.appendChild(document.createTextNode(' '));
    });

    setTimeout(() => {
      wrapper.classList.add('singularity-active');
      museumAudio.playInvertedWind();
      museumAudio.playGlassChime(520, 2.8);
    }, 100);

    setTimeout(() => {
      wrapper.classList.add('singularity-swallow');
      museumAudio.playFailurePulse();
      setTimeout(onComplete, 1600);
    }, 3600);
  }

  /**
   * THE THEORY BREAK SEQUENCE:
   * 3.0s Dead silence -> "At least..." -> "that was the theory." with rogue "THEORY"
   */
  static renderTheoryBreakSequence(container, onComplete) {
    container.innerHTML = '';

    document.body.classList.add('vacuum-freeze');
    if (window.worldGridBg) {
      window.worldGridBg.setMode('frozen-vacuum');
    }

    setTimeout(() => {
      document.body.classList.remove('vacuum-freeze');
      if (window.worldGridBg) {
        window.worldGridBg.setMode('inverted-fall');
      }

      const whisper = document.createElement('div');
      whisper.className = 'whisper-at-least';
      whisper.textContent = 'At least...';
      container.appendChild(whisper);

      setTimeout(() => {
        whisper.classList.add('visible');
        museumAudio.playGlassChime(392, 3.0);
      }, 200);

      setTimeout(() => {
        whisper.classList.remove('visible');
        setTimeout(() => {
          container.innerHTML = '';
          const theoryBox = document.createElement('div');
          theoryBox.className = 'theory-breakout-box';
          theoryBox.innerHTML = `
            <span class="theory-prefix">that was the</span>
            <span class="theory-rogue" id="rogue-theory-word">
              <span class="t-char" data-c="T">T</span>
              <span class="t-char" data-c="H">H</span>
              <span class="t-char" data-c="E">E</span>
              <span class="t-char" data-c="O">O</span>
              <span class="t-char" data-c="R">R</span>
              <span class="t-char" data-c="Y">Y</span>
              <span class="rogue-shadow" aria-hidden="true">THEORY</span>
            </span>
          `;
          container.appendChild(theoryBox);

          setTimeout(() => {
            theoryBox.classList.add('visible');
            museumAudio.playGlassChime(1174.66, 3.0);
          }, 150);

          setTimeout(() => {
            const rogue = document.getElementById('rogue-theory-word');
            if (rogue) rogue.classList.add('rogue-detached');
            museumAudio.playAnomalyBurst();

            document.body.classList.add('reality-shudder');
            setTimeout(() => document.body.classList.remove('reality-shudder'), 700);
          }, 1800);

          setTimeout(() => {
            const prefix = theoryBox.querySelector('.theory-prefix');
            if (prefix) prefix.style.opacity = '0';
          }, 3200);

          setTimeout(() => {
            theoryBox.classList.add('theory-dissolve');
            setTimeout(onComplete, 1600);
          }, 5200);
        }, 600);
      }, 2600);
    }, 3000); // 3000ms true dead pause
  }
}
