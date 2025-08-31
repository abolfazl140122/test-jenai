/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { GRAVITY, PLAYER_JUMP_FORCE, PLAYER_MOVE_SPEED, PLAYER_FRICTION, PLAYER_SIZE } from './constants';
import { InputHandler } from './input-handler';

export class Player {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public velocityX: number;
  public velocityY: number;
  private isJumping: boolean;

  constructor(private canvasWidth: number, private canvasHeight: number) {
    this.width = PLAYER_SIZE;
    this.height = PLAYER_SIZE;
    this.x = (this.canvasWidth - this.width) / 2;
    this.y = this.canvasHeight - this.height - 100; // Start above ground
    this.velocityX = 0;
    this.velocityY = 0;
    this.isJumping = false;
  }

  public update(input: InputHandler, groundLevel: number) {
    // Handle horizontal movement
    if (input.keys.has('ArrowLeft') || input.keys.has('a')) {
      this.velocityX = -PLAYER_MOVE_SPEED;
    } else if (input.keys.has('ArrowRight') || input.keys.has('d')) {
      this.velocityX = PLAYER_MOVE_SPEED;
    } else {
      this.velocityX *= PLAYER_FRICTION; // Apply friction
    }

    // Handle jumping
    if ((input.keys.has('ArrowUp') || input.keys.has('w') || input.keys.has(' ')) && !this.isJumping) {
      this.velocityY = PLAYER_JUMP_FORCE;
      this.isJumping = true;
    }

    // Apply gravity
    this.velocityY += GRAVITY;

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Collision with ground
    if (this.y + this.height > groundLevel) {
      this.y = groundLevel - this.height;
      this.velocityY = 0;
      this.isJumping = false;
    }

    // Collision with canvas bounds
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > this.canvasWidth) {
      this.x = this.canvasWidth - this.width;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.shadowBlur = 0; // Reset shadow blur
  }
}
