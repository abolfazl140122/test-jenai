/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export const initLoadDataPanel = () => {
  const panel = document.getElementById('load-data-panel') as HTMLElement;
  const closeButton = panel?.querySelector('.panel-close-button') as HTMLButtonElement;
  const app = document.getElementById('app') as HTMLElement;

  if (!panel || !closeButton || !app) {
    console.error('Load data panel elements not found!');
    return;
  }

  const closePanel = () => {
    panel.classList.remove('visible');
    app.classList.remove('panel-open');
  };

  closeButton.addEventListener('click', closePanel);

  // Future: Add logic for save slots
};
