/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export class Platform {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Add a top highlight for a 3D effect
    ctx.fillStyle = '#aaffff';
    ctx.shadowBlur = 0;
    ctx.fillRect(this.x, this.y, this.width, 4);
  }
}
