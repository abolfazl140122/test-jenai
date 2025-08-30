/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { throttle } from './utils';

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
  const particleUpdater = setupParticleCanvas();
  setupMenuButtonEffects(app);
  setupMotionTracking(isDesktop, (x, y) => {
      inputX = x;
      inputY = y;
  });

  const animateMenu = () => {
    trailUpdater(inputX, inputY);
    particleUpdater();
    
    requestAnimationFrame(animateMenu);
  };

  animateMenu();
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
 * Sets up the dynamic "digital rain" particle background.
 */
const setupParticleCanvas = () => {
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
    if (!canvas) return () => {};
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};

    const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789';
    const fontSize = 16;
    let columns = 0;
    let drops: number[] = [];

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
    };
    
    window.addEventListener('resize', throttle(resizeCanvas, 100));
    resizeCanvas();

    return () => {
        ctx.fillStyle = 'rgba(2, 4, 27, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ffff';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    };
};

/**
 * Adds hover listeners and text scramble effect to menu buttons.
 */
const setupMenuButtonEffects = (appContainer: HTMLElement) => {
    const menuButtons = document.querySelectorAll('.menu-button');
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&";
    const hoverSfx = document.getElementById('sfx-hover') as HTMLAudioElement;

    menuButtons.forEach(button => {
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
 * Sets up mouse or device orientation tracking.
 */
const setupMotionTracking = (isDesktop: boolean, onUpdate: (x: number, y: number) => void) => {
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