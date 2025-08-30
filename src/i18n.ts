/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Centralized internationalization management.

const translations: Record<string, Record<string, string>> = {
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

export const setLanguage = (lang: string) => {
  if (!translations[lang]) return;
  currentLanguage = lang;
  document.body.dataset.lang = lang;
  localStorage.setItem('gameLanguage', lang);

  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = (el as HTMLElement).dataset.i18nKey;
    if (key) {
      const translation = translations[lang][key];
      if (translation) {
        el.textContent = translation;
        // Also update data-value for menu button animations
        if((el as HTMLElement).dataset.value) {
          (el as HTMLElement).dataset.value = translation;
        }
      }
    }
  });

  // Update active button style
  document.querySelectorAll('.lang-button').forEach(btn => {
    btn.classList.toggle('active', (btn as HTMLElement).dataset.lang === lang);
  });
};

export const initI18n = () => {
  const savedLang = localStorage.getItem('gameLanguage');
  const lang = savedLang && translations[savedLang] ? savedLang : 'en';
  setLanguage(lang);
};
