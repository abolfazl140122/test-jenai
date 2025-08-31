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
  const missionItems = panel.querySelectorAll('.mission-item');
  
  if (!closeButton || !app || missionItems.length === 0) {
    console.error('Start mission panel elements not found!');
    return;
  }

  const closePanel = () => {
    panel.classList.remove('visible');
    app.classList.remove('panel-open');
  };

  closeButton.addEventListener('click', closePanel);

  // Add logic for selecting and starting a mission
  const prologueMission = missionItems[0] as HTMLElement;
  if (prologueMission && !prologueMission.classList.contains('locked')) {
    prologueMission.addEventListener('click', () => {
      // Fade out menu, then start game
      app.style.transition = 'opacity 0.5s ease-out';
      app.style.opacity = '0';
      
      setTimeout(() => {
        app.style.display = 'none';
        startGame();
      }, 500);
    });
  }
};
