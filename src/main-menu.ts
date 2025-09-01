/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { throttle } from './utils';
import { initSettingsPanel } from './settings-panel';
import { initLoadDataPanel } from './load-data-panel';
import { initStartMissionPanel } from './start-mission-panel';

let menuAnimationId: number;

/**
 * Initializes all interactive elements of the main menu.
 */
export const initMainMenu = () => {
  const app = document.getElementById('app') as HTMLElement;
  if (!app) {
    console.error('Main app element not found!');
    return;
  }
  
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let inputX = window.innerWidth / 2;
  let inputY = window.innerHeight / 2;
  
  const trailUpdater = setupCursorTrail(isDesktop);
  const parallaxUpdater = setupParallaxBackground();
  
  // Setup button functionality (clicks and hovers)
  setupMenuButtonEffects(app);
  
  // Initialize panel logic (e.g., close buttons)
  initSettingsPanel();
  initLoadDataPanel();
  initStartMissionPanel();

  setupMotionTracking(isDesktop, (x, y) => {
      inputX = x;
      inputY = y;
  });

  const animateMenu = () => {
    trailUpdater(inputX, inputY);
    parallaxUpdater(inputX, inputY);
    
    menuAnimationId = requestAnimationFrame(animateMenu);
  };

  animateMenu();
};

/**
 * Stops the main menu animation loop.
 */
export const stopMainMenu = () => {
  cancelAnimationFrame(menuAnimationId);
};
  
/**
 * Sets up the custom cursor trail for desktop users.
 */
const setupCursorTrail = (isDesktop: boolean) => {
  const trail = document.getElementById('cursor-trail') as HTMLElement;
  if (!isDesktop || !trail) {
      if(trail) trail.style.display = 'none';
      return () => {};
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
 * Sets up the parallax background effect that reacts to input.
 */
const setupParallaxBackground = () => {
    const layers = document.querySelectorAll('.parallax-layer') as NodeListOf<HTMLElement>;
    if (!layers.length) return () => {};

    // Strength of movement, farthest layer moves the least
    const strengths = [0.05, 0.1, 0.2, 0.4]; 
    let currentOffsets = Array(layers.length).fill(0).map(() => ({ x: 0 }));
    const ease = 0.08;

    return (targetX: number, targetY: number) => {
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

/**
 * Adds hover and click listeners and text scramble effect to menu buttons.
 */
const setupMenuButtonEffects = (appContainer: HTMLElement) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&";
    const hoverSfx = document.getElementById('sfx-hover') as HTMLAudioElement;

    const startMissionBtn = document.getElementById('start-mission-btn');
    const loadDataBtn = document.getElementById('load-data-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const exitBtn = document.getElementById('exit-btn');

    const settingsPanel = document.getElementById('settings-panel');
    const loadDataPanel = document.getElementById('load-data-panel');
    const startMissionPanel = document.getElementById('start-mission-panel');
    
    // --- Click Handlers ---
    startMissionBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        startMissionPanel?.classList.add('visible');
        appContainer.classList.add('panel-open');
    });

    loadDataBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        loadDataPanel?.classList.add('visible');
        appContainer.classList.add('panel-open');
    });

    settingsBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        settingsPanel?.classList.add('visible');
        appContainer.classList.add('panel-open');
    });
    
    exitBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        appContainer.style.transition = 'opacity 0.5s ease';
        appContainer.style.opacity = '0';
        setTimeout(() => {
            document.body.innerHTML = `<div style="color: #00ffff; text-align: center; padding: 2rem; height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; font-family: 'Orbitron', sans-serif;"><h1>CONNECTION TERMINATED.</h1><p style="font-family: 'Montserrat', sans-serif;">Thank you for playing BREACH PROTOCOL.</p></div>`;
        }, 500);
    });

    // --- Hover Effects ---
    document.querySelectorAll('.menu-button').forEach(button => {
        const span = button.querySelector('span');
        if (!span) return;

        const originalText = span.dataset.value || span.innerText;
        span.dataset.value = originalText;

        let interval: number | undefined;

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


/**
 * Sets up mouse, touch, or device orientation tracking for parallax effects.
 */
const setupMotionTracking = (isDesktop: boolean, onUpdate: (x: number, y: number) => void) => {
  if (isDesktop) {
      window.addEventListener('mousemove', (e: MouseEvent) => {
        onUpdate(e.clientX, e.clientY);
      });
      return;
  }

  // For mobile/touch devices, use touchmove as a reliable default
  window.addEventListener('touchmove', (e: TouchEvent) => {
    // Prevent scrolling page while dragging
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      onUpdate(touch.clientX, touch.clientY);
    }
  }, { passive: false });

  // Try to use Device Orientation for a more immersive effect if available
  const startMotionTracking = () => {
      const handleOrientation = (e: DeviceOrientationEvent) => {
          if (e.gamma === null || e.beta === null) return;
          // Normalize gamma/beta values for screen coordinates
          // Clamp values to a reasonable range to prevent extreme jumps
          const clampedGamma = Math.max(-30, Math.min(30, e.gamma)); // left-to-right tilt
          const clampedBeta = Math.max(-30, Math.min(30, e.beta));  // front-to-back tilt

          // Map the tilt range [-30, 30] to the screen width/height [0, width/height]
          const x = (clampedGamma + 30) / 60 * window.innerWidth;
          const y = (clampedBeta + 30) / 60 * window.innerHeight;

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
      // For Android or devices that don't require permission
      startMotionTracking();
  }
};
