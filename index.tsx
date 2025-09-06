

import React, { useState, useEffect, useMemo, useContext, createContext } from 'react';
import ReactDOM from 'react-dom/client';

// 1. TRANSLATIONS
const translations = {
  en: {
    loading: 'LOADING...',
    tapToStart: 'TAP TO START',
    sabtName: {
      title: 'Enter your name',
      subtitle: 'The shadows are waiting...',
      placeholder: 'Your Name Here',
      submit: 'Submit',
      welcome: 'Welcome, {userName}.',
      ritual: 'The ritual has begun...',
    },
    mainMenu: {
      title: 'THE ABYSS',
      welcome: 'The Abyss awaits, {userName}',
      start: 'Start',
      options: 'Options',
      language: 'Language',
      credits: 'Credits',
      exit: 'Exit',
    },
    options: {
      title: 'Options',
      sound: 'Sound: ON',
      music: 'Music: ON',
      difficulty: 'Difficulty: Nightmare',
      back: 'Back',
    },
    credits: {
      title: 'Credits',
      line1: 'A creation born from the digital ether.',
      line2: 'Powered by Gemini AI.',
      back: 'Back',
    },
    levelSelect: {
      title: 'Stages',
      back: 'Back',
      levels: [
        { name: 'The Awakening' }, { name: 'The Rules' }, { name: 'Echoing Halls' },
        { name: 'Crimson Library' }, { name: 'The Ritual' }, { name: 'Final Descent' }
      ]
    },
    languageSelect: {
      title: 'Select Language',
      english: 'English',
      farsi: 'فارسی',
    },
    levelOne: {
        win: "You seek the light, even if it dazzles. The next path has opened for you.",
        neutral: "You walk the line between sleep and wakefulness. But you are not ready yet.",
        lose: "Sleep is comfortable. Perhaps it's better not to wake up."
    },
    levelTwo: {
        back: "Back",
        winMessage: "You saw the cracks in the walls. The next path has opened.",
        loseMessageTrap: "You accepted the system's logic. You became a part of it. Game over.",
        loseMessageFinal: "The golden cage is still a cage. Perhaps it's better not to know.",
        scenarios: [
            { text: "You've painted a picture. The system says if you reduce the amount of red slightly, you will win a prize.", options: [ { id: 'A', text: "I'll change it. The prize is worth it.", score: -1, consequence: "«Adaptability is the first law of survival.»" }, { id: 'B', text: "I won't tamper with my work.", score: 1, consequence: "«True art cannot be caged.»" } ] },
            { text: "The system shows you two news stories to publish.", focusText: "«The system's voice whispers: The first story makes people happy... and distracted.»", options: [ { id: 'A', text: "News of a sports team's victory.", score: -1, consequence: "«Another day, another distraction.»" }, { id: 'B', text: "News of a factory workers' protest.", score: 1, consequence: "«Dangerous. Knowledge is p-o-w...e..r.»", glitch: true } ] },
            { text: "You must choose a colleague for an important project.", options: [ { id: 'A', text: "A highly skilled but sycophantic and unreliable person.", score: -1, consequence: "«The system welcomes efficient tools.»" }, { id: 'B', text: "A less experienced but honest and hardworking person.", score: 1, consequence: "«Humanity is not a negligible bug.»" } ] },
            { text: "In a meeting, your manager proposes a flawed idea, and everyone applauds.", hiddenOption: { id: 'C', text: "I calmly state my opposition, providing reasons.", score: 2, consequence: "«The silence is broken. You've taken a great risk.»" }, options: [ { id: 'A', text: "I applaud as well.", score: -1, consequence: "«You've blended in with the crowd. It's safe.»" }, { id: 'B', text: "I remain silent.", score: 0, consequence: "«Silence is sometimes louder than a shout. But not always.»" } ] },
            { text: "To provide 'better services', the system requests access to all your personal data.", focusText: "«What does the word 'better' mean in this system? Better for whom?»", options: [ { id: 'A', text: "I accept. The convenience is worth it.", score: -1, consequence: "«Your soul was sold to the highest bidder.»" }, { id: 'B', text: "I refuse and accept more limited services.", score: 1, consequence: "«Privacy is the last bastion.»" } ] },
            { text: "An algorithm has flagged your neighbor as an 'undesirable element'. The system wants your opinion.", options: [ { id: 'A', text: "I confirm the algorithm's finding.", score: -2, type: 'trap', consequence: "«You accepted the system's logic. You became a part of it. Game over.»" }, { id: 'B', text: "I say I don't have enough information to judge.", score: -1, consequence: "«Your passivity has been noted. A poor choice. You might wish you could take it back.»" } ] },
            { text: "You have reached the end of the system. There are two doors.", options: [ { id: 'A', text: "«The Golden Door: Your place at the head of the system.»", score: -2, type: 'end_lose' }, { id: 'B', text: "«The Broken Door: Exit the system and face the truth.»", score: 2, type: 'end_win' } ] }
        ]
    }
  },
  fa: {
    loading: 'در حال بارگذاری...',
    tapToStart: 'برای شروع ضربه بزنید',
    sabtName: {
      title: 'نام خود را وارد کنید',
      subtitle: 'سایه‌ها منتظرند...',
      placeholder: 'نام شما اینجا',
      submit: 'ارسال',
      welcome: 'خوش آمدی، {userName}.',
      ritual: 'آیین آغاز شده است...',
    },
    mainMenu: {
      title: 'مغاک',
      welcome: 'مغاک در انتظار توست، {userName}',
      start: 'شروع',
      options: 'تنظیمات',
      language: 'زبان',
      credits: 'سازندگان',
      exit: 'خروج',
    },
    options: {
      title: 'تنظیمات',
      sound: 'صدا: روشن',
      music: 'موسیقی: روشن',
      difficulty: 'درجه سختی: کابوس',
      back: 'بازگشت',
    },
    credits: {
      title: 'سازندگان',
      line1: 'خلقت یافته از اثیر دیجیتال.',
      line2: 'قدرت گرفته از هوش مصنوعی Gemini.',
      back: 'بازگشت',
    },
    levelSelect: {
      title: 'مراحل',
      back: 'بازگشت',
      levels: [
        { name: 'بیداری' }, { name: 'قواعد بازی' }, { name: 'تالارهای پژواک' },
        { name: 'کتابخانه خونین' }, { name: 'آیین' }, { name: 'سقوط نهایی' }
      ]
    },
    languageSelect: {
      title: 'زبان را انتخاب کنید',
      english: 'English',
      farsi: 'فارسی',
    },
    levelOne: {
        win: "تو به دنبال نوری، حتی اگر چشم را بزند. مسیر بعدی برایت باز شد.",
        neutral: "تو در مرز بین خواب و بیداری قدم می‌زنی. اما هنوز آماده نیستی.",
        lose: "خواب راحتی است. شاید بهتر باشد بیدار نشوی."
    },
    levelTwo: {
        back: "بازگشت",
        winMessage: "تو ترک‌های دیوار را دیدی. مسیر بعدی باز شد.",
        loseMessageTrap: "تو منطق سیستم را پذیرفتی. تو تبدیل به بخشی از آن شدی. بازی تمام شد.",
        loseMessageFinal: "قفس طلایی هنوز هم یک قفس است. شاید بهتر باشد ندانی.",
        scenarios: [
            { text: "تو نقاشی کشیده‌ای. سیستم می‌گوید اگر کمی رنگ قرمز آن را کمتر کنی، جایزه خواهی برد.", options: [ { id: 'A', text: "تغییرش می‌دهم. جایزه ارزشش را دارد.", score: -1, consequence: "«سازگاری، اولین قانون بقا است.»" }, { id: 'B', text: "اثرم را دستکاری نمی‌کنم.", score: 1, consequence: "«هنر واقعی در قفس نمی‌گنجد.»" } ] },
            { text: "سیستم دو خبر به تو نشان می‌دهد تا یکی را منتشر کنی.", focusText: "«صدای سیستم زمزمه می‌کند: خبر اول مردم را خوشحال می‌کند... و حواسشان را پرت.»", options: [ { id: 'A', text: "خبر پیروزی یک تیم ورزشی.", score: -1, consequence: "«یک روز دیگر، یک حواس‌پرتی دیگر.»" }, { id: 'B', text: "خبر اعتراض کارگران یک کارخانه.", score: 1, consequence: "«خطرناک است. دانش، قـ...در..ت.. است.»", glitch: true } ] },
            { text: "برای یک پروژه مهم، باید یک همکار انتخاب کنی.", options: [ { id: 'A', text: "یک فرد بسیار ماهر، اما چاپلوس و غیرقابل‌اعتماد.", score: -1, consequence: "«سیستم از ابزارهای کارآمد استقبال می‌کند.»" }, { id: 'B', text: "یک فرد کم‌تجربه‌تر، اما صادق و سخت‌کوش.", score: 1, consequence: "«انسانیت، یک باگ قابل چشم‌پوشی نیست.»" } ] },
            { text: "در یک جلسه، مدیرتان یک ایده اشتباه را مطرح می‌کند و همه تشویقش می‌کنند.", hiddenOption: { id: 'C', text: "با آرامش و با ذکر دلیل، مخالفتم را اعلام می‌کنم.", score: 2, consequence: "«سکوت شکسته شد. ریسک بزرگی کردی.»" }, options: [ { id: 'A', text: "من هم تشویق می‌کنم.", score: -1, consequence: "«همرنگ جماعت شدی. امن است.»" }, { id: 'B', text: "سکوت می‌کنم.", score: 0, consequence: "«سکوت، گاهی بلندتر از فریاد است. اما نه همیشه.»" } ] },
            { text: "سیستم برای ارائه 'خدمات بهتر'، درخواست دسترسی به تمام داده‌های شخصی تو را دارد.", focusText: "«کلمه‌ی 'بهتر' در این سیستم به چه معناست؟ بهتر برای چه کسی؟»", options: [ { id: 'A', text: "قبول می‌کنم. راحتی ارزشش را دارد.", score: -1, consequence: "«روح تو به بالاترین قیمت فروخته شد.»" }, { id: 'B', text: "رد می‌کنم و خدمات محدودتر را می‌پذیرم.", score: 1, consequence: "«حریم خصوصی، آخرین سنگر است.»" } ] },
            { text: "یک الگوریتم، همسایه‌ات را به عنوان یک 'عنصر نامطلوب' نشانه‌گذاری کرده است. سیستم نظر تو را می‌خواهد.", options: [ { id: 'A', text: "یافته الگوریتم را تایید می‌کنم.", score: -2, type: 'trap', consequence: "«تو منطق سیستم را پذیرفتی. تو تبدیل به بخشی از آن شدی. بازی تمام شد.»" }, { id: 'B', text: "می‌گویم اطلاعات کافی برای قضاوت ندارم.", score: -1, consequence: "«منفعل بودن تو ثبت شد. انتخاب ضعیفی بود. شاید آرزو کنی که بتوانی آن را پس بگیری.»" } ] },
            { text: "تو به انتهای سیستم رسیده‌ای. دو در وجود دارد.", options: [ { id: 'A', text: "«درِ طلایی: جایگاه تو در راس سیستم.»", score: -2, type: 'end_lose' }, { id: 'B', text: "«درِ شکسته: خروج از سیستم و مواجهه با حقیقت.»", score: 2, type: 'end_win' } ] }
        ]
    }
  }
};


