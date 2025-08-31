/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { Player } from './player';
import { InputHandler } from './input-handler';
import { WORLD_WIDTH } from './constants';
import { platforms, generateWorld, drawWorld } from './world';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let gameView: HTMLElement;
let player: Player;
let inputHandler: InputHandler;

let cameraX = 0;
const CAMERA_LERP_FACTOR = 0.1; // For smooth camera movement

function gameLoop() {
  // Update camera to follow player smoothly
  const targetCameraX = player.x - (canvas.width / 2) + (player.width / 2);
  cameraX += (targetCameraX - cameraX) * CAMERA_LERP_FACTOR;

  // Clamp camera to world bounds to prevent seeing outside the level
  if (cameraX < 0) cameraX = 0;
  if (cameraX > WORLD_WIDTH - canvas.width) cameraX = WORLD_WIDTH - canvas.width;
  
  // Update parallax background via CSS custom property
  gameView.style.setProperty('--camera-x', `${cameraX}`);

  // Clear canvas for new frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // --- Translate canvas for camera view ---
  ctx.save();
  ctx.translate(-cameraX, 0);

  // Update game state
  player.update(inputHandler, platforms);

  // Draw everything relative to the world
  drawWorld(ctx);
  player.draw(ctx);

  // --- Restore canvas context to its original state ---
  ctx.restore();

  requestAnimationFrame(gameLoop);
}

export function initGameEngine() {
  canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  gameView = document.getElementById('game-view') as HTMLElement;
  if (!canvas || !gameView) {
    console.error('Game canvas or game view not found!');
    return;
  }
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateWorld(WORLD_WIDTH, canvas.height);
    if (!player) {
      player = new Player(canvas.width, canvas.height);
    }
  };
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  inputHandler = new InputHandler();

  gameLoop();
}
