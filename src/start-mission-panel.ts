/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export const initStartMissionPanel = () => {
  const panel = document.getElementById('start-mission-panel') as HTMLElement;
  const closeButton = panel?.querySelector('.panel-close-button') as HTMLButtonElement;
  const app = document.getElementById('app') as HTMLElement;
  
  if (!panel || !closeButton || !app) {
    console.error('Start mission panel elements not found!');
    return;
  }

  const closePanel = () => {
    panel.classList.remove('visible');
    app.classList.remove('panel-open');
  };

  closeButton.addEventListener('click', closePanel);

  // Future: Add logic for selecting and starting a mission
};
