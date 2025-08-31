/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// --- I18N ---
const translations = {
  en: {
    'audioPreloaderTitle': 'CALIBRATING AURAL SENSORS...',
    'audioPreloaderDesc': 'This experience requires audio. Please ensure your sound is enabled.',
    'audioCalibrated': 'AURAL SENSORS CALIBRATED',
    'audioEngagePrompt': 'Engage protocol to begin.',
    'audioEngageButton': 'ENGAGE',
    'startMission': 'START MISSION',
    'loadData': 'LOAD DATA',
    'settings': 'SETTINGS',
    'exit': 'EXIT',
    'gameTitle': 'BREACH PROTOCOL',
    'gameSubtitle': 'SYSTEM KERNEL // v2.5',
    'settingsTitle': '// SETTINGS',
    'masterVolume': 'Master Volume',
    'musicVolume': 'Music Volume',
    'sfxVolume': 'SFX Volume',
    'language': 'Language',
    'close': 'CLOSE',
    'loadDataTitle': '// LOAD DATA',
    'saveSlot1': 'SAVE SLOT 1',
    'saveSlot2': 'SAVE SLOT 2',
    'saveSlot3': 'SAVE SLOT 3',
    'empty': '[EMPTY]',
    'back': 'BACK',
    'missionSelectTitle': '// SELECT MISSION',
    'prologueTitle': 'PROLOGUE: THE HEIST',
    'prologueDesc': 'Infiltrate Arasaka Tower and secure the package.',
    'chapter1Title': 'CHAPTER 1: GHOST IN THE MACHINE',
    'chapter1Desc': '[LOCKED]',
    'chapter2Title': 'CHAPTER 2: DATA HAVEN',
    'chapter2Desc': '[LOCKED]',
    'motionTitle': 'Motion Control',
    'motionDesc': 'Enable motion controls for an enhanced experience.',
    'motionEnable': 'Enable',
  },
  fa: {
    'audioPreloaderTitle': 'در حال کالیبره کردن سنسورهای صوتی...',
    'audioPreloaderDesc': 'این تجربه نیاز به صدا دارد. لطفا از فعال بودن صدای خود اطمینان حاصل کنید.',
    'audioCalibrated': 'سنسورهای صوتی کالیبره شدند',
    'audioEngagePrompt': 'برای شروع، پروتکل را فعال کنید.',
    'audioEngageButton': 'فعال‌سازی',
    'startMission': 'شروع ماموریت',
    'loadData': 'بارگیری داده',
    'settings': 'تنظیمات',
    'exit': 'خروج',
    'gameTitle': 'پروتکل نفوذ',
    'gameSubtitle': 'هسته سیستم // نسخه ۲.۵',
    'settingsTitle': '// تنظیمات',
    'masterVolume': 'صدای اصلی',
    'musicVolume': 'صدای موسیقی',
    'sfxVolume': 'جلوه‌های صوتی',
    'language': 'زبان',
    'close': 'بستن',
    'loadDataTitle': '// بارگیری داده',
    'saveSlot1': 'اسلات ذخیره ۱',
    'saveSlot2': 'اسلات ذخیره ۲',
    'saveSlot3': 'اسلات ذخیره ۳',
    'empty': '[خالی]',
    'back': 'بازگشت',
    'missionSelectTitle': '// انتخاب ماموریت',
    'prologueTitle': 'مقدمه: سرقت',
    'prologueDesc': 'به برج آراساکا نفوذ کرده و بسته را ایمن کنید.',
    'chapter1Title': 'فصل ۱: شبح در ماشین',
    'chapter1Desc': '[قفل شده]',
    'chapter2Title': 'فصل ۲: پناهگاه داده',
    'chapter2Desc': '[قفل شده]',
    'motionTitle': 'کنترل حرکتی',
    'motionDesc': 'برای تجربه بهتر، کنترل‌های حرکتی را فعال کنید.',
    'motionEnable': 'فعال کردن',
  }
};
let currentLanguage = 'en';

const setLanguage = (lang) => {
  if (!translations[lang]) return;
  currentLanguage = lang;
  document.body.dataset.lang = lang;
  localStorage.setItem('gameLanguage', lang);

  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.dataset.i18nKey;
    const translation = translations[lang][key];
    if (translation) {
      el.innerText = translation;
      if(el.dataset.value) {
        el.dataset.value = translation;
      }
    }
  });

  document.querySelectorAll('.lang-button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
};

