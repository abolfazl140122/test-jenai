/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { GRAVITY, PLAYER_JUMP_FORCE, PLAYER_MOVE_SPEED, PLAYER_FRICTION, WORLD_WIDTH } from './constants';
import { InputHandler } from './input-handler';
import { Platform } from './platform';
import { playerSpriteSheet } from './assets';

const FRAME_WIDTH = 48;
const FRAME_HEIGHT = 48;

// Animation configurations: { row on spritesheet, number of frames, ticks per frame }
const animations = {
    idle: { row: 0, frames: 4, speed: 10 },
    run:  { row: 1, frames: 6, speed: 5 },
    jump: { row: 2, frames: 1, speed: 1 }, // Just the first frame of the jump animation
    fall: { row: 3, frames: 1, speed: 1 }, // Just the first frame of the fall animation
};

export class Player {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public velocityX: number;
  public velocityY: number;
  private isJumping: boolean;

  // Animation state
  private currentState: keyof typeof animations = 'idle';
  private frameX = 0;
  private frameTimer = 0;
  private facingDirection: 'right' | 'left' = 'right';

  constructor(private canvasWidth: number, private canvasHeight: number) {
    this.width = FRAME_WIDTH;
    this.height = FRAME_HEIGHT;
    this.x = (this.canvasWidth - this.width) / 2;
    this.y = this.canvasHeight - this.height - 200;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isJumping = true;
  }

  private setState(newState: keyof typeof animations) {
    if (this.currentState !== newState) {
        this.currentState = newState;
        this.frameX = 0;
        this.frameTimer = 0;
    }
  }

  public update(input: InputHandler, platforms: Platform[]) {
    // Horizontal movement
    if (input.keys.has('ArrowLeft') || input.keys.has('a')) {
      this.velocityX = -PLAYER_MOVE_SPEED;
      this.facingDirection = 'left';
    } else if (input.keys.has('ArrowRight') || input.keys.has('d')) {
      this.velocityX = PLAYER_MOVE_SPEED;
      this.facingDirection = 'right';
    } else {
      this.velocityX *= PLAYER_FRICTION;
    }
    this.x += this.velocityX;

    // Vertical movement & gravity
    this.velocityY += GRAVITY;
    this.y += this.velocityY;
    
    // Collision with platforms
    let onPlatform = false;
    for (const platform of platforms) {
      if (this.x + this.width > platform.x && this.x < platform.x + platform.width) {
        const previousBottom = (this.y - this.velocityY) + this.height;
        if (this.velocityY >= 0 && previousBottom <= platform.y && (this.y + this.height) >= platform.y) {
          this.y = platform.y - this.height;
          this.velocityY = 0;
          onPlatform = true;
          break;
        }
      }
    }
    this.isJumping = !onPlatform;

    // Jumping
    if ((input.keys.has('ArrowUp') || input.keys.has('w') || input.keys.has(' ')) && onPlatform) {
      this.velocityY = PLAYER_JUMP_FORCE;
      this.isJumping = true;
    }

    // World bounds collision
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > WORLD_WIDTH) this.x = WORLD_WIDTH - this.width;

    // Update animation state
    if (this.isJumping) {
      this.setState(this.velocityY < 0 ? 'jump' : 'fall');
    } else if (Math.abs(this.velocityX) > 0.1) {
      this.setState('run');
    } else {
      this.setState('idle');
    }

    // Update animation frame
    const anim = animations[this.currentState];
    this.frameTimer++;
    if (this.frameTimer > anim.speed) {
        this.frameTimer = 0;
        this.frameX = (this.frameX + 1) % anim.frames;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    let drawX = this.x;
    // Flip canvas horizontally if facing left
    if (this.facingDirection === 'left') {
      ctx.scale(-1, 1);
      // We need to draw at a mirrored coordinate
      drawX = -this.x - this.width;
    }
    
    const anim = animations[this.currentState];

    ctx.drawImage(
      playerSpriteSheet,
      this.frameX * FRAME_WIDTH,   // sx (source x)
      anim.row * FRAME_HEIGHT,    // sy (source y)
      FRAME_WIDTH,                // sWidth (source width)
      FRAME_HEIGHT,               // sHeight (source height)
      drawX,                      // dx (destination x)
      this.y,                      // dy (destination y)
      this.width,                 // dWidth (destination width)
      this.height                 // dHeight (destination height)
    );

    ctx.restore();
  }
}
