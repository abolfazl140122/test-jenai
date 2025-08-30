/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// --- UTILS ---
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


// --- LOADING SCREEN LOGIC ---
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

    if (!loadingBar || !loadingText || !loadingScreen || !logo || !glowContainer || !vignette || !bloodOverlay) {
      console.error('Core cinematic elements not found!');
      resolve(); // Resolve immediately if elements are missing
      return;
    }

    let animationFrameId;
    let startTime = null;
    const loadingDuration = 4000; // 4 seconds

    const handleBreachClick = () => {
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
    
    // Start the experience
    animationFrameId = requestAnimationFrame(cinematicLoad);
  });
};


// --- MAIN MENU LOGIC ---
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
  const parallaxLayers = document.querySelectorAll('.parallax-layer');

  let inputX = window.innerWidth / 2;
  let inputY = window.innerHeight / 2;
  
  /**
   * Sets up the custom cursor trail for desktop users.
   */
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

  /**
   * Sets up the dynamic particle background canvas.
   */
  const setupParticleCanvas = (isDesktop) => {
      const canvas = document.getElementById('particle-canvas');
      if (!canvas) return () => {};
      const ctx = canvas.getContext('2d');
      if (!ctx) return () => {};

      let particles = [];

      const resizeCanvas = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          particles = [];
          const particleCount = isDesktop ? 150 : 75;
          for (let i = 0; i < particleCount; i++) {
              particles.push({
                  x: Math.random() * canvas.width,
                  y: Math.random() * canvas.height,
                  z: Math.random() * 0.5 + 0.5,
                  vx: (Math.random() - 0.5) * 0.2,
                  vy: -Math.random() * 0.5 - 0.2,
                  size: (Math.random() * 1) + 0.5,
              });
          }
      };
      
      window.addEventListener('resize', throttle(resizeCanvas, 100));
      resizeCanvas();

      return (parallaxX, parallaxY) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
          
          particles.forEach(p => {
              p.x += p.vx;
              p.y += p.vy;

              if (p.y < 0) { p.y = canvas.height; }
              if (p.x < 0) { p.x = canvas.width; }
              if (p.x > canvas.width) { p.x = 0; }
              
              const moveX = -parallaxX * (isDesktop ? 20 : 10) * p.z;
              const moveY = -parallaxY * (isDesktop ? 10 : 5) * p.z;
              
              ctx.beginPath();
              ctx.arc(p.x + moveX, p.y + moveY, p.size * p.z, 0, Math.PI * 2);
              ctx.fill();
          });
      };
  };

  /**
   * Adds hover listeners to menu buttons.
   */
  const setupMenuButtonHover = (appContainer) => {
      const menuButtons = document.querySelectorAll('.menu-button');
      menuButtons.forEach(button => {
          button.addEventListener('mouseenter', () => appContainer.classList.add('menu-hover'));
          button.addEventListener('mouseleave', () => appContainer.classList.remove('menu-hover'));
      });
  };

  /**
   * Sets up mouse or device orientation tracking.
   */
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

  const trailUpdater = setupCursorTrail(isDesktop);
  const particleUpdater = setupParticleCanvas(isDesktop);
  setupMenuButtonHover(app);
  setupMotionTracking(isDesktop, (x, y) => {
      inputX = x;
      inputY = y;
  });

  const animateMenu = () => {
    const parallaxX = (inputX / window.innerWidth - 0.5) * 2;
    const parallaxY = (inputY / window.innerHeight - 0.5) * 2;
    
    trailUpdater(inputX, inputY);
    particleUpdater(parallaxX, parallaxY);
    
    parallaxLayers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth || '0');
      const moveX = -parallaxX * ((isDesktop ? 50 : 20) * depth);
      const moveY = -parallaxY * ((isDesktop ? 25 : 10) * depth);
      layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    requestAnimationFrame(animateMenu);
  };

  animateMenu();
};


// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Main app container #app not found!');
    return;
  }

  // Run the cinematic loading screen and wait for it to complete
  await initLoadingScreen();

  // Once loading is done, transition to the main menu
  app.style.display = 'flex';
  setTimeout(() => {
    app.classList.add('visible');
    // Initialize all the interactive parts of the main menu
    initMainMenu();
  }, 50); // A short delay ensures the display:flex is applied before the transition starts.
});