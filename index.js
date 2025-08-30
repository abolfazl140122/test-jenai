/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// --- UTILS --- (from src/utils.ts)
/**
 * Throttles a function to prevent it from being called too frequently.
 * @param func The function to throttle.
 * @param limit The minimum time in milliseconds between calls.
 * @returns The throttled function.
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// --- AUDIO PRELOADER LOGIC --- (from src/audio-preloader.ts)
const audioAssets = [
  { 
    id: 'background-music', 
    src: 'https://raw.githubusercontent.com/abolfazl140122/test-jenai/ffb7502131ba540eeeb37822af07d01dc824bccf/scary-ambience-music-347437.mp3', 
    loop: true 
  },
  { 
    id: 'sfx-gunshot', 
    src: 'https://github.com/abolfazl140122/test-jenai/raw/09793ef2205567f211dae4b31d6f3cc79e5d36e6/rifle-gunshot-99749.mp3', 
    loop: false 
  },
  {
    id: 'sfx-hover',
    src: 'https://github.com/abolfazl140122/test-jenai/raw/61b25b36b5ec9a32a8f7bb27a9b532818d80390b/glitch-01-231255.mp3',
    loop: true
  }
];

const initAudioPreloader = () => {
  return new Promise((resolve, reject) => {
    const preloader = document.getElementById('audio-preloader');
    const preloaderContent = document.getElementById('audio-preloader-content');
    const progressBar = document.getElementById('audio-progress-bar');
    const progressText = document.getElementById('audio-progress-text');

    if (!preloader || !preloaderContent || !progressBar || !progressText) {
      const errorMsg = 'Audio preloader UI elements not found!';
      console.error(errorMsg);
      return reject(new Error(errorMsg));
    }
    
    let loadedCount = 0;
    const assetsToLoad = audioAssets.length;
    const progressPerAsset = {};

    const updateOverallProgress = () => {
      let totalProgress = 0;
      Object.values(progressPerAsset).forEach(p => { totalProgress += p; });
      
      const overallPercent = totalProgress / assetsToLoad;

      progressBar.style.width = `${overallPercent}%`;
      progressText.textContent = `${Math.round(overallPercent)}%`;
    };
    
    const onAllAssetsReady = () => {
        progressBar.style.width = '100%';
        progressText.textContent = '100%';
        
        preloaderContent.innerHTML = `
          <h2>AURAL SENSORS CALIBRATED</h2>
          <p>Engage protocol to begin.</p>
          <button id="start-experience-button">ENGAGE</button>
        `;

        const startButton = document.getElementById('start-experience-button');
        const backgroundMusic = document.getElementById('background-music');

        startButton.addEventListener('click', () => {
          if (backgroundMusic) {
             backgroundMusic.play().catch(e => console.error("Background music play failed:", e));
          }
          
          preloader.style.opacity = '0';
          preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
            resolve();
          }, { once: true });
        }, { once: true });
    };
    
    const onAssetError = (id, event) => {
      console.error(`Failed to load audio asset: ${id}`, event);
      audioAssets.forEach(asset => {
          const el = document.getElementById(asset.id);
          if (el) el.src = ''; 
      });
      preloaderContent.innerHTML = `
        <h2 style="color: #ff4141;">ASSET LOAD FAILED</h2>
        <p>Could not load essential audio assets.<br>Please check your connection and refresh.</p>
      `;
      reject(new Error(`Failed to load audio asset: ${id}`));
    };

    audioAssets.forEach(asset => {
        const audioElement = document.getElementById(asset.id);

        if (!audioElement) {
            return onAssetError(asset.id, new Event('Element not found'));
        }

        progressPerAsset[asset.id] = 0;
        audioElement.loop = asset.loop;
        
        const updateAssetProgress = () => {
            if (audioElement.duration > 0 && audioElement.buffered.length > 0) {
                const bufferedEnd = audioElement.buffered.end(audioElement.buffered.length - 1);
                const percentComplete = (bufferedEnd / audioElement.duration) * 100;
                progressPerAsset[asset.id] = Math.min(percentComplete, 100);
            }
            updateOverallProgress();
        };

        const onCanPlayThrough = () => {
            cleanupListenersForAsset();
            progressPerAsset[asset.id] = 100;
            updateOverallProgress();
            loadedCount++;
            if (loadedCount === assetsToLoad) {
                onAllAssetsReady();
            }
        };

        const onError = (e) => {
            cleanupListenersForAsset();
            onAssetError(asset.id, e);
        };

        const cleanupListenersForAsset = () => {
            audioElement.removeEventListener('progress', updateAssetProgress);
            audioElement.removeEventListener('canplaythrough', onCanPlayThrough);
            audioElement.removeEventListener('error', onError);
        };
        
        audioElement.addEventListener('progress', updateAssetProgress);
        audioElement.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
        audioElement.addEventListener('error', onError, { once: true });
        
        audioElement.src = asset.src;
        audioElement.load();
    });
  });
};


// --- LOADING SCREEN LOGIC --- (from src/loading-screen.ts)
/**
 * Initializes and manages the cinematic loading screen experience.
 * @returns A promise that resolves when the loading screen has finished its transition out.
 */
