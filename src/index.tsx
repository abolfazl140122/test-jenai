/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { initLoadingScreen } from './loading-screen';
import { initMainMenu } from './main-menu';

document.addEventListener('DOMContentLoaded', async () => {
  const app = document.getElementById('app') as HTMLElement;
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