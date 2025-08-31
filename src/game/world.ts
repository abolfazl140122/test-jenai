/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { Platform } from './platform';

export const platforms: Platform[] = [];

export function generateWorld(worldWidth: number, canvasHeight: number) {
  platforms.length = 0; // Clear existing platforms

  const groundLevel = canvasHeight - 80;

  // Ground platform
  platforms.push(new Platform(-200, groundLevel, worldWidth + 400, 80));

  // Add some floating platforms
  platforms.push(new Platform(400, groundLevel - 150, 250, 30));
  platforms.push(new Platform(800, groundLevel - 250, 200, 30));
  platforms.push(new Platform(1200, groundLevel - 180, 300, 30));
  platforms.push(new Platform(1350, groundLevel - 350, 150, 30));
  platforms.push(new Platform(1800, groundLevel - 100, 400, 30));
  platforms.push(new Platform(2400, groundLevel - 220, 150, 30));
  platforms.push(new Platform(2600, groundLevel - 350, 150, 30));
  platforms.push(new Platform(2800, groundLevel - 480, 150, 30));
  platforms.push(new Platform(3200, groundLevel - 150, 500, 30));
}

export function drawWorld(ctx: CanvasRenderingContext2D) {
  platforms.forEach(platform => platform.draw(ctx));
}