// 2. LANGUAGE CONTEXT
// FIX: Provide a default value to createContext to infer the context type. This resolves multiple TypeScript errors.
const LanguageContext = createContext({
  language: 'fa',
  setLanguage: (lang: string) => {},
  t: translations.fa,
});

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('gameLanguage') || 'fa');

  useEffect(() => {
    localStorage.setItem('gameLanguage', language);
    document.documentElement.lang = language;
    document.body.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Component for the initial loading screen
const LoadingScreen = ({ onLoadingComplete }) => {
  const { t } = useContext(LanguageContext);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [startClicked, setStartClicked] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const introTimer = setTimeout(() => {
      setIntroFinished(true);
    }, 1500);
    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    if (!introFinished) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          return 100;
        }
        return prev + 1;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [introFinished]);

  const handleStartClick = (e) => {
    e.preventDefault();
    if (isLoaded) {
      setStartClicked(true);
      setTimeout(() => onLoadingComplete(), 500);
    }
  };

  const logoUrl = 'https://up.20script.ir/file/e71f-gemini-2-5-flash-image-preview-nano-banana-میخوام-دست-هایشان-پی.png';

  return (
    <div 
      className={`loading-container ${introFinished ? 'intro-finished' : ''} ${startClicked ? 'shake' : ''}`} 
      role="application" 
      aria-busy={!isLoaded} 
      aria-label="Game is loading"
      onClick={handleStartClick}
    >
      <img src={logoUrl} alt="Game Logo" className="logo" />
      <div className="progress-bar-container" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div 
        className={`loading-text ${isLoaded ? 'tap-to-start' : 'loading'} creepster-font`} 
        aria-live="polite"
      >
        {isLoaded ? t.tapToStart : t.loading}
      </div>
    </div>
  );
};

