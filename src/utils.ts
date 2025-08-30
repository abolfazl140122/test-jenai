/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Throttles a function to prevent it from being called too frequently.
 * @param func The function to throttle.
 * @param limit The minimum time in milliseconds between calls.
 * @returns The throttled function.
 */
export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number): T => {
  let inThrottle: boolean;
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  } as T;
};