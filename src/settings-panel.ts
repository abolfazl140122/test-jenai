/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { audioManager } from './audio-manager';
import { setLanguage } from './i18n';

export const initSettingsPanel = () => {
  const panel = document.getElementById('settings-panel') as HTMLElement;
  if (!panel) return;
  
  const closeButton = panel.querySelector('.panel-close-button') as HTMLButtonElement;
  const app = document.getElementById('app') as HTMLElement;

  const masterVolumeSlider = document.getElementById('master-volume') as HTMLInputElement;
  const musicVolumeSlider = document.getElementById('music-volume') as HTMLInputElement;
  const sfxVolumeSlider = document.getElementById('sfx-volume') as HTMLInputElement;
  
  if (!closeButton || !app || !masterVolumeSlider || !musicVolumeSlider || !sfxVolumeSlider) {
    console.error('Settings panel elements not found!');
    return;
  }
  
  // Initialize slider positions from audioManager
  const initialVolumes = audioManager.getVolumes();
  masterVolumeSlider.value = String(initialVolumes.master * 100);
  musicVolumeSlider.value = String(initialVolumes.music * 100);
  sfxVolumeSlider.value = String(initialVolumes.sfx * 100);
  
  // --- Event Listeners ---
  
  const closePanel = () => {
    panel.classList.remove('visible');
    app.classList.remove('panel-open');
  };
  closeButton.addEventListener('click', closePanel);

  masterVolumeSlider.addEventListener('input', () => {
    audioManager.setMasterVolume(parseInt(masterVolumeSlider.value) / 100);
  });
  
  musicVolumeSlider.addEventListener('input', () => {
    audioManager.setMusicVolume(parseInt(musicVolumeSlider.value) / 100);
  });

  sfxVolumeSlider.addEventListener('input', () => {
    audioManager.setSfxVolume(parseInt(sfxVolumeSlider.value) / 100);
  });

  panel.querySelectorAll('.lang-button').forEach(button => {
    button.addEventListener('click', () => {
      const lang = (button as HTMLElement).dataset.lang;
      if (lang) {
        setLanguage(lang);
      }
    });
  });
};
