/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { startGame } from './game/game-view';

export const initStartMissionPanel = () => {
  const panel = document.getElementById('start-mission-panel') as HTMLElement;
  if (!panel) return;

  const closeButton = panel.querySelector('.panel-close-button') as HTMLButtonElement;
  const app = document.getElementById('app') as HTMLElement;
  const iranModeBtn = document.getElementById('iran-mode-btn') as HTMLElement;
  const prologueMissionItem = document.getElementById('prologue-mission-item') as HTMLElement;
  
  if (!closeButton || !app || !iranModeBtn || !prologueMissionItem) {
    console.error('Start mission panel elements not found!');
    return;
  }

  const closePanel = () => {
    panel.classList.remove('visible');
    app.classList.remove('panel-open');
    // Reset the view for the next time the panel is opened
    setTimeout(() => {
      iranModeBtn.classList.remove('hidden');
      prologueMissionItem.classList.add('hidden');
    }, 500); // Delay should be same as panel transition duration
  };

  closeButton.addEventListener('click', closePanel);

  // Step 1: Click "Iran Mode"
  iranModeBtn.addEventListener('click', () => {
    iranModeBtn.classList.add('hidden');
    prologueMissionItem.classList.remove('hidden');
  });

  // Step 2: Click the revealed mission to start the game
  prologueMissionItem.addEventListener('click', () => {
    // Fade out menu, then start game
    app.style.transition = 'opacity 0.5s ease-out';
    app.style.opacity = '0';
    
    setTimeout(() => {
      app.style.display = 'none';
      startGame();
    }, 500);
  });
};