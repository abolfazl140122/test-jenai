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
  const parallaxLayers = document.querySelectorAll('.parallax-layer') as NodeListOf<HTMLElement>;

  let inputX = window.innerWidth / 2;
  let inputY = window.innerHeight / 2;
  
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
 * Sets up the dynamic particle background canvas.
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
                z: Math.random() * 0.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.2,
                vy: -Math.random() * 0.5 - 0.2,
                size: (Math.random() * 1) + 0.5,
            });
        }
    };
    
    window.addEventListener('resize', throttle(resizeCanvas, 100));
    resizeCanvas();

    return (parallaxX: number, parallaxY: number) => {
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
const setupMenuButtonHover = (appContainer: HTMLElement) => {
    const menuButtons = document.querySelectorAll('.menu-button');
    menuButtons.forEach(button => {
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