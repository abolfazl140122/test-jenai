/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Centralized audio control.

class AudioManager {
  private music: HTMLAudioElement | null = null;
  private sfx: (HTMLAudioElement | null)[] = [];
  
  private masterVolume: number;
  private musicVolume: number;
  private sfxVolume: number;
  
  constructor() {
    this.masterVolume = parseFloat(localStorage.getItem('masterVolume') || '0.8');
    this.musicVolume = parseFloat(localStorage.getItem('musicVolume') || '0.6');
    this.sfxVolume = parseFloat(localStorage.getItem('sfxVolume') || '0.9');
  }

  init() {
    this.music = document.getElementById('background-music') as HTMLAudioElement;
    this.sfx.push(document.getElementById('sfx-gunshot') as HTMLAudioElement);
    this.sfx.push(document.getElementById('sfx-hover') as HTMLAudioElement);
    this.updateAllVolumes();
  }

  getVolumes() {
    return {
      master: this.masterVolume,
      music: this.musicVolume,
      sfx: this.sfxVolume,
    };
  }
  
  setMasterVolume(level: number) {
    this.masterVolume = level;
    localStorage.setItem('masterVolume', String(level));
    this.updateAllVolumes();
  }
  
  setMusicVolume(level: number) {
    this.musicVolume = level;
    localStorage.setItem('musicVolume', String(level));
    this.updateMusicVolume();
  }
  
  setSfxVolume(level: number) {
    this.sfxVolume = level;
    localStorage.setItem('sfxVolume', String(level));
    this.updateSfxVolume();
  }

  startMusic() {
    if (this.music) {
      this.music.play().catch(e => console.error("Background music failed to play:", e));
    }
  }

  private updateAllVolumes() {
    this.updateMusicVolume();
    this.updateSfxVolume();
  }

  private updateMusicVolume() {
    if (this.music) {
      this.music.volume = this.musicVolume * this.masterVolume;
    }
  }

  private updateSfxVolume() {
    this.sfx.forEach(sound => {
      if (sound) {
        sound.volume = this.sfxVolume * this.masterVolume;
      }
    });
  }
}

export const audioManager = new AudioManager();