const initLoadingScreen = () => {
  return new Promise((resolve) => {
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    const loadingScreen = document.getElementById('loading-screen');
    const logo = document.getElementById('logo');
    const glowContainer = document.getElementById('glow-container');
    const vignette = document.querySelector('.vignette');
    const bloodOverlay = document.getElementById('blood-overlay');
    const gunshotSfx = document.getElementById('sfx-gunshot');

    if (!loadingBar || !loadingText || !loadingScreen || !logo || !glowContainer || !vignette || !bloodOverlay || !gunshotSfx) {
      console.error('Core cinematic elements not found!');
      resolve(); // Resolve immediately if elements are missing
      return;
    }

    let animationFrameId;
    let startTime = null;
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

    const cinematicLoad = (timestamp) => {
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
    
    animationFrameId = requestAnimationFrame(cinematicLoad);
  });
};


// --- MAIN MENU LOGIC --- (from src/main-menu.ts)
/**
 * Initializes all interactive elements of the main menu.
 */
const initMainMenu = () => {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Main app element not found!');
    return;
  }
  
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let inputX = window.innerWidth / 2;
  let inputY = window.innerHeight / 2;
  
  const trailUpdater = setupCursorTrail(isDesktop);
  const parallaxUpdater = setupParallaxBackground();
  setupMenuButtonEffects(app);
  setupMotionTracking(isDesktop, (x, y) => {
      inputX = x;
      inputY = y;
  });

  const animateMenu = () => {
    trailUpdater(inputX, inputY);
    parallaxUpdater(inputX, inputY);
    
    requestAnimationFrame(animateMenu);
  };

  animateMenu();
};
  
const setupCursorTrail = (isDesktop) => {
  const trail = document.getElementById('cursor-trail');
  if (!isDesktop || !trail) {
      if(trail) trail.style.display = 'none';
      return () => {};
  }
  
  let currentTrailX = window.innerWidth / 2;
  let currentTrailY = window.innerHeight / 2;
  const trailEase = 0.15;

  return (targetX, targetY) => {
      currentTrailX += (targetX - currentTrailX) * trailEase;
      currentTrailY += (targetY - currentTrailY) * trailEase;
      trail.style.transform = `translate(${currentTrailX}px, ${currentTrailY}px)`;
  };
};

const setupParallaxBackground = () => {
    const layers = document.querySelectorAll('.parallax-layer');
    if (!layers.length) return () => {};

    // Strength of movement, farthest layer moves the least
    const strengths = [0.05, 0.1, 0.2, 0.4]; 
    let currentOffsets = Array(layers.length).fill(0).map(() => ({ x: 0 }));
    const ease = 0.08;

    return (targetX, targetY) => {
        // Calculate target offset based on mouse position from center (-0.5 to 0.5 range)
        const xOffset = (targetX - window.innerWidth / 2) / window.innerWidth;

        layers.forEach((layer, i) => {
            // The range of motion for each layer
            const moveRange = 5; // Total movement range in %
            const targetOffsetX = -xOffset * moveRange * strengths[i];
            
            // Smoothly ease the current offset towards the target
            currentOffsets[i].x += (targetOffsetX - currentOffsets[i].x) * ease;
            
            layer.style.transform = `translateX(${currentOffsets[i].x}%)`;
        });
    };
};

