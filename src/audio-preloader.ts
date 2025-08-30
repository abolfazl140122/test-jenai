/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// A list of audio assets to be preloaded.
const audioAssets = [
  { 
    id: 'background-music', 
    src: 'https://raw.githubusercontent.com/abolfazl140122/test-jenai/ffb7502131ba540eeeb37822af07d01dc824bccf/scary-ambience-music-347437.mp3', 
    loop: true 
  },
  { 
    id: 'sfx-gunshot', 
    src: 'https://github.com/abolfazl140122/test-jenai/raw/09793ef2205567f211dae4b31d6f3cc79e5d36e6/rifle-gunshot-99749.mp3', 
    loop: false 
  }
];


/**
 * Initializes and manages the audio preloading screen.
 * Downloads multiple audio files while showing combined progress, then waits for
 * user interaction to start the music and the rest of the app.
 * @returns A promise that resolves when the user clicks the "engage" button.
 */
export const initAudioPreloader = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const preloader = document.getElementById('audio-preloader') as HTMLElement;
    const preloaderContent = document.getElementById('audio-preloader-content') as HTMLElement;
    const progressBar = document.getElementById('audio-progress-bar') as HTMLElement;
    const progressText = document.getElementById('audio-progress-text') as HTMLElement;

    if (!preloader || !preloaderContent || !progressBar || !progressText) {
      const errorMsg = 'Audio preloader UI elements not found!';
      console.error(errorMsg);
      return reject(new Error(errorMsg));
    }
    
    let loadedCount = 0;
    const assetsToLoad = audioAssets.length;
    const progressPerAsset: Record<string, number> = {};

    const updateOverallProgress = () => {
      let totalProgress = 0;
      Object.values(progressPerAsset).forEach(p => { totalProgress += p; });
      
      const overallPercent = totalProgress / assetsToLoad;

      progressBar.style.width = `${overallPercent}%`;
      progressText.textContent = `${Math.round(overallPercent)}%`;
    };
    
    const onAllAssetsReady = () => {
        progressBar.style.width = '100%';
        progressText.textContent = '100%';
        
        preloaderContent.innerHTML = `
          <h2>AURAL SENSORS CALIBRATED</h2>
          <p>Engage protocol to begin.</p>
          <button id="start-experience-button">ENGAGE</button>
        `;

        const startButton = document.getElementById('start-experience-button') as HTMLButtonElement;
        const backgroundMusic = document.getElementById('background-music') as HTMLAudioElement;

        startButton.addEventListener('click', () => {
          if (backgroundMusic) {
             backgroundMusic.play().catch(e => console.error("Background music play failed:", e));
          }
          
          preloader.style.opacity = '0';
          preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
            resolve();
          }, { once: true });
        }, { once: true });
    };
    
    const onAssetError = (id: string, event: Event) => {
      console.error(`Failed to load audio asset: ${id}`, event);
      // Stop all loading and show error
      audioAssets.forEach(asset => {
          const el = document.getElementById(asset.id) as HTMLAudioElement;
          if (el) el.src = ''; // Stop any further loading
      });
      preloaderContent.innerHTML = `
        <h2 style="color: #ff4141;">ASSET LOAD FAILED</h2>
        <p>Could not load essential audio assets.<br>Please check your connection and refresh.</p>
      `;
      reject(new Error(`Failed to load audio asset: ${id}`));
    };


    audioAssets.forEach(asset => {
        const audioElement = document.getElementById(asset.id) as HTMLAudioElement;

        if (!audioElement) {
            return onAssetError(asset.id, new Event('Element not found'));
        }

        progressPerAsset[asset.id] = 0;
        audioElement.loop = asset.loop;
        
        const updateAssetProgress = () => {
            if (audioElement.duration > 0 && audioElement.buffered.length > 0) {
                const bufferedEnd = audioElement.buffered.end(audioElement.buffered.length - 1);
                const percentComplete = (bufferedEnd / audioElement.duration) * 100;
                progressPerAsset[asset.id] = Math.min(percentComplete, 100);
            }
            updateOverallProgress();
        };

        const onCanPlayThrough = () => {
            cleanupListenersForAsset();
            progressPerAsset[asset.id] = 100;
            updateOverallProgress();
            loadedCount++;
            if (loadedCount === assetsToLoad) {
                onAllAssetsReady();
            }
        };

        const onError = (e: Event) => {
            cleanupListenersForAsset();
            onAssetError(asset.id, e);
        };

        const cleanupListenersForAsset = () => {
            audioElement.removeEventListener('progress', updateAssetProgress);
            audioElement.removeEventListener('canplaythrough', onCanPlayThrough);
            audioElement.removeEventListener('error', onError);
        };
        
        audioElement.addEventListener('progress', updateAssetProgress);
        audioElement.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
        audioElement.addEventListener('error', onError, { once: true });
        
        audioElement.src = asset.src;
        audioElement.load();
    });
  });
};