/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Initializes and manages the audio preloading screen.
 * Downloads the audio file while showing progress, then waits for
 * user interaction to start the music and the rest of the app.
 * @returns A promise that resolves when the user clicks the "engage" button.
 */
export const initAudioPreloader = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const preloader = document.getElementById('audio-preloader') as HTMLElement;
    const preloaderContent = document.getElementById('audio-preloader-content') as HTMLElement;
    const progressBar = document.getElementById('audio-progress-bar') as HTMLElement;
    const progressText = document.getElementById('audio-progress-text') as HTMLElement;
    const audioElement = document.getElementById('background-music') as HTMLAudioElement;

    if (!preloader || !preloaderContent || !progressBar || !progressText || !audioElement) {
      const errorMsg = 'Audio preloader elements not found!';
      console.error(errorMsg);
      return reject(new Error(errorMsg));
    }

    // FIX: Using a public, CORS-friendly URL to prevent loading issues.
    const audioSrc = 'https://cdn.pixabay.com/audio/2022/11/17/audio_3536348259.mp3';
    
    audioElement.loop = true;

    let loadingTimeout: number;

    const cleanupListeners = () => {
      clearTimeout(loadingTimeout);
      audioElement.removeEventListener('progress', updateProgress);
      audioElement.removeEventListener('canplaythrough', onCanPlayThrough);
      audioElement.removeEventListener('error', onError);
    };

    const updateProgress = () => {
      if (audioElement.duration > 0) {
        let percentComplete = 0;
        if (audioElement.buffered.length > 0) {
            const bufferedEnd = audioElement.buffered.end(audioElement.buffered.length - 1);
            percentComplete = (bufferedEnd / audioElement.duration) * 100;
        }
        
        const currentWidth = parseFloat(progressBar.style.width) || 0;
        const newWidth = Math.min(percentComplete, 100);

        if (newWidth > currentWidth) {
            progressBar.style.width = `${newWidth}%`;
            progressText.textContent = `${Math.round(newWidth)}%`;
        }
      }
    };
    
    const onCanPlayThrough = () => {
        cleanupListeners();
        // Ensure progress is at 100%
        progressBar.style.width = '100%';
        progressText.textContent = '100%';
        
        // Present a start button to the user to comply with autoplay policies.
        preloaderContent.innerHTML = `
          <h2>AURAL SENSORS CALIBRATED</h2>
          <p>Engage protocol to begin.</p>
          <button id="start-experience-button">ENGAGE</button>
        `;

        const startButton = document.getElementById('start-experience-button') as HTMLButtonElement;
        startButton.addEventListener('click', () => {
          audioElement.play().catch(e => console.error("Audio play failed:", e));
          
          preloader.style.opacity = '0';
          preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
            resolve();
          }, { once: true });
        }, { once: true });
    };
    
    const onError = () => {
      cleanupListeners();

      // FIX: Display a user-friendly error message in the UI.
      preloaderContent.innerHTML = `
        <h2 style="color: #ff4141;">ASSET LOAD FAILED</h2>
        <p>Could not load essential audio assets.<br>Please check your connection and refresh.</p>
      `;
      reject(new Error('A network error or file error occurred during the audio file request.'));
    };

    audioElement.addEventListener('progress', updateProgress);
    audioElement.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
    audioElement.addEventListener('error', onError, { once: true });
    
    