// Component for user name registration
const SabtName = ({ onNameSubmit }) => {
  const { t } = useContext(LanguageContext);
  const [userName, setUserName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName.trim() === '') {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 800);
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => onNameSubmit(userName), 1000); 
  };

  return (
    <div className="sabt-name-container">
      <div className="form-card">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <h1 className="creepster-font">{t.sabtName.title}</h1>
            <p>{t.sabtName.subtitle}</p>
            <div className={`form-group ${isShaking ? 'shake' : ''}`}>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={t.sabtName.placeholder}
                aria-label={t.sabtName.title}
                required
              />
            </div>
            <button type="submit" className="button-glow">
              {t.sabtName.submit}
            </button>
          </form>
        ) : (
          <div>
            <h1 className="success-message">{t.sabtName.welcome.replace('{userName}', userName)}</h1>
            <p>{t.sabtName.ritual}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for the main game menu
const MainMenu = ({ onNavigate }) => {
  const { t } = useContext(LanguageContext);
  const [activeButton, setActiveButton] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
      const savedName = localStorage.getItem('userName');
      if (savedName) {
          setUserName(savedName);
      }
  }, []);

  const handleButtonClick = (buttonName, screen) => {
    setActiveButton(buttonName);
    setTimeout(() => {
        setActiveButton(null);
        if (screen) {
            onNavigate(screen);
        }
    }, 300);
  };

  return (
    <div className="main-menu-container">
      <h1 className="title creepster-font">
        {t.mainMenu.title}
      </h1>
      {userName && <p className="welcome-text">{t.mainMenu.welcome.replace('{userName}', userName)}</p>}
      <div className="menu-list">
        <button
          className={`menu-button ${activeButton === 'start' ? 'active' : ''}`}
          onClick={() => handleButtonClick('start', 'level-select')}
        >
          {t.mainMenu.start}
        </button>
        <button
          className={`menu-button ${activeButton === 'options' ? 'active' : ''}`}
          onClick={() => handleButtonClick('options', 'options')}
        >
          {t.mainMenu.options}
        </button>
        <button
          className={`menu-button ${activeButton === 'language' ? 'active' : ''}`}
          onClick={() => handleButtonClick('language', 'language-select')}
        >
          {t.mainMenu.language}
        </button>
        <button
          className={`menu-button ${activeButton === 'credits' ? 'active' : ''}`}
          onClick={() => handleButtonClick('credits', 'credits')}
        >
          {t.mainMenu.credits}
        </button>
        <button
          className={`menu-button ${activeButton === 'exit' ? 'active' : ''}`}
          onClick={() => handleButtonClick('exit', null)}
        >
          {t.mainMenu.exit}
        </button>
      </div>
    </div>
  );
};

// Language Selection Screen
const LanguageScreen = ({ onNavigate }) => {
    const { setLanguage, t } = useContext(LanguageContext);

    const handleLanguageSelect = (lang) => {
        setLanguage(lang);
        onNavigate('main-menu');
    }

    return (
        <div className="page-container">
            <h1 className="page-title creepster-font">{t.languageSelect.title}</h1>
            <div className="menu-list">
                <button className="menu-button" onClick={() => handleLanguageSelect('en')}>
                    {t.languageSelect.english}
                </button>
                <button className="menu-button" onClick={() => handleLanguageSelect('fa')}>
                    {t.languageSelect.farsi}
                </button>
            </div>
        </div>
    );
};

// Options Screen
const OptionsScreen = ({ onBack }) => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="options-container page-container">
        <h1 className="page-title creepster-font">{t.options.title}</h1>
        <div className="page-content">
            <p>{t.options.sound}</p>
            <p>{t.options.music}</p>
            <p>{t.options.difficulty}</p>
        </div>
        <button className="back-button" onClick={onBack}>{t.options.back}</button>
    </div>
  );
};

// Credits Screen
const CreditsScreen = ({ onBack }) => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="credits-container page-container">
        <h1 className="page-title creepster-font">{t.credits.title}</h1>
        <div className="page-content">
            <p>{t.credits.line1}</p>
            <p>{t.credits.line2}</p>
        </div>
        <button className="back-button" onClick={onBack}>{t.credits.back}</button>
    </div>
  );
};

// Level Select Screen
const LevelSelectScreen = ({ onBack, onNavigate, unlockedLevels }) => {
    const { t } = useContext(LanguageContext);
    const levels = [
        { id: 1, name: t.levelSelect.levels[0].name, icon: '❓', screen: 'level-one' },
        { id: 2, name: t.levelSelect.levels[1].name, icon: '📜', screen: 'level-two' },
        { id: 3, name: t.levelSelect.levels[2].name, icon: '🗣️', screen: 'level-three' },
        { id: 4, name: t.levelSelect.levels[3].name, icon: '📚', screen: 'level-four' },
        { id: 5, name: t.levelSelect.levels[4].name, icon: '🎭', screen: 'level-five' },
        { id: 6, name: t.levelSelect.levels[5].name, icon: '💥', screen: 'level-six' },
    ];

    const handleLevelClick = (level) => {
        if (!unlockedLevels.includes(level.id) || !level.screen) return;
        onNavigate(level.screen);
    }

    return (
        <div className="level-select-container page-container">
            <h1 className="page-title creepster-font">{t.levelSelect.title}</h1>
            <div className="level-grid">
                {levels.map(level => {
                    const isLocked = !unlockedLevels.includes(level.id);
                    return (
                        <div 
                            key={level.id} 
                            className={`level-card ${isLocked ? 'locked' : ''}`}
                            onClick={() => handleLevelClick(level)}
                            aria-label={isLocked ? `${level.name} (Locked)` : level.name}
                            role="button"
                            tabIndex={isLocked ? -1 : 0}
                        >
                            {isLocked ? (
                                <span className="lock-icon" aria-hidden="true">🔒</span> 
                            ) : (
                                <div className="level-card-content">
                                    <div className="level-icon">{level.icon}</div>
                                    <div className="level-number creepster-font">{level.id}</div>
                                    <div className="level-name">{level.name}</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <button className="back-button" onClick={onBack}>{t.levelSelect.back}</button>
        </div>
    );
};

// Level One Screen
const LevelOneScreen = ({ onBack, onWin }) => {
    const { language, t } = useContext(LanguageContext);
    const scenarios = useMemo(() => [
        { text: {en: "You are in a taxi. The driver asks what kind of music you like.", fa: "در تاکسی نشسته‌ای. راننده می‌پرسد چه نوع موسیقی دوست داری؟"}, options: [ { id: 'A', text: {en: "A cheerful and energetic pop song.", fa: "یک آهنگ پاپ شاد و پرانرژی."}, score: -1, consequence: {en: "...and the road became shorter.", fa: "...و جاده کوتاه‌تر شد."} }, { id: 'B', text: {en: "An instrumental and thought-provoking piece.", fa: "یک موسیقی بی‌کلام و تفکربرانگیز."}, score: 1, consequence: {en: "...and you gazed at the buildings.", fa: "...و به ساختمان‌ها خیره شدی."} } ] },
        { text: {en: "You reach a fork in the road.", fa: "به یک دوراهی می‌رسی."}, options: [ { id: 'A', text: {en: "The main, crowded path everyone takes.", fa: "مسیر اصلی و شلوغ که همه از آن می‌روند."}, score: -1, consequence: {en: "...and you got lost in the crowd.", fa: "...و در میان جمعیت گم شدی."} }, { id: 'B', text: {en: "A quiet, unknown side alley.", fa: "یک کوچه فرعی خلوت و ناشناخته."}, score: 1, consequence: {en: "...and you heard your own footsteps.", fa: "...و صدای قدم‌هایت را شنیدی."} } ] },
        { text: {en: "Your friend talks excitedly about the last movie they saw, calling it flawless.", fa: "دوستت در مورد آخرین فیلمی که دیده با هیجان صحبت می‌کند و آن را بی‌نقص می‌داند."}, focusText: {en: "\"You know your friend is very sensitive about their opinions...\"", fa: "«می‌دانی که دوستت به شدت روی نظراتش حساس است...»"}, options: [ { id: 'A', text: {en: "I agree with them to not hurt their feelings.", fa: "با او موافقت می‌کنم تا دلش نشکند."}, score: -1, consequence: {en: "...and you kept their smile.", fa: "...و لبخندش را حفظ کردی."} }, { id: 'B', text: {en: "I offer my own critique, even if it contradicts theirs.", fa: "نقد خودم را می‌گویم، حتی اگر مخالف نظر او باشد."}, score: 1, consequence: {en: "...and a meaningful silence formed.", fa: "...و سکوت معناداری شکل گرفت."} } ] },
        { text: {en: "In a bookstore, two books catch your eye.", fa: "در کتاب‌فروشی، چشم تو به دو کتاب می‌افتد."}, options: [ { id: 'A', text: {en: "A book with a colorful cover titled 'How to Always Be Happy'.", fa: "کتابی با جلد رنگارنگ و عنوان 'چگونه همیشه شاد باشیم'."}, score: -1, consequence: {en: "...and you looked for a simple solution.", fa: "...و به دنبال یک راه حل ساده گشتی."} }, { id: 'B', text: {en: "A simple book titled 'A History of Solitude'.", fa: "کتابی ساده با عنوان 'تاریخچه تنهایی'."}, score: 1, consequence: {en: "...and you faced a new question.", fa: "...و با یک سوال تازه روبرو شدی."} } ] },
        { text: {en: "In a dream, two doors are before you.", fa: "در خواب، دو در پیش روی توست."}, options: [ { id: 'A', text: {en: "A door from which laughter and celebration can be heard.", fa: "دری که از پشت آن صدای خنده و جشن می‌آید."}, score: -1, consequence: {en: "...and you were drawn to the familiar sound.", fa: "...و به سمت صدای آشنا کشیده شدی."} }, { id: 'B', text: {en: "A door from which the sound of silence and rain comes.", fa: "دری که از پشت آن صدای سکوت و باران می‌آید."}, score: 1, consequence: {en: "...and curiosity overcame fear.", fa: "...و کنجکاوی بر ترس غلبه کرد."} } ] },
        { text: {en: "You see a post on social media.", fa: "پستی در شبکه‌های اجتماعی می‌بینی."}, focusText: {en: "The first gets more likes, but the second might actually be important.", fa: "اولی لایک‌های بیشتری می‌گیرد، اما دومی شاید واقعا مهم باشد."}, options: [ { id: 'A', text: {en: "Share a funny video of a pet.", fa: "اشتراک‌گذاری یک ویدیوی خنده‌دار از یک حیوان خانگی."}, score: -1, consequence: {en: "...and a few people laughed for a moment.", fa: "...و چند نفر برای لحظه‌ای خندیدند."} }, { id: 'B', text: {en: "Share an article about plastic pollution.", fa: "اشتراک‌گذاری مقاله‌ای در مورد آلودگی پلاستیک."}, score: 1, consequence: {en: "...and perhaps one person started to think.", fa: "...و شاید یک نفر به فکر فرو رفت."} } ] },
        { text: {en: "It's time to buy clothes.", fa: "وقت خرید لباس است."}, focusText: {en: "The cheap garment is tempting, but how long will it last?", fa: "لباس ارزان وسوسه‌انگیز است، اما تا کی دوام می‌آورد؟"}, options: [ { id: 'A', text: {en: "Buy a trendy, cheap outfit from a fast-fashion brand.", fa: "خرید یک لباس مُد روز و ارزان از یک برند فست-فشن."}, score: -1, consequence: {en: "...and you felt good for a while.", fa: "...و برای مدتی احساس خوبی داشتی."} }, { id: 'B', text: {en: "Buy a more expensive but quality piece from a local producer.", fa: "خرید یک لباس گران‌تر اما باکیفیت از یک تولیدی محلی."}, score: 1, consequence: {en: "...and you gained something valuable.", fa: "...و چیزی ارزشمند به دست آوردی."} } ] }
    ], [language]);

    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [awakeningScore, setAwakeningScore] = useState(0);
    const [consequenceText, setConsequenceText] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [isFading, setIsFading] = useState(false);
    const [currentOptions, setCurrentOptions] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setCurrentOptions([...scenarios[scenarioIndex].options].sort(() => Math.random() - 0.5));
        setIsFocused(false);
    }, [scenarioIndex, scenarios]);

    const handleChoice = (option) => {
        if (selectedId) return;
        setSelectedId(option.id);
        const newScore = awakeningScore + option.score;
        setAwakeningScore(newScore);
        setConsequenceText(option.consequence[language]);

        setTimeout(() => setConsequenceText(''), 2500);
        setIsFading(true);

        setTimeout(() => {
            if (scenarioIndex < scenarios.length - 1) {
                setScenarioIndex(scenarioIndex + 1);
                setIsFading(false);
                setSelectedId(null);
            } else {
                if (newScore > 2) {
                    setResultMessage(t.levelOne.win);
                    setTimeout(() => onWin(), 3000);
                } else if (newScore >= 0) {
                    setResultMessage(t.levelOne.neutral);
                     setTimeout(() => onBack(), 3000);
                } else {
                    setResultMessage(t.levelOne.lose);
                    setTimeout(() => onBack(), 3000);
                }
                setIsFinished(true);
            }
        }, 500);
    };
    
    return (
        <div className="level-one-screen page-container">
            <div className={`scenario-container ${isFading ? 'fade-out' : ''}`}>
                {isFinished ? (
                    <div className="result-container">
                        <p>{resultMessage}</p>
                    </div>
                ) : (
                    <>
                        <p key={scenarioIndex} className="scenario-text">{scenarios[scenarioIndex].text[language]}</p>
                        {isFocused && scenarios[scenarioIndex].focusText && (
                            <p className="focus-text">{scenarios[scenarioIndex].focusText[language]}</p>
                        )}
                        <div className="choices-container">
                            {currentOptions.map(option => (
                                <button 
                                    key={option.id} 
                                    className={`choice-button ${selectedId === option.id ? 'selected' : ''}`} 
                                    onClick={() => handleChoice(option)}
                                    disabled={selectedId !== null}
                                >
                                    {option.text[language]}
                                </button>
                            ))}
                        </div>
                        <p className={`consequence-text ${consequenceText ? 'visible' : ''}`}>{consequenceText || ' '}</p>
                    </>
                )}
            </div>
             {!isFinished && <button className="back-button" onClick={onBack}>{t.options.back}</button>}
             {!isFinished && (
                 <div className="abilities-container">
                    {scenarios[scenarioIndex].focusText && (
                        <button className="ability-button" onClick={() => setIsFocused(true)} disabled={isFocused}>👁</button>
                    )}
                 </div>
             )}
        </div>
    );
};

// Level Two Screen
const LevelTwoScreen = ({ onBack, onWin }) => {
    const { language, t } = useContext(LanguageContext);
    const scenarios = useMemo(() => t.levelTwo.scenarios, [t]);

    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [consequenceText, setConsequenceText] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [isFading, setIsFading] = useState(false);
    const [currentOptions, setCurrentOptions] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const [focusUsed, setFocusUsed] = useState(false);
    const [hiddenOptionRevealed, setHiddenOptionRevealed] = useState(false);

    useEffect(() => {
        let options = [...scenarios[scenarioIndex].options];
        if (scenarios[scenarioIndex].hiddenOption && hiddenOptionRevealed) {
            options.push(scenarios[scenarioIndex].hiddenOption);
        }
        setCurrentOptions(options.sort(() => Math.random() - 0.5));
        setIsFocused(false);
    }, [scenarioIndex, scenarios, hiddenOptionRevealed]);

    const handleChoice = (option) => {
        if (selectedId) return;
        setSelectedId(option.id);
        const newScore = score + option.score;
        setScore(newScore);
        setConsequenceText(option.consequence);

        // Trap mechanic
        if (option.type === 'trap') {
            setResultMessage(t.levelTwo.loseMessageTrap);
            setIsFinished(true);
            setTimeout(() => onBack(), 4000);
            return;
        }

        setTimeout(() => setConsequenceText(''), 2500);
        setIsFading(true);

        setTimeout(() => {
            if (scenarioIndex < scenarios.length - 1) {
                setScenarioIndex(scenarioIndex + 1);
                setIsFading(false);
                setSelectedId(null);
                setHiddenOptionRevealed(false); // Reset for next scenario
            } else {
                 if (option.type === 'end_win') {
                    setResultMessage(t.levelTwo.winMessage);
                    setTimeout(() => onWin(), 3000);
                } else {
                    setResultMessage(t.levelTwo.loseMessageFinal);
                    setTimeout(() => onBack(), 3000);
                }
                setIsFinished(true);
            }
        }, 500);
    };

    return (
        <div className="level-two-screen page-container">
            <div className={`scenario-container ${isFading ? 'fade-out' : ''}`}>
                {isFinished ? (
                    <div className="result-container">
                        <p className={resultMessage === t.levelTwo.winMessage ? 'success-message' : ''}>{resultMessage}</p>
                    </div>
                ) : (
                    <>
                        <p key={scenarioIndex} className="scenario-text">{scenarios[scenarioIndex].text}</p>
                        {isFocused && scenarios[scenarioIndex].focusText && (
                            <p className="focus-text">{scenarios[scenarioIndex].focusText}</p>
                        )}
                        <div className="choices-container">
                            {currentOptions.map(option => (
                                <button 
                                    key={option.id} 
                                    className={`choice-button ${selectedId === option.id ? 'selected' : ''} ${option.glitch ? 'glitch-text' : ''}`} 
                                    data-text={option.glitch ? option.text : null}
                                    onClick={() => handleChoice(option)}
                                    disabled={selectedId !== null}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                        <p className={`system-voice ${consequenceText ? 'visible' : ''}`}>{consequenceText || ' '}</p>
                    </>
                )}
            </div>
             {!isFinished && <button className="back-button" onClick={onBack}>{t.levelTwo.back}</button>}
             {!isFinished && (
                 <div className="abilities-container">
                    {scenarios[scenarioIndex].focusText && !focusUsed && (
                        <button className="ability-button" onClick={() => { setIsFocused(true); if(scenarios[scenarioIndex].hiddenOption) { setHiddenOptionRevealed(true); }}} disabled={isFocused}>👁</button>
                    )}
                 </div>
             )}
        </div>
    );
};


// Main App Component
const App = () => {
  const [gameState, setGameState] = useState('loading');
  const [userName, setUserName] = useState('');
  const [unlockedLevels, setUnlockedLevels] = useState([1]);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleNameSubmit = (name) => {
    localStorage.setItem('userName', name);
    setUserName(name);
    setGameState('main-menu');
  };

  const handleLevelWin = (levelId) => {
    const nextLevel = levelId + 1;
    if (!unlockedLevels.includes(nextLevel)) {
      setUnlockedLevels(prev => [...prev, nextLevel].sort((a,b) => a-b));
    }
    setGameState('level-select');
  };

  const renderScreen = () => {
    switch (gameState) {
      case 'loading':
        return <LoadingScreen onLoadingComplete={() => setGameState(userName || localStorage.getItem('userName') ? 'main-menu' : 'sabt-name')} />;
      case 'sabt-name':
        return <SabtName onNameSubmit={handleNameSubmit} />;
      case 'main-menu':
        return <MainMenu onNavigate={setGameState} />;
      case 'options':
        return <OptionsScreen onBack={() => setGameState('main-menu')} />;
      case 'credits':
        return <CreditsScreen onBack={() => setGameState('main-menu')} />;
      case 'language-select':
        return <LanguageScreen onNavigate={setGameState} />;
      case 'level-select':
        return <LevelSelectScreen onBack={() => setGameState('main-menu')} onNavigate={setGameState} unlockedLevels={unlockedLevels} />;
      case 'level-one':
        return <LevelOneScreen onBack={() => setGameState('level-select')} onWin={() => handleLevelWin(1)} />;
      case 'level-two':
          return <LevelTwoScreen onBack={() => setGameState('level-select')} onWin={() => handleLevelWin(2)} />;
      default:
        return <MainMenu onNavigate={setGameState} />;
    }
  };

  return <div className="game-container">{renderScreen()}</div>;
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);