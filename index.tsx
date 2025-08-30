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

  let progress = 0;
  let animationFrameId: number;

  const cinematicLoad = () => {
    progress += 0.7; // Consistent progress for better cross-device performance
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
    if (displayProgress > 80) {
      if (!vignette.classList.contains('warning')) {
        loadingText.textContent = "WARNING: BREACH DETECTED";
        vignette.classList.add('warning');
      }
    }

    // Phase 4: Ready to Breach
    if (displayProgress >= 100) {
      cancelAnimationFrame(animationFrameId);

      // --- Start Gradual Stop ---
      // Instead of removing classes abruptly, replace them with "stopping" animations
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

      // Wait for the "stopping" animations (1s) to finish before proceeding
      setTimeout(() => {
        // Clean up stopping classes to be safe
        loadingScreen.classList.remove('shaking-stopping');
        logo.classList.remove('glitching-stopping');
        loadingText.classList.remove('glitching-stopping');
        
        // --- Proceed with the final sequence ---
        
        // Cut the power to lights for dramatic effect
        glowContainer.style.opacity = '0';
        vignette.classList.remove('warning');
        
        loadingText.style.opacity = '0';
        setTimeout(() => {
          loadingText.textContent = 'BREACH';
          loadingText.classList.add('ready-breach');
          loadingText.style.opacity = '1';
          loadingText.addEventListener('click', handleBreachClick, { once: true });
        }, 500); // Wait for fade-out
        
      }, 1000); // This duration must match the stopping animation time

      return; // Stop the loop
    }

    animationFrameId = requestAnimationFrame(cinematicLoad);
  };

  const handleBreachClick = () => {
    // Clear previous elements if any
    bloodOverlay.innerHTML = '';

    // --- Create a more detailed blood splatter effect ---

    // 1. Main Splatter
    const mainSplatter = document.createElement('div');
    mainSplatter.classList.add('blood-splatter');
    bloodOverlay.appendChild(mainSplatter);

    // 2. Dynamic Droplets
    const dropletCount = 25; // Increased for more detail
    for (let i = 0; i < dropletCount; i++) {
        const droplet = document.createElement('div');
        droplet.classList.add('blood-droplet');

        const angle = Math.random() * Math.PI * 2;
        // Distribute droplets more widely
        const distance = Math.random() * (Math.min(window.innerWidth, window.innerHeight) / 2);
        const x = Math.cos(angle) * distance * (1 + Math.random());
        const y = Math.sin(angle) * distance * (1 + Math.random());
        
        const size = 3 + Math.random() * 10; // px
        const rotation = Math.random() * 360; // deg
        const delay = Math.random() * 0.15; // seconds for a staggered effect
        const duration = 0.5 + Math.random() * 0.5; // seconds for varied speed

        // Use inline styles to set CSS variables for animation
        droplet.style.setProperty('--x', `${x}px`);
        droplet.style.setProperty('--y', `${y}px`);
        droplet.style.setProperty('--size', `${size}px`);
        droplet.style.setProperty('--rotation', `${rotation}deg`);
        droplet.style.animationDelay = `${delay}s`;
        droplet.style.animationDuration = `${duration}s`;
        
        bloodOverlay.appendChild(droplet);
    }

    // Wait for the shatter animation to complete before fading out
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
    }, 400); 

    loadingScreen.addEventListener('transitionend', () => {
        loadingScreen.style.display = 'none';
        app.style.display = 'flex'; // Make app part of the layout
        setTimeout(() => { // Short delay to ensure transition fires
          app.classList.add('visible');
          initMainMenuInteractivity(); // Initialize new menu effects
        }, 50);
    }, { once: true });
  };

  const initMainMenuInteractivity = () => {
    const trail = document.getElementById('cursor-trail') as HTMLElement;
    const parallaxLayers = document.querySelectorAll('.parallax-layer') as NodeListOf<HTMLElement>;
    const motionPermissionOverlay = document.getElementById('motion-permission-overlay') as HTMLElement;
    const motionPermissionButton = document.getElementById('motion-permission-button') as HTMLButtonElement;


    if (parallaxLayers.length === 0) {
      console.warn('Parallax layers not found.');
      return;
    }
    
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // Hide trail element on mobile via JS as a fallback to the CSS media query
    if (!isDesktop && trail) {
        trail.style.display = 'none';
    }

    // This will hold screen-like coordinates from either mouse or gyroscope
    let inputX = window.innerWidth / 2;
    let inputY = window.innerHeight / 2;
    
    // Current animated positions for the cursor trail
    let currentTrailX = inputX;
    let currentTrailY = inputY;
    
    const trailEase = 0.15; // Smoothing factor for the trail

    const startMotionTracking = () => {
        window.addEventListener('deviceorientation', (e: DeviceOrientationEvent) => {
            if (e.gamma === null || e.beta === null) return;
            
            // Map gyroscope data to screen-like coordinates.
            // We'll use a limited range (+/- 30 degrees) for a subtle, controlled effect.
            const clampedGamma = Math.max(-30, Math.min(30, e.gamma)); // left-right tilt
            const clampedBeta = Math.max(-30, Math.min(30, e.beta));   // front-back tilt

            // Convert the clamped tilt range [-30, 30] to a screen coordinate range.
            // The `+ 0.5` part centers the neutral (no tilt) position.
            inputX = (clampedGamma / 60 + 0.5) * window.innerWidth;
            inputY = (clampedBeta / 60 + 0.5) * window.innerHeight;
        });
    };

    if (isDesktop) {
        // On desktop, simply track the mouse position
        window.addEventListener('mousemove', (e: MouseEvent) => {
          inputX = e.clientX;
          inputY = e.clientY;
        });
    } else {
        // Handle Device Orientation API for mobile, including the iOS permission model.
        // This is a non-standard API, so we must check for its existence.
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            if (motionPermissionOverlay && motionPermissionButton) {
                // Show the dialog
                motionPermissionOverlay.classList.remove('hidden');

                motionPermissionButton.addEventListener('click', async () => {
                    try {
                        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
                        if (permissionState === 'granted') {
                            startMotionTracking();
                        } else {
                            console.warn('Permission for device orientation not granted.');
                        }
                    } catch (error) {
                        console.error('Error requesting device orientation permission:', error);
                    } finally {
                        // Hide the dialog regardless of the outcome
                        motionPermissionOverlay.classList.add('hidden');
                    }
                }, { once: true });
            }
        } else {
            // For Android and other devices that don't need explicit permission
            startMotionTracking();
        }
    }

    // The main animation loop, running for both platforms
    const animate = () => {
      // --- Animate Cursor Trail (Desktop Only) ---
      if (isDesktop && trail) {
        // Apply linear interpolation (lerp) for a smooth, lagging effect
        currentTrailX += (inputX - currentTrailX) * trailEase;
        currentTrailY += (inputY - currentTrailY) * trailEase;
        trail.style.transform = `translate(${currentTrailX}px, ${currentTrailY}px)`;
      }
      
      // --- Animate Parallax Layers (for both desktop and mobile) ---
      // Normalize the input coordinates to a [-1, 1] range.
      const parallaxX = (inputX / window.innerWidth - 0.5) * 2;
      const parallaxY = (inputY / window.innerHeight - 0.5) * 2;

      parallaxLayers.forEach(layer => {
        const depth = parseFloat(layer.dataset.depth || '0');
        // Use different multipliers for desktop vs. mobile to get the right feel
        const moveX = -parallaxX * ((isDesktop ? 50 : 25) * depth);
        const moveY = -parallaxY * ((isDesktop ? 25 : 15) * depth);
        layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });

      // Continue the animation loop
      requestAnimationFrame(animate);
    };

    // Start the animation loop
    requestAnimationFrame(animate);
  };


  // Start the experience
  animationFrameId = requestAnimationFrame(cinematicLoad);
});