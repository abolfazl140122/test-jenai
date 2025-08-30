/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Main application entry point.
import { initAudioPreloader } from './src/audio-preloader';
import { initLoadingScreen } from './src/loading-screen';
import { initMainMenu } from './src/main-menu';
import { initI18n } from './src/i18n';
import { audioManager } from './src/audio-manager';


// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Initialize internationalization and audio manager first
    initI18n();
    audioManager.init();

    const app = document.getElementById('app') as HTMLElement;
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
    }, 50); // A short delay ensures the display:flex is applied before the transition starts.
  } catch (error) {
    console.error("Failed to initialize the application:", error);
    document.body.innerHTML = `<div style="color: #ff4141; text-align: center; padding: 2rem;"><h1>Initialization Failed</h1><p>Could not load essential assets. Please refresh and try again.</p></div>`;
  }
});