const initI18n = () => {
  const savedLang = localStorage.getItem('gameLanguage');
  const lang = savedLang && translations[savedLang] ? savedLang : 'en';
  setLanguage(lang);
};

// --- AUDIO MANAGER ---
class AudioManager {
  constructor() {
    this.masterVolume = parseFloat(localStorage.getItem('masterVolume') || '0.8');
    this.musicVolume = parseFloat(localStorage.getItem('musicVolume') || '0.6');
    this.sfxVolume = parseFloat(localStorage.getItem('sfxVolume') || '0.9');
    this.sfx = [];
  }

  init() {
    this.music = document.getElementById('background-music');
    this.sfx.push(document.getElementById('sfx-gunshot'));
    this.sfx.push(document.getElementById('sfx-hover'));
    this.updateAllVolumes();
  }

  getVolumes() {
    return {
      master: this.masterVolume,
      music: this.musicVolume,
      sfx: this.sfxVolume,
    };
  }
  
  setMasterVolume(level) {
    this.masterVolume = level;
    localStorage.setItem('masterVolume', String(level));
    this.updateAllVolumes();
  }
  
  setMusicVolume(level) {
    this.musicVolume = level;
    localStorage.setItem('musicVolume', String(level));
    this.updateMusicVolume();
  }
  
  setSfxVolume(level) {
    this.sfxVolume = level;
    localStorage.setItem('sfxVolume', String(level));
    this.updateSfxVolume();
  }

  startMusic() {
    if (this.music) {
      this.music.play().catch(e => console.error("Background music failed to play:", e));
    }
  }

  updateAllVolumes() {
    this.updateMusicVolume();
    this.updateSfxVolume();
  }

  updateMusicVolume() {
    if (this.music) {
      this.music.volume = this.musicVolume * this.masterVolume;
    }
  }

  updateSfxVolume() {
    this.sfx.forEach(sound => {
      if (sound) {
        sound.volume = this.sfxVolume * this.masterVolume;
      }
    });
  }
}
const audioManager = new AudioManager();

// --- UTILS ---
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// --- AUDIO PRELOADER LOGIC ---
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
  },
  {
    id: 'sfx-hover',
    src: 'https://github.com/abolfazl140122/test-jenai/raw/61b25b36b5ec9a32a8f7bb27a9b532818d80390b/glitch-01-231255.mp3',
    loop: false
  }
];

