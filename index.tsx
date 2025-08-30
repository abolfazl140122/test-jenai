/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// This script manages the cinematic loading screen experience and main menu interactivity.

document.addEventListener('DOMContentLoaded', () => {
  const loadingBar = document.getElementById('loading-bar') as HTMLDivElement;
  const loadingText = document.getElementById('loading-text') as HTMLDivElement;
  const loadingScreen = document.getElementById('loading-screen') as HTMLDivElement;
  const app = document.getElementById('app') as HTMLElement;
  const logo = document.getElementById('logo') as HTMLImageElement;
  const glowContainer = document.getElementById('glow-container') as HTMLDivElement;
  const vignette = document.querySelector('.vignette') as HTMLDivElement;
  const bloodOverlay = document.getElementById('blood-overlay') as HTMLDivElement;

  if (!loadingBar || !loadingText || !loadingScreen || !app || !logo || !glowContainer || !vignette || !bloodOverlay) {
    console.error('Core cinematic elements not found!');
    return;
  }

  let animationFrameId: number;
  let startTime: number | null = null;
  const loadingDuration = 4000; // 4 seconds for the entire loading sequence

  const cinematicLoad = (timestamp: number) => {
    if (startTime === null) {
      startTime = timestamp;
    }
    const elapsedTime = timestamp - startTime;
    const progress = (elapsedTime / loadingDuration) * 100;
    
    const displayProgress = Math.min(progress, 100);
    loadingBar.style.width = `${displayProgress}%`;

    // Phase 1: Glitching & Shaking (0-20%)
    if (displayProgress <= 20) {
      if (!logo.classList.contains('glitching')) {
        logo.classList.add('glitching');
        loadingText.classList.add('glitching');
        loadingScreen.classList.add('shaking'); // Start camera shake
      }
    }
    
    // Phase 2: Power Up (20-80%)
    if (displayProgress > 20 && displayProgress <= 80) {
      if (!glowContainer.classList.contains('active')) {
        loadingText.textContent = "SYSTEM ONLINE";
        glowContainer.classList.add('active');
      }
    }
    
    // Phase 3: Warning (80-100%)
    if (displayProgress > 80 && displayProgress < 100) {
      if (!vignette.classList.contains('warning')) {
        loadingText.textContent = "WARNING: BREACH DETECTED";
        vignette.classList.add('warning');
      }
    }

    // Phase 4: Ready to Breach
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
        app.style.display = 'flex';
        setTimeout(() => {
          app.classList.add('visible');
          initMainMenuInteractivity();
        }, 50);
    }, { once: true });
  };

  /**
   * Initializes all interactive elements of the main menu.
   */
  const initMainMenuInteractivity = () => {
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const parallaxLayers = document.querySelectorAll('.parallax-layer') as NodeListOf<HTMLElement>;

    // This will hold screen-like coordinates from either mouse or gyroscope
    let inputX = window.innerWidth / 2;
    let inputY = window.innerHeight / 2;
    
    // --- Setup different interactive modules ---
    const trailUpdater = setupCursorTrail(isDesktop);
    const particleUpdater = setupParticleCanvas(isDesktop);
    setupMenuButtonHover(app);
    setupMotionTracking(isDesktop, (x, y) => {
        inputX = x;
        inputY = y;
    });

    // The main animation loop for the menu
    const animateMenu = () => {
      // Normalize input coordinates to a [-1, 1] range for parallax calculations.
      const parallaxX = (inputX / window.innerWidth - 0.5) * 2;
      const parallaxY = (inputY / window.innerHeight - 0.5) * 2;
      
      trailUpdater(inputX, inputY);
      particleUpdater(parallaxX, parallaxY);
      
      // Animate Parallax Layers
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
  
  /**
   * Sets up the custom cursor trail for desktop users.
   * @param isDesktop - Boolean indicating if the device is a desktop.
   * @returns A function to update the trail's position.
   */
  const setupCursorTrail = (isDesktop: boolean) => {
    const trail = document.getElementById('cursor-trail') as HTMLElement;
    if (!isDesktop || !trail) {
        if(trail) trail.style.display = 'none';
        return () => {}; // Return no-op function if not on desktop
    }
    
    let currentTrailX = window.innerWidth / 2;
    let currentTrailY = window.innerHeight / 2;
    const trailEase = 0.15;

    return (targetX: number, targetY: number) => {
        currentTrailX += (targetX - currentTrailX) * trailEase;
        currentTrailY += (targetY - currentTrailY) * trailEase;
        trail.style.transform = `translate(${currentTrailX}px, ${currentTrailY}px)`;
    };
  };

  /**
   * Sets up the dynamic particle background canvas.
   * @param isDesktop - Boolean for tuning particle movement intensity.
   * @returns A function to update particle positions based on parallax.
   */
  const setupParticleCanvas = (isDesktop: boolean) => {
      const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
      if (!canvas) return () => {};
      const ctx = canvas.getContext('2d');
      if (!ctx) return () => {};

      let particles: {x: number, y: number, z: number, vx: number, vy: number, size: number}[] = [];

      const resizeCanvas = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          particles = [];
          const particleCount = isDesktop ? 150 : 75;
          for (let i = 0; i < particleCount; i++) {
              particles.push({
                  x: Math.random() * canvas.width,
                  y: Math.random() * canvas.height,
                  z: Math.random() * 0.5 + 0.5, // Depth (0.5 to 1.0)
                  vx: (Math.random() - 0.5) * 0.2,
                  vy: -Math.random() * 0.5 - 0.2,
                  size: (Math.random() * 1) + 0.5,
              });
          }
      };
      
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      return (parallaxX: number, parallaxY: number) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
          
          particles.forEach(p => {
              // Update position
              p.x += p.vx;
              p.y += p.vy;

              // Boundary check (wrap around)
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
   * Adds hover listeners to menu buttons to trigger global environmental effects.
   * @param appContainer - The main app container element.
   */
  const setupMenuButtonHover = (appContainer: HTMLElement) => {
      const menuButtons = document.querySelectorAll('.menu-button');
      menuButtons.forEach(button => {
          button.addEventListener('mouseenter', () => appContainer.classList.add('menu-hover'));
          button.addEventListener('mouseleave', () => appContainer.classList.remove('menu-hover'));
      });
  };

  /**
   * Sets up mouse or device orientation tracking.
   * @param isDesktop - Is the device a desktop?
   * @param onUpdate - Callback function with updated x and y coordinates.
   */
  const setupMotionTracking = (isDesktop: boolean, onUpdate: (x: number, y: number) => void) => {
    // Utility to throttle events for performance
    const throttle = <T extends (...args: any[]) => any>(func: T, limit: number): T => {
      let inThrottle: boolean;
      return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      } as T;
    };
    
    if (isDesktop) {
        window.addEventListener('mousemove', (e: MouseEvent) => {
          onUpdate(e.clientX, e.clientY);
        });
    } else {
        const startMotionTracking = () => {
            const handleOrientation = (e: DeviceOrientationEvent) => {
                if (e.gamma === null || e.beta === null) return;
                const clampedGamma = Math.max(-30, Math.min(30, e.gamma));
                const clampedBeta = Math.max(-30, Math.min(30, e.beta));
                const x = (clampedGamma / 60 + 0.5) * window.innerWidth;
                const y = (clampedBeta / 60 + 0.5) * window.innerHeight;
                onUpdate(x, y);
            };
            window.addEventListener('deviceorientation', throttle(handleOrientation, 16));
        };

        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            const motionPermissionOverlay = document.getElementById('motion-permission-overlay') as HTMLElement;
            const motionPermissionButton = document.getElementById('motion-permission-button') as HTMLButtonElement;

            if (motionPermissionOverlay && motionPermissionButton) {
                motionPermissionOverlay.classList.remove('hidden');
                motionPermissionButton.addEventListener('click', async () => {
                    try {
                        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
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


  // Start the experience
  animationFrameId = requestAnimationFrame(cinematicLoad);
});