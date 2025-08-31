/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { Player } from './player';
import { InputHandler } from './input-handler';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let player: Player;
let inputHandler: InputHandler;
let groundLevel: number;

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update game state
  player.update(inputHandler, groundLevel);

  // Draw everything
  drawGround();
  player.draw(ctx);

  requestAnimationFrame(gameLoop);
}

function drawGround() {
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(0, groundLevel);
  ctx.lineTo(canvas.width, groundLevel);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

export function initGameEngine() {
  canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Game canvas not found!');
    return;
  }
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    groundLevel = canvas.height - 80; // Ground is 80px from the bottom
    if (player) {
      // re-instantiate player or update its canvas dimensions
      // for simplicity, we don't handle player re-positioning on resize yet
    }
  };
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  player = new Player(canvas.width, canvas.height);
  inputHandler = new InputHandler();

  gameLoop();
}
