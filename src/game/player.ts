/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { GRAVITY, PLAYER_JUMP_FORCE, PLAYER_MOVE_SPEED, PLAYER_FRICTION, WORLD_WIDTH } from './constants';
import { InputHandler } from './input-handler';
import { Platform } from './platform';

const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 60;

// Animation state keys
type PlayerState = 'idle' | 'run' | 'jump' | 'fall';

export class Player {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public velocityX: number;
  public velocityY: number;
  private isJumping: boolean;

  // Animation state
  private currentState: PlayerState = 'idle';
  private animationTimer = 0;
  private facingDirection: 'right' | 'left' = 'right';

  constructor(private canvasWidth: number, private canvasHeight: number) {
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.x = (this.canvasWidth - this.width) / 2;
    this.y = this.canvasHeight - this.height - 200;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isJumping = true;
  }

  private setState(newState: PlayerState) {
    if (this.currentState !== newState) {
        this.currentState = newState;
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

    // Update animation timer
    this.animationTimer++;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    // Flip canvas horizontally if facing left
    if (this.facingDirection === 'left') {
      ctx.translate(centerX, centerY);
      ctx.scale(-1, 1);
      ctx.translate(-centerX, -centerY);
    }
    
    // --- Draw Player ---
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    
    // Body
    const bodyGradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    bodyGradient.addColorStop(0, '#00ffff');
    bodyGradient.addColorStop(1, '#008f8f');
    ctx.fillStyle = bodyGradient;

    const bodyYOffset = this.currentState === 'idle' ? Math.sin(this.animationTimer * 0.05) * 2 : 0;
    const bodyTilt = this.currentState === 'run' ? Math.sin(this.animationTimer * 0.4) * 0.08 : 0;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(bodyTilt);
    ctx.translate(-centerX, -centerY);
    this.drawRoundedRect(ctx, this.x, this.y + bodyYOffset, this.width, this.height, 10);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Eyes
    const eyeY = this.y + this.height * 0.35 + bodyYOffset;
    const eyeX1 = this.x + this.width * 0.3;
    const eyeX2 = this.x + this.width * 0.7;
    const eyeRadiusX = 5;
    let eyeRadiusY = 8;
    
    if (this.currentState === 'idle' && this.animationTimer % 200 < 5) {
      eyeRadiusY = 1;
    }
    if (this.currentState === 'jump' || this.currentState === 'fall') {
      eyeRadiusY = 4;
    }
    
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.ellipse(eyeX1, eyeY, eyeRadiusX, eyeRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(eyeX2, eyeY, eyeRadiusX, eyeRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pupils
    ctx.fillStyle = '#000';
    const pupilXOffset = Math.max(-1, Math.min(1, this.velocityX)); // Pupil follows movement
    ctx.beginPath();
    ctx.arc(eyeX1 + pupilXOffset, eyeY, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(eyeX2 + pupilXOffset, eyeY, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth
    const mouthY = this.y + this.height * 0.65 + bodyYOffset;
    ctx.beginPath();
    ctx.moveTo(this.x + this.width * 0.35, mouthY);
    if(this.currentState === 'jump') {
        ctx.arc(this.x + this.width * 0.5, mouthY, 5, 0, Math.PI, false);
    } else {
        ctx.quadraticCurveTo(this.x + this.width * 0.5, mouthY + 5, this.x + this.width * 0.65, mouthY);
    }
    ctx.stroke();
    
    // Legs
    const legWidth = 10;
    const legHeight = 16;
    const legY = this.y + this.height - 5;
    
    let leg1Angle = 0;
    let leg2Angle = 0;

    if (this.currentState === 'run') {
        leg1Angle = Math.sin(this.animationTimer * 0.4) * 0.8;
        leg2Angle = -Math.sin(this.animationTimer * 0.4) * 0.8;
    } else if (this.currentState === 'jump' || this.currentState === 'fall') {
        leg1Angle = 0.3;
        leg2Angle = -0.3;
    }

    ctx.fillStyle = bodyGradient;
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 5;

    // Leg 1
    ctx.save();
    ctx.translate(this.x + this.width * 0.3, legY);
    ctx.rotate(leg1Angle);
    this.drawRoundedRect(ctx, -legWidth/2, 0, legWidth, legHeight, 4);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    
    // Leg 2
    ctx.save();
    ctx.translate(this.x + this.width * 0.7, legY);
    ctx.rotate(leg2Angle);
    this.drawRoundedRect(ctx, -legWidth/2, 0, legWidth, legHeight, 4);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }
  
  private drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}
