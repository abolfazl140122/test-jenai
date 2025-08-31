/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { GRAVITY, PLAYER_JUMP_FORCE, PLAYER_MOVE_SPEED, PLAYER_FRICTION, PLAYER_SIZE, WORLD_WIDTH } from './constants';
import { InputHandler } from './input-handler';
import { Platform } from './platform';

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
    this.y = this.canvasHeight - this.height - 200; // Start higher up
    this.velocityX = 0;
    this.velocityY = 0;
    this.isJumping = true; // Start in the air
  }

  public update(input: InputHandler, platforms: Platform[]) {
    // 1. Handle horizontal movement
    if (input.keys.has('ArrowLeft') || input.keys.has('a')) {
      this.velocityX = -PLAYER_MOVE_SPEED;
    } else if (input.keys.has('ArrowRight') || input.keys.has('d')) {
      this.velocityX = PLAYER_MOVE_SPEED;
    } else {
      this.velocityX *= PLAYER_FRICTION; // Apply friction
    }
    this.x += this.velocityX;

    // 2. Handle vertical movement
    this.velocityY += GRAVITY;
    this.y += this.velocityY;
    
    // 3. Check for vertical collision (landing on platforms)
    let onPlatform = false;
    for (const platform of platforms) {
      // Check if player is horizontally aligned with the platform
      if (this.x + this.width > platform.x && this.x < platform.x + platform.width) {
        // Check if player was above the platform in the previous frame and is now intersecting it
        const previousBottom = (this.y - this.velocityY) + this.height;
        if (this.velocityY >= 0 && previousBottom <= platform.y && (this.y + this.height) >= platform.y) {
          this.y = platform.y - this.height;
          this.velocityY = 0;
          onPlatform = true;
          break; // Found our ground, no need to check other platforms
        }
      }
    }
    
    this.isJumping = !onPlatform;

    // Handle jumping from a platform
    if ((input.keys.has('ArrowUp') || input.keys.has('w') || input.keys.has(' ')) && onPlatform) {
      this.velocityY = PLAYER_JUMP_FORCE;
      this.isJumping = true;
    }

    // Collision with world bounds
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > WORLD_WIDTH) {
      this.x = WORLD_WIDTH - this.width;
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