const initAudioPreloader = () => {
  return new Promise((resolve, reject) => {
    const preloader = document.getElementById('audio-preloader');
    const preloaderContent = document.getElementById('audio-preloader-content');
    const progressBar = document.getElementById('audio-progress-bar');
    const progressText = document.getElementById('audio-progress-text');

    if (!preloader || !preloaderContent || !progressBar || !progressText) {
      return reject(new Error('Audio preloader UI elements not found!'));
    }
    
    let loadedCount = 0;
    const assetsToLoad = audioAssets.length;
    const progressPerAsset = {};

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
          <h2 data-i18n-key="audioCalibrated">AURAL SENSORS CALIBRATED</h2>
          <p data-i18n-key="audioEngagePrompt">Engage protocol to begin.</p>
          <button id="start-experience-button" data-i18n-key="audioEngageButton">ENGAGE</button>
        `;
        setLanguage(currentLanguage); // Re-apply translations

        const startButton = document.getElementById('start-experience-button');
        startButton.addEventListener('click', () => {
          audioManager.init();
          audioManager.startMusic();
          preloader.style.opacity = '0';
          preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
            resolve();
          }, { once: true });
        }, { once: true });
    };
    
    const onAssetError = (id, event) => {
      console.error(`Failed to load audio asset: ${id}`, event);
      audioAssets.forEach(asset => {
          const el = document.getElementById(asset.id);
          if (el) el.src = '';
      });
      preloaderContent.innerHTML = `
        <h2 style="color: #ff4141;">ASSET LOAD FAILED</h2>
        <p>Could not load essential audio assets.<br>Please check your connection and refresh.</p>
      `;
      reject(new Error(`Failed to load audio asset: ${id}`));
    };

    audioAssets.forEach(asset => {
        const audioElement = document.getElementById(asset.id);
        if (!audioElement) return onAssetError(asset.id, new Event('Element not found'));

        progressPerAsset[asset.id] = 0;
        audioElement.loop = asset.loop;
        
        const onAssetReady = () => {
            cleanupListeners();
            progressPerAsset[asset.id] = 100;
            updateOverallProgress();
            loadedCount++;
            if (loadedCount === assetsToLoad) onAllAssetsReady();
        };

        const onError = (e) => {
            cleanupListeners();
            onAssetError(asset.id, e);
        };

        const cleanupListeners = () => {
            audioElement.removeEventListener('loadeddata', onAssetReady);
            audioElement.removeEventListener('error', onError);
        };
        
        audioElement.addEventListener('loadeddata', onAssetReady, { once: true });
        audioElement.addEventListener('error', onError, { once: true });
        
        audioElement.src = asset.src;
        audioElement.load();
    });
  });
};


// --- LOADING SCREEN LOGIC ---
const initLoadingScreen = () => {
  return new Promise((resolve) => {
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    const loadingScreen = document.getElementById('loading-screen');
    const logo = document.getElementById('logo');
    const glowContainer = document.getElementById('glow-container');
    const vignette = document.querySelector('.vignette');
    const bloodOverlay = document.getElementById('blood-overlay');
    const gunshotSfx = document.getElementById('sfx-gunshot');

    if (!loadingBar || !loadingText || !loadingScreen || !logo || !glowContainer || !vignette || !bloodOverlay || !gunshotSfx) {
      console.error('Core cinematic elements not found!');
      resolve(); // Resolve immediately if elements are missing
      return;
    }

    loadingScreen.style.transition = 'opacity 1.5s ease-in';
    requestAnimationFrame(() => {
        loadingScreen.style.opacity = '1';
    });

    let animationFrameId;
    let startTime = null;
    const loadingDuration = 4000;

    const handleBreachClick = () => {
      if (gunshotSfx) {
        gunshotSfx.currentTime = 0;
        gunshotSfx.play().catch(e => console.error("Gunshot SFX failed to play:", e));
      }

      bloodOverlay.innerHTML = '';
      const mainSplatter = document.createElement('div');
      mainSplatter.classList.add('blood-splatter');
      bloodOverlay.appendChild(mainSplatter);

      const dropletCount = 25;
      for (let i = 0; i < dropletCount; i++) {
          const droplet = document.createElement('div');
          droplet.classList.add('blood-droplet');
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * (Math.min(window.innerWidth, window.innerHeight) / 2);
          const x = Math.cos(angle) * distance * (1 + Math.random());
          const y = Math.sin(angle) * distance * (1 + Math.random());
          const size = 3 + Math.random() * 10;
          const rotation = Math.random() * 360;
          const delay = Math.random() * 0.15;
          const duration = 0.5 + Math.random() * 0.5;
          droplet.style.setProperty('--x', `${x}px`);
          droplet.style.setProperty('--y', `${y}px`);
          droplet.style.setProperty('--size', `${size}px`);
          droplet.style.setProperty('--rotation', `${rotation}deg`);
          droplet.style.animationDelay = `${delay}s`;
          droplet.style.animationDuration = `${duration}s`;
          bloodOverlay.appendChild(droplet);
      }
      
      loadingScreen.style.transition = 'opacity 0.8s ease-out 0.3s';
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
      }, 400); 

      loadingScreen.addEventListener('transitionend', () => {
          loadingScreen.style.display = 'none';
          resolve();
      }, { once: true });
    };

    const cinematicLoad = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const progress = (elapsedTime / loadingDuration) * 100;
      const displayProgress = Math.min(progress, 100);
      loadingBar.style.width = `${displayProgress}%`;

      if (displayProgress <= 20) {
        if (!logo.classList.contains('glitching')) {
          logo.classList.add('glitching');
          loadingText.classList.add('glitching');
          loadingScreen.classList.add('shaking');
        }
      } else if (displayProgress <= 80) {
        if (!glowContainer.classList.contains('active')) {
          loadingText.textContent = "SYSTEM ONLINE";
          glowContainer.classList.add('active');
        }
      } else if (displayProgress < 100) {
        if (!vignette.classList.contains('warning')) {
          loadingText.textContent = "WARNING: BREACH DETECTED";
          vignette.classList.add('warning');
        }
      }

      if (displayProgress >= 100) {
        cancelAnimationFrame(animationFrameId);
        if (loadingScreen.classList.contains('shaking')) {
            loadingScreen.classList.remove('shaking');
            loadingScreen.classList.add('shaking-stopping');
        }
        if (logo.classList.contains('glitching')) {
            logo.classList.remove('glitching');
            logo.classList.add('glitching-stopping');
        }
        if (loadingText.classList.contains('glitching')) {
            loadingText.classList.remove('glitching');
            loadingText.classList.add('glitching-stopping');
        }
        setTimeout(() => {
          loadingScreen.classList.remove('shaking-stopping');
          logo.classList.remove('glitching-stopping');
          loadingText.classList.remove('glitching-stopping');
          glowContainer.style.opacity = '0';
          vignette.classList.remove('warning');
          loadingText.style.opacity = '0';
          setTimeout(() => {
            loadingText.textContent = 'BREACH';
            loadingText.classList.add('ready-breach');
            loadingText.style.opacity = '1';
            loadingText.addEventListener('click', handleBreachClick, { once: true });
          }, 500); 
        }, 1000); 
        return;
      }
      animationFrameId = requestAnimationFrame(cinematicLoad);
    };
    
    setTimeout(() => {
      animationFrameId = requestAnimationFrame(cinematicLoad);
    }, 500);
  });
};

// --- GAME LOGIC ---
const GRAVITY = 0.5;
const PLAYER_JUMP_FORCE = -15;
const PLAYER_MOVE_SPEED = 5;
const PLAYER_FRICTION = 0.8;
const PLAYER_SIZE = 50;

class InputHandler {
  constructor() {
    this.keys = new Set();
    this.init();
  }
  init() {
    window.addEventListener('keydown', (e) => { this.keys.add(e.key.toLowerCase()); });
    window.addEventListener('keyup', (e) => { this.keys.delete(e.key.toLowerCase()); });
  }
}

class Player {
  constructor(canvasWidth, canvasHeight) {
    this.width = PLAYER_SIZE;
    this.height = PLAYER_SIZE;
    this.x = (canvasWidth - this.width) / 2;
    this.y = canvasHeight - this.height - 100;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isJumping = false;
    this.canvasWidth = canvasWidth;
  }

  update(input, groundLevel) {
    if (input.keys.has('arrowleft') || input.keys.has('a')) {
      this.velocityX = -PLAYER_MOVE_SPEED;
    } else if (input.keys.has('arrowright') || input.keys.has('d')) {
      this.velocityX = PLAYER_MOVE_SPEED;
    } else {
      this.velocityX *= PLAYER_FRICTION;
    }

    if ((input.keys.has('arrowup') || input.keys.has('w') || input.keys.has(' ')) && !this.isJumping) {
      this.velocityY = PLAYER_JUMP_FORCE;
      this.isJumping = true;
    }

    this.velocityY += GRAVITY;
    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.y + this.height > groundLevel) {
      this.y = groundLevel - this.height;
      this.velocityY = 0;
      this.isJumping = false;
    }

    if (this.x < 0) this.x = 0;
    if (this.x + this.width > this.canvasWidth) this.x = this.canvasWidth - this.width;
  }

  draw(ctx) {
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.shadowBlur = 0;
  }
}

const gameEngine = {
  canvas: null,
  ctx: null,
  player: null,
  inputHandler: null,
  groundLevel: 0,

  init: function() {
    this.canvas = document.getElementById('game-canvas');
    if (!this.canvas) return console.error('Game canvas not found!');
    this.ctx = this.canvas.getContext('2d');
    
    window.addEventListener('resize', this.resizeCanvas.bind(this));
    this.resizeCanvas();

    this.player = new Player(this.canvas.width, this.canvas.height);
    this.inputHandler = new InputHandler();

    this.gameLoop();
  },

  resizeCanvas: function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.groundLevel = this.canvas.height - 80;
    if (this.player) {
      this.player.canvasWidth = this.canvas.width;
    }
  },

  drawGround: function() {
    this.ctx.strokeStyle = '#00ffff';
    this.ctx.lineWidth = 4;
    this.ctx.shadowColor = '#00ffff';
    this.ctx.shadowBlur = 10;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.groundLevel);
    this.ctx.lineTo(this.canvas.width, this.groundLevel);
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  },

  gameLoop: function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.update(this.inputHandler, this.groundLevel);
    this.drawGround();
    this.player.draw(this.ctx);
    requestAnimationFrame(this.gameLoop.bind(this));
  }
};

let isGameInitialized = false;
const startGame = () => {
  const gameView = document.getElementById('game-view');
  if (!gameView) return;
  gameView.classList.add('visible');
  if (!isGameInitialized) {
    gameEngine.init();
    isGameInitialized = true;
  }
};

// --- PANELS ---
const initSettingsPanel = () => {
  const panel = document.getElementById('settings-panel');
  if (!panel) return;
  
  const closeButton = panel.querySelector('.panel-close-button');
  const app = document.getElementById('app');
  const masterVolume = document.getElementById('master-volume');
  const musicVolume = document.getElementById('music-volume');
  const sfxVolume = document.getElementById('sfx-volume');
  
  if (!closeButton || !app || !masterVolume || !musicVolume || !sfxVolume) return;
  
  const initialVolumes = audioManager.getVolumes();
  masterVolume.value = initialVolumes.master * 100;
  musicVolume.value = initialVolumes.music * 100;
  sfxVolume.value = initialVolumes.sfx * 100;
  
  const closePanel = () => {
    panel.classList.remove('visible');
    app.classList.remove('panel-open');
  };
  closeButton.addEventListener('click', closePanel);

  masterVolume.addEventListener('input', (e) => audioManager.setMasterVolume(parseInt(e.target.value) / 100));
  musicVolume.addEventListener('input', (e) => audioManager.setMusicVolume(parseInt(e.target.value) / 100));
  sfxVolume.addEventListener('input', (e) => audioManager.setSfxVolume(parseInt(e.target.value) / 100));

  panel.querySelectorAll('.lang-button').forEach(button => {
    button.addEventListener('click', () => {
      setLanguage(button.dataset.lang);
    });
  });
};

const initLoadDataPanel = () => {
  const panel = document.getElementById('load-data-panel');
  if (!panel) return;
  const closeButton = panel.querySelector('.panel-close-button');
  const app = document.getElementById('app');
  if (!closeButton || !app) return;
  closeButton.addEventListener('click', () => {
    panel.classList.remove('visible');
    app.classList.remove('panel-open');
  });
};

const initStartMissionPanel = () => {
  const panel = document.getElementById('start-mission-panel');
  if (!panel) return;
  const closeButton = panel.querySelector('.panel-close-button');
  const app = document.getElementById('app');
  const prologueMission = panel.querySelector('.mission-item:not(.locked)');
  if (!closeButton || !app || !prologueMission) return;

  closeButton.addEventListener('click', () => {
    panel.classList.remove('visible');
    app.classList.remove('panel-open');
  });

  prologueMission.addEventListener('click', () => {
    app.style.transition = 'opacity 0.5s ease-out';
    app.style.opacity = '0';
    setTimeout(() => {
      app.style.display = 'none';
      startGame();
    }, 500);
  });
};

// --- MAIN MENU ---
const initMainMenu = () => {
  const app = document.getElementById('app');
  if (!app) return;
  
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let inputX = window.innerWidth / 2;
  let inputY = window.innerHeight / 2;
  
  const trailUpdater = setupCursorTrail(isDesktop);
  const parallaxUpdater = setupParallaxBackground();
  
  setupMenuButtonEffects(app);
  initSettingsPanel();
  initLoadDataPanel();
  initStartMissionPanel();
  setupMotionTracking(isDesktop, (x, y) => {
      inputX = x;
      inputY = y;
  });

  const animateMenu = () => {
    trailUpdater(inputX, inputY);
    parallaxUpdater(inputX, inputY);
    requestAnimationFrame(animateMenu);
  };
  animateMenu();
};
  
const setupCursorTrail = (isDesktop) => {
  const trail = document.getElementById('cursor-trail');
  if (!isDesktop || !trail) {
      if(trail) trail.style.display = 'none';
      return () => {};
  }
  let currentTrailX = window.innerWidth / 2;
  let currentTrailY = window.innerHeight / 2;
  return (targetX, targetY) => {
      currentTrailX += (targetX - currentTrailX) * 0.15;
      currentTrailY += (targetY - currentTrailY) * 0.15;
      trail.style.transform = `translate(${currentTrailX}px, ${currentTrailY}px)`;
  };
};

const setupParallaxBackground = () => {
    const layers = document.querySelectorAll('.parallax-layer');
    if (!layers.length) return () => {};
    const strengths = [0.05, 0.1, 0.2, 0.4]; 
    let currentOffsets = Array(layers.length).fill(0).map(() => ({ x: 0 }));
    return (targetX, targetY) => {
        const xOffset = (targetX - window.innerWidth / 2) / window.innerWidth;
        layers.forEach((layer, i) => {
            const targetOffsetX = -xOffset * 5 * strengths[i];
            currentOffsets[i].x += (targetOffsetX - currentOffsets[i].x) * 0.08;
            layer.style.transform = `translateX(${currentOffsets[i].x}%)`;
        });
    };
};

const setupMenuButtonEffects = (appContainer) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&";
    const hoverSfx = document.getElementById('sfx-hover');
    const settingsPanel = document.getElementById('settings-panel');
    const loadDataPanel = document.getElementById('load-data-panel');
    const startMissionPanel = document.getElementById('start-mission-panel');
    
    document.getElementById('start-mission-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        startMissionPanel?.classList.add('visible');
        appContainer.classList.add('panel-open');
    });
    document.getElementById('load-data-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        loadDataPanel?.classList.add('visible');
        appContainer.classList.add('panel-open');
    });
    document.getElementById('settings-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        settingsPanel?.classList.add('visible');
        appContainer.classList.add('panel-open');
    });
    document.getElementById('exit-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        appContainer.style.transition = 'opacity 0.5s ease';
        appContainer.style.opacity = '0';
        setTimeout(() => {
            document.body.innerHTML = `<div style="color: #00ffff; text-align: center; padding: 2rem; height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; font-family: 'Orbitron', sans-serif;"><h1>CONNECTION TERMINATED.</h1><p style="font-family: 'Montserrat', sans-serif;">Thank you for playing BREACH PROTOCOL.</p></div>`;
        }, 500);
    });

    document.querySelectorAll('.menu-button').forEach(button => {
        const span = button.querySelector('span');
        if (!span) return;
        let interval;
        button.addEventListener('mouseenter', () => {
            const originalText = span.dataset.value || span.innerText;
            if (hoverSfx) {
                hoverSfx.currentTime = 0;
                hoverSfx.play().catch(e => {});
            }
            let iteration = 0;
            clearInterval(interval);
            interval = window.setInterval(() => {
                span.innerText = originalText.split('').map((letter, index) => {
                        if (index < iteration) return originalText[index];
                        if (letter === ' ') return ' ';
                        return letters[Math.floor(Math.random() * letters.length)];
                    }).join('');
                if (iteration >= originalText.length) clearInterval(interval);
                iteration += 1 / 2;
            }, 30);
        });
        button.addEventListener('mouseleave', () => {
           clearInterval(interval);
           span.innerText = span.dataset.value || span.innerText;
        });
        button.addEventListener('mouseenter', () => appContainer.classList.add('menu-hover'));
        button.addEventListener('mouseleave', () => appContainer.classList.remove('menu-hover'));
    });
};

const setupMotionTracking = (isDesktop, onUpdate) => {
  if (isDesktop) {
      window.addEventListener('mousemove', (e) => onUpdate(e.clientX, e.clientY));
      return;
  }
  window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) onUpdate(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  const startMotionTracking = () => {
      const handleOrientation = (e) => {
          if (e.gamma === null || e.beta === null) return;
          const clampedGamma = Math.max(-30, Math.min(30, e.gamma));
          const clampedBeta = Math.max(-30, Math.min(30, e.beta));
          const x = (clampedGamma + 30) / 60 * window.innerWidth;
          const y = (clampedBeta + 30) / 60 * window.innerHeight;
          onUpdate(x, y);
      };
      window.addEventListener('deviceorientation', throttle(handleOrientation, 16));
  };

  if (typeof (DeviceOrientationEvent).requestPermission === 'function') {
      const motionOverlay = document.getElementById('motion-permission-overlay');
      const motionButton = document.getElementById('motion-permission-button');
      if (motionOverlay && motionButton) {
          motionOverlay.classList.remove('hidden');
          motionButton.addEventListener('click', async () => {
              try {
                  if (await (DeviceOrientationEvent).requestPermission() === 'granted') {
                      startMotionTracking();
                  }
              } catch (error) {
                  console.error('Error requesting device orientation permission:', error);
              } finally {
                  motionOverlay.classList.add('hidden');
              }
          }, { once: true });
      }
  } else {
      startMotionTracking();
  }
};

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
  try {
    initI18n();
    const app = document.getElementById('app');
    if (!app) return console.error('Main app container #app not found!');
    await initAudioPreloader();
    await initLoadingScreen();
    app.style.display = 'flex';
    setTimeout(() => {
      app.classList.add('visible');
      initMainMenu();
    }, 50);
  } catch (error) {
    console.error("Failed to initialize the application:", error);
    document.body.innerHTML = `<div style="color: #ff4141; text-align: center; padding: 2rem;"><h1>Initialization Failed</h1><p>Could not load essential assets. Please refresh and try again.</p></div>`;
  }
});
