/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { initGameEngine } from './game-engine';

let isInitialized = false;

export function startGame() {
  const gameView = document.getElementById('game-view');
  if (!gameView) return;

  gameView.classList.add('visible');
  
  if (!isInitialized) {
    initGameEngine();
    isInitialized = true;
  }
}

export function hideGame() {
    const gameView = document.getElementById('game-view');
    if (!gameView) return;
    gameView.classList.remove('visible');
}
