/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export class InputHandler {
  public keys: Set<string>;

  constructor() {
    this.keys = new Set();
    this.init();
  }

  private init() {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key);
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key);
    });
  }
}
