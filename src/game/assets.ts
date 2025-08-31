/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Player sprite sheet from ansimuz.com (https://ansimuz.com/site/assets/)
// Hosted on imgur for this example.
const PLAYER_SPRITE_SHEET_URL = 'https://i.imgur.com/K3a5YV3.png';

export const playerSpriteSheet = new Image();
playerSpriteSheet.src = PLAYER_SPRITE_SHEET_URL;

// A promise that resolves when all game assets are loaded.
export const assetsLoaded = new Promise<void>((resolve) => {
    playerSpriteSheet.onload = () => {
        console.log('Player sprite sheet loaded.');
        resolve();
    };
    playerSpriteSheet.onerror = () => {
        console.error('Failed to load player sprite sheet.');
        // Resolve anyway so the game doesn't hang, it will just have a missing texture.
        resolve();
    };
});