const setupMenuButtonEffects = (appContainer) => {
    const menuButtons = document.querySelectorAll('.menu-button');
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&";
    const hoverSfx = document.getElementById('sfx-hover');

    menuButtons.forEach(button => {
        const span = button.querySelector('span');
        if (!span) return;

        const originalText = span.dataset.value || span.innerText;
        span.dataset.value = originalText;

        let interval;

        button.addEventListener('mouseenter', () => {
            if (hoverSfx) {
                hoverSfx.currentTime = 0;
                hoverSfx.play().catch(e => console.error("Hover SFX failed to play:", e));
            }
            let iteration = 0;
            clearInterval(interval);
            
            interval = window.setInterval(() => {
                span.innerText = originalText
                    .split('')
                    .map((letter, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        if (letter === ' ') return ' ';
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join('');

                if (iteration >= originalText.length) {
                    clearInterval(interval);
                    span.innerText = originalText;
                }
                iteration += 1 / 2;
            }, 30);
        });

        button.addEventListener('mouseleave', () => {
           if (hoverSfx) {
               hoverSfx.pause();
               hoverSfx.currentTime = 0;
           }
           clearInterval(interval);
           span.innerText = originalText;
        });

        button.addEventListener('mouseenter', () => appContainer.classList.add('menu-hover'));
        button.addEventListener('mouseleave', () => appContainer.classList.remove('menu-hover'));
    });
};

const setupMotionTracking = (isDesktop, onUpdate) => {
  if (isDesktop) {
      window.addEventListener('mousemove', (e) => {
        onUpdate(e.clientX, e.clientY);
      });
  } else {
      const startMotionTracking = () => {
          const handleOrientation = (e) => {
              if (e.gamma === null || e.beta === null) return;
              const clampedGamma = Math.max(-30, Math.min(30, e.gamma));
              const clampedBeta = Math.max(-30, Math.min(30, e.beta));
              const x = (clampedGamma / 60 + 0.5) * window.innerWidth;
              const y = (clampedBeta / 60 + 0.5) * window.innerHeight;
              onUpdate(x, y);
          };
          window.addEventListener('deviceorientation', throttle(handleOrientation, 16));
      };

      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
          const motionPermissionOverlay = document.getElementById('motion-permission-overlay');
          const motionPermissionButton = document.getElementById('motion-permission-button');

          if (motionPermissionOverlay && motionPermissionButton) {
              motionPermissionOverlay.classList.remove('hidden');
              motionPermissionButton.addEventListener('click', async () => {
                  try {
                      const permissionState = await DeviceOrientationEvent.requestPermission();
                      if (permissionState === 'granted') {
                          startMotionTracking();
                      }
                  } catch (error) {
                      console.error('Error requesting device orientation permission:', error);
                  } finally {
                      motionPermissionOverlay.classList.add('hidden');
                  }
              }, { once: true });
          }
      } else {
          startMotionTracking();
      }
  }
};


// --- APP INITIALIZATION --- (from src/index.tsx)
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const app = document.getElementById('app');
    if (!app) {
      console.error('Main app container #app not found!');
      return;
    }

    // Wait for user to engage with audio preloader
    await initAudioPreloader();

    // Run the cinematic loading screen and wait for it to complete
    await initLoadingScreen();

    // Once loading is done, transition to the main menu
    app.style.display = 'flex';
    setTimeout(() => {
      app.classList.add('visible');
      // Initialize all the interactive parts of the main menu
      initMainMenu();
    }, 50);
  } catch (error) {
    console.error("Failed to initialize the application:", error);
    document.body.innerHTML = `<div style="color: #ff4141; text-align: center; padding: 2rem;"><h1>Initialization Failed</h1><p>Could not load essential assets. Please refresh and try again.</p></div>`;
  }
});