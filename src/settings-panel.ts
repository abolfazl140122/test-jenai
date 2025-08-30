/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export const initSettingsPanel = () => {
  const panel = document.getElementById('settings-panel') as HTMLElement;
  const closeButton = panel?.querySelector('.panel-close-button') as HTMLButtonElement;
  const app = document.getElementById('app') as HTMLElement;
  
  if (!panel || !closeButton || !app) {
    console.error('Settings panel elements not found!');
    return;
  }
  
  const closePanel = () => {
    panel.classList.remove('visible');
    app.classList.remove('panel-open');
  };

  closeButton.addEventListener('click', closePanel);

  // Future: Add logic for sliders to control audio volume
};
