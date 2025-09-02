/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { Player } from './player';
import { InputHandler } from './input-handler';
import { GRAVITY, WORLD_WIDTH } from './constants';
import { platforms, generateWorld, drawWorld } from './world';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let gameView: HTMLElement;
let player: Player;
let inputHandler: InputHandler;

let cameraX = 0;
const CAMERA_LERP_FACTOR = 0.1; // For smooth camera movement

// --- CURSOR TRAIL LOGIC ---
let trailElement: HTMLElement;
const cursorState = {
  worldX: 0,
  worldY: 0,
  vy: 0,
  mode: 'normal' as 'normal' | 'falling' | 'following',
};
const mouseScreenPos = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};
const handleMouseMove = (e: MouseEvent) => {
  mouseScreenPos.x = e.clientX;
  mouseScreenPos.y = e.clientY;
};

function initCursorTrail() {
  trailElement = document.getElementById('cursor-trail') as HTMLElement;
  if (!trailElement) {
    console.error('Cursor trail element not found!');
    return;
  }
  
  trailElement.style.display = 'block';
  
  window.addEventListener('mousemove', handleMouseMove);
  
  // Trigger the fall after 8 seconds
  setTimeout(() => {
    if (cursorState.mode === 'normal') {
      cursorState.mode = 'falling';
      trailElement.classList.add('fallen');
      window.removeEventListener('mousemove', handleMouseMove);
    }
  }, 8000);
}

function updateCursorTrail() {
  if (!trailElement) return;

  switch (cursorState.mode) {
    case 'normal': {
      const targetWorldX = mouseScreenPos.x + cameraX;
      const targetWorldY = mouseScreenPos.y;
      cursorState.worldX += (targetWorldX - cursorState.worldX) * 0.2;
      cursorState.worldY += (targetWorldY - cursorState.worldY) * 0.2;
      break;
    }
    case 'falling': {
      cursorState.vy += GRAVITY;
      cursorState.worldY += cursorState.vy;

      for (const platform of platforms) {
        if (
          cursorState.worldX > platform.x &&
          cursorState.worldX < platform.x + platform.width &&
          cursorState.worldY >= platform.y - 5 && // Check if it's at or below platform top
          (cursorState.worldY - cursorState.vy) < platform.y -5
        ) {
          cursorState.worldY = platform.y - 5;
          cursorState.vy = 0;
          cursorState.mode = 'following';
          break;
        }
      }
      break;
    }
    case 'following': {
      const targetWorldX = player.x + player.width / 2;
      cursorState.worldX += (targetWorldX - cursorState.worldX) * 0.05;

      cursorState.vy += GRAVITY;
      cursorState.worldY += cursorState.vy;

      for (const platform of platforms) {
        const previousY = cursorState.worldY - cursorState.vy;
        if (
          cursorState.worldX > platform.x &&
          cursorState.worldX < platform.x + platform.width &&
          previousY <= platform.y - 5 &&
          cursorState.worldY >= platform.y - 5
        ) {
          cursorState.worldY = platform.y - 5;
          cursorState.vy = 0;
          break;
        }
      }
      break;
    }
  }

  const screenX = cursorState.worldX - cameraX;
  const screenY = cursorState.worldY;

  trailElement.style.transform = `translate(${screenX}px, ${screenY}px)`;
}
// --- END CURSOR TRAIL LOGIC ---


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
  updateCursorTrail();

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
  initCursorTrail();

  gameLoop();
}
