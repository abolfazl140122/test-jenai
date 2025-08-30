/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Initializes and manages the cinematic loading screen experience.
 * @returns A promise that resolves when the loading screen has finished its transition out.
 */
export const initLoadingScreen = (): Promise<void> => {
  return new Promise((resolve) => {
    const loadingBar = document.getElementById('loading-bar') as HTMLDivElement;
    const loadingText = document.getElementById('loading-text') as HTMLDivElement;
    const loadingScreen = document.getElementById('loading-screen') as HTMLDivElement;
    const logo = document.getElementById('logo') as HTMLImageElement;
    const glowContainer = document.getElementById('glow-container') as HTMLDivElement;
    const vignette = document.querySelector('.vignette') as HTMLDivElement;
    const bloodOverlay = document.getElementById('blood-overlay') as HTMLDivElement;
    const gunshotSfx = document.getElementById('sfx-gunshot') as HTMLAudioElement;

    if (!loadingBar || !loadingText || !loadingScreen || !logo || !glowContainer || !vignette || !bloodOverlay || !gunshotSfx) {
      console.error('Core cinematic elements not found!');
      resolve(); // Resolve immediately if elements are missing
      return;
    }

    let animationFrameId: number;
    let startTime: number | null = null;
    const loadingDuration = 4000; // 4 seconds

    const handleBreachClick = () => {
      // Play gunshot sound effect
      if (gunshotSfx) {
        gunshotSfx.currentTime = 0; // Rewind before playing
        gunshotSfx.play().catch(e => console.error("Gunshot SFX failed to play:", e));
      }

      bloodOverlay.innerHTML = '';
      const mainSplatter = document.createElement('div');
      mainSplatter.classList.add('blood-splatter');
      bloodOverlay.appendChild(mainSplatter);

      const dropletCount = 25;
      for (let i = 0; i < dropletCount; i++) {
          const droplet = document.createElement('div');
          droplet.classList.add('blood-droplet');

          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * (Math.min(window.innerWidth, window.innerHeight) / 2);
          const x = Math.cos(angle) * distance * (1 + Math.random());
          const y = Math.sin(angle) * distance * (1 + Math.random());
          
          const size = 3 + Math.random() * 10;
          const rotation = Math.random() * 360;
          const delay = Math.random() * 0.15;
          const duration = 0.5 + Math.random() * 0.5;

          droplet.style.setProperty('--x', `${x}px`);
          droplet.style.setProperty('--y', `${y}px`);
          droplet.style.setProperty('--size', `${size}px`);
          droplet.style.setProperty('--rotation', `${rotation}deg`);
          droplet.style.animationDelay = `${delay}s`;
          droplet.style.animationDuration = `${duration}s`;
          
          bloodOverlay.appendChild(droplet);
      }

      setTimeout(() => {
        loadingScreen.style.opacity = '0';
      }, 400); 

      loadingScreen.addEventListener('transitionend', () => {
          loadingScreen.style.display = 'none';
          resolve(); // Resolve the promise here
      }, { once: true });
    };

    const cinematicLoad = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }
      const elapsedTime = timestamp - startTime;
      const progress = (elapsedTime / loadingDuration) * 100;
      
      const displayProgress = Math.min(progress, 100);
      loadingBar.style.width = `${displayProgress}%`;

      if (displayProgress <= 20) {
        if (!logo.classList.contains('glitching')) {
          logo.classList.add('glitching');
          loadingText.classList.add('glitching');
          loadingScreen.classList.add('shaking');
        }
      }
      
      if (displayProgress > 20 && displayProgress <= 80) {
        if (!glowContainer.classList.contains('active')) {
          loadingText.textContent = "SYSTEM ONLINE";
          glowContainer.classList.add('active');
        }
      }
      
      if (displayProgress > 80 && displayProgress < 100) {
        if (!vignette.classList.contains('warning')) {
          loadingText.textContent = "WARNING: BREACH DETECTED";
          vignette.classList.add('warning');
        }
      }

      if (displayProgress >= 100) {
        cancelAnimationFrame(animationFrameId);

        if (loadingScreen.classList.contains('shaking')) {
            loadingScreen.classList.remove('shaking');
            loadingScreen.classList.add('shaking-stopping');
        }
        if (logo.classList.contains('glitching')) {
            logo.classList.remove('glitching');
            logo.classList.add('glitching-stopping');
        }
        if (loadingText.classList.contains('glitching')) {
            loadingText.classList.remove('glitching');
            loadingText.classList.add('glitching-stopping');
        }

        setTimeout(() => {
          loadingScreen.classList.remove('shaking-stopping');
          logo.classList.remove('glitching-stopping');
          loadingText.classList.remove('glitching-stopping');
          
          glowContainer.style.opacity = '0';
          vignette.classList.remove('warning');
          
          loadingText.style.opacity = '0';
          setTimeout(() => {
            loadingText.textContent = 'BREACH';
            loadingText.classList.add('ready-breach');
            loadingText.style.opacity = '1';
            loadingText.addEventListener('click', handleBreachClick, { once: true });
          }, 500); 
          
        }, 1000); 

        return;
      }

      animationFrameId = requestAnimationFrame(cinematicLoad);
    };
    
    // Start the experience
    animationFrameId = requestAnimationFrame(cinematicLoad);
  });
};