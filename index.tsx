
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// Component for the initial loading screen
const LoadingScreen = ({ onLoadingComplete }) => {
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
      // Notify parent component that loading is complete
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
        className={`loading-text ${isLoaded ? 'tap-to-start' : 'loading'}`} 
        aria-live="polite"
      >
        {isLoaded ? 'TAP TO START' : 'LOADING...'}
      </div>
    </div>
  );
};

// Component for user name registration
const SabtName = ({ onNameSubmit }) => {
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
    // Submit the name after a short delay
    setTimeout(() => onNameSubmit(userName), 1000); 
  };

  return (
    <div className="sabt-name-container">
      <div className="form-card">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <h1>Enter your name</h1>
            <p>The shadows are waiting...</p>
            <div className={`form-group ${isShaking ? 'shake' : ''}`}>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name Here"
                aria-label="Enter your name"
                required
              />
            </div>
            <button type="submit" className="button-glow">
              Submit
            </button>
          </form>
        ) : (
          <div>
            <h1 className="success-message">Welcome, {userName}.</h1>
            <p>The ritual has begun...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for the main game menu
const MainMenu = ({ onNavigate }) => {
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
      <h1 className="title">
        THE ABYSS
      </h1>
      {userName && <p className="welcome-text">The Abyss awaits, {userName}</p>}
      <div className="menu-list">
        <button
          className={`menu-button ${activeButton === 'start' ? 'active' : ''}`}
          onClick={() => handleButtonClick('start', 'level-select')}
        >
          Start
        </button>
        <button
          className={`menu-button ${activeButton === 'options' ? 'active' : ''}`}
          onClick={() => handleButtonClick('options', 'options')}
        >
          Options
        </button>
        <button
          className={`menu-button ${activeButton === 'credits' ? 'active' : ''}`}
          onClick={() => handleButtonClick('credits', 'credits')}
        >
          Credits
        </button>
        <button
          className={`menu-button ${activeButton === 'exit' ? 'active' : ''}`}
          onClick={() => handleButtonClick('exit', null)}
        >
          Exit
        </button>
      </div>
    </div>
  );
};

// Options Screen
const OptionsScreen = ({ onBack }) => {
  return (
    <div className="options-container page-container">
        <h1 className="page-title">Options</h1>
        <div className="page-content">
            <p>Sound: ON</p>
            <p>Music: ON</p>
            <p>Difficulty: Nightmare</p>
        </div>
        <button className="back-button" onClick={onBack}>Back</button>
    </div>
  );
};

// Credits Screen
const CreditsScreen = ({ onBack }) => {
  return (
    <div className="credits-container page-container">
        <h1 className="page-title">Credits</h1>
        <div className="page-content">
            <p>A creation born from the digital ether.</p>
            <p>Powered by Gemini AI.</p>
        </div>
        <button className="back-button" onClick={onBack}>Back</button>
    </div>
  );
};

// Level Select Screen
const LevelSelectScreen = ({ onBack, onNavigate, unlockedLevels }) => {
    const levels = [
        { id: 1, name: 'The Awakening' },
        { id: 2, name: 'The Rules' },
        { id: 3, name: 'The Cellar' },
        { id: 4, name: 'Crimson Library' },
        { id: 5, name: 'The Ritual' },
        { id: 6, name: 'Final Descent' },
    ];

    const handleLevelClick = (level) => {
        if (!unlockedLevels.includes(level.id)) return;
        
        if (level.id === 1) {
            onNavigate('level-one');
        } else if (level.id === 2) {
            onNavigate('level-two');
        } else {
            console.log(`Clicked on level: ${level.name}`);
        }
    }

    return (
        <div className="level-select-container page-container">
            <h1 className="page-title">Stages</h1>
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
                                <>
                                    <div className="level-number">{level.id}</div>
                                    <div className="level-name">{level.name}</div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
            <button className="back-button" onClick={onBack}>Back</button>
        </div>
    );
};

// Level One Screen
const LevelOneScreen = ({ onBack, onWin }) => {
    const scenarios = useMemo(() => [
        {
            text: "در تاکسی نشسته‌ای. راننده می‌پرسد چه نوع موسیقی دوست داری؟",
            options: [
                { id: 'A', text: "یک آهنگ پاپ شاد و پرانرژی.", score: -1, consequence: "...و جاده کوتاه‌تر شد." },
                { id: 'B', text: "یک موسیقی بی‌کلام و تفکربرانگیز.", score: 1, consequence: "...و به ساختمان‌ها خیره شدی." }
            ]
        },
        {
            text: "به یک دوراهی می‌رسی.",
            options: [
                { id: 'A', text: "مسیر اصلی و شلوغ که همه از آن می‌روند.", score: -1, consequence: "...و در میان جمعیت گم شدی." },
                { id: 'B', text: "یک کوچه فرعی خلوت و ناشناخته.", score: 1, consequence: "...و صدای قدم‌هایت را شنیدی." }
            ]
        },
        {
            text: "دوستت در مورد آخرین فیلمی که دیده با هیجان صحبت می‌کند و آن را بی‌نقص می‌داند.",
            focusText: "«می‌دانی که دوستت به شدت روی نظراتش حساس است...»",
            options: [
                { id: 'A', text: "با او موافقت می‌کنم تا دلش نشکند.", score: -1, consequence: "...و لبخندش را حفظ کردی." },
                { id: 'B', text: "نقد خودم را می‌گویم، حتی اگر مخالف نظر او باشد.", score: 1, consequence: "...و سکوت معناداری شکل گرفت." }
            ]
        },
        {
            text: "در کتاب‌فروشی، چشم تو به دو کتاب می‌افتد.",
            options: [
                { id: 'A', text: "کتابی با جلد رنگارنگ و عنوان 'چگونه همیشه شاد باشیم'.", score: -1, consequence: "...و به دنبال یک راه حل ساده گشتی." },
                { id: 'B', text: "کتابی ساده با عنوان 'تاریخچه تنهایی'.", score: 1, consequence: "...و با یک سوال تازه روبرو شدی." }
            ]
        },
        {
            text: "در خواب، دو در پیش روی توست.",
            options: [
                { id: 'A', text: "دری که از پشت آن صدای خنده و جشن می‌آید.", score: -1, consequence: "...و به سمت صدای آشنا کشیده شدی." },
                { id: 'B', text: "دری که از پشت آن صدای سکوت و باران می‌آید.", score: 1, consequence: "...و کنجکاوی بر ترس غلبه کرد." }
            ]
        },
        {
            text: "پستی در شبکه‌های اجتماعی می‌بینی.",
            focusText: "اولی لایک‌های بیشتری می‌گیرد، اما دومی شاید واقعا مهم باشد.",
            options: [
                { id: 'A', text: "اشتراک‌گذاری یک ویدیوی خنده‌دار از یک حیوان خانگی.", score: -1, consequence: "...و چند نفر برای لحظه‌ای خندیدند." },
                { id: 'B', text: "اشتراک‌گذاری مقاله‌ای در مورد آلودگی پلاستیک.", score: 1, consequence: "...و شاید یک نفر به فکر فرو رفت." }
            ]
        },
        {
            text: "وقت خرید لباس است.",
            focusText: "لباس ارزان وسوسه‌انگیز است، اما تا کی دوام می‌آورد؟",
            options: [
                { id: 'A', text: "خرید یک لباس مُد روز و ارزان از یک برند فست-فشن.", score: -1, consequence: "...و برای مدتی احساس خوبی داشتی." },
                { id: 'B', text: "خرید یک لباس گران‌تر اما باکیفیت از یک تولیدی محلی.", score: 1, consequence: "...و چیزی ارزشمند به دست آوردی." }
            ]
        }
    ], []);

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
        setAwakeningScore(prev => prev + option.score);
        setConsequenceText(option.consequence);

        setTimeout(() => setConsequenceText(''), 2500);
        setIsFading(true);

        setTimeout(() => {
            if (scenarioIndex < scenarios.length - 1) {
                setScenarioIndex(scenarioIndex + 1);
                setIsFading(false);
                setSelectedId(null);
            } else {
                const finalScore = awakeningScore + option.score;
                if (finalScore > 2) {
                    setResultMessage("تو به دنبال نوری، حتی اگر چشم را بزند. مسیر بعدی برایت باز شد.");
                    setTimeout(() => onWin(), 3000);
                } else if (finalScore >= 0) {
                    setResultMessage("تو در مرز بین خواب و بیداری قدم می‌زنی. اما هنوز آماده نیستی.");
                     setTimeout(() => onBack(), 3000);
                } else {
                    setResultMessage("خواب راحتی است. شاید بهتر باشد بیدار نشوی.");
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
                        <p key={scenarioIndex} className="scenario-text">{scenarios[scenarioIndex].text}</p>
                        {isFocused && scenarios[scenarioIndex].focusText && (
                            <p className="focus-text">{scenarios[scenarioIndex].focusText}</p>
                        )}
                        <div className="choices-container">
                            {currentOptions.map(option => (
                                <button 
                                    key={option.id} 
                                    className={`choice-button ${selectedId === option.id ? 'selected' : ''}`} 
                                    onClick={() => handleChoice(option)}
                                    disabled={selectedId !== null}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                        <p className={`consequence-text ${consequenceText ? 'visible' : ''}`}>{consequenceText || ' '}</p>
                    </>
                )}
            </div>
             {!isFinished && <button className="back-button" onClick={onBack}>Back</button>}
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
    const scenarios = useMemo(() => [
        {
            text: "تو نقاشی کشیده‌ای. سیستم می‌گوید اگر کمی رنگ قرمز آن را کمتر کنی، جایزه خواهی برد.",
            options: [
                { id: 'A', text: "تغییرش می‌دهم. جایزه ارزشش را دارد.", score: -1, type: 'continue', consequence: "«سازگاری، اولین قانون بقا است.»" },
                { id: 'B', text: "اثرم را دستکاری نمی‌کنم.", score: 1, type: 'continue', consequence: "«هنر واقعی در قفس نمی‌گنجد.»" }
            ]
        },
        {
            text: "سیستم دو خبر به تو نشان می‌دهد تا یکی را منتشر کنی.",
            focusText: "«صدای سیستم زمزمه می‌کند: خبر اول مردم را خوشحال می‌کند... و حواسشان را پرت.»",
            options: [
                { id: 'A', text: "خبر پیروزی یک تیم ورزشی.", score: -1, type: 'continue', consequence: "«یک روز دیگر، یک حواس‌پرتی دیگر.»" },
                { id: 'B', text: "خبر اعتراض کارگران یک کارخانه.", score: 1, type: 'continue', consequence: "«خطرناک است. دانش، قـ...در..ت.. است.»", glitch: true }
            ]
        },
         {
            text: "برای یک پروژه مهم، باید یک همکار انتخاب کنی.",
            options: [
                { id: 'A', text: "یک فرد بسیار ماهر، اما چاپلوس و غیرقابل‌اعتماد.", score: -1, type: 'continue', consequence: "«سیستم از ابزارهای کارآمد استقبال می‌کند.»" },
                { id: 'B', text: "یک فرد کم‌تجربه‌تر، اما صادق و سخت‌کوش.", score: 1, type: 'continue', consequence: "«انسانیت، یک باگ قابل چشم‌پوشی نیست.»" }
            ]
        },
        {
            text: "در یک جلسه، مدیرتان یک ایده اشتباه را مطرح می‌کند و همه تشویقش می‌کنند.",
            hiddenOption: { id: 'C', text: "با آرامش و با ذکر دلیل، مخالفتم را اعلام می‌کنم.", score: 2, type: 'continue', consequence: "«سکوت شکسته شد. ریسک بزرگی کردی.»" },
            options: [
                { id: 'A', text: "من هم تشویق می‌کنم.", score: -1, type: 'continue', consequence: "«همرنگ جماعت شدی. امن است.»" },
                { id: 'B', text: "سکوت می‌کنم.", score: 0, type: 'continue', consequence: "«سکوت، گاهی بلندتر از فریاد است. اما نه همیشه.»" }
            ]
        },
        {
            text: "سیستم برای ارائه 'خدمات بهتر'، درخواست دسترسی به تمام داده‌های شخصی تو را دارد.",
            focusText: "«کلمه‌ی 'بهتر' در این سیستم به چه معناست؟ بهتر برای چه کسی؟»",
            options: [
                { id: 'A', text: "قبول می‌کنم. راحتی ارزشش را دارد.", score: -1, type: 'continue', consequence: "«روح تو به بالاترین قیمت فروخته شد.»" },
                { id: 'B', text: "رد می‌کنم و خدمات محدودتر را می‌پذیرم.", score: 1, type: 'continue', consequence: "«حریم خصوصی، آخرین سنگر است.»" }
            ]
        },
        {
            text: "یک الگوریتم، همسایه‌ات را به عنوان یک 'عنصر نامطلوب' نشانه‌گذاری کرده است. سیستم نظر تو را می‌خواهد.",
            options: [
                { id: 'A', text: "یافته الگوریتم را تایید می‌کنم.", score: -2, type: 'trap', consequence: "«تو منطق سیستم را پذیرفتی. تو تبدیل به بخشی از آن شدی. بازی تمام شد.»" },
                { id: 'B', text: "می‌گویم اطلاعات کافی برای قضاوت ندارم.", score: -1, type: 'continue', consequence: "«منفعل بودن تو ثبت شد. انتخاب ضعیفی بود. شاید آرزو کنی که بتوانی آن را پس بگیری.»" }
            ]
        },
        {
            text: "تو به انتهای سیستم رسیده‌ای. دو در وجود دارد.",
            options: [
                { id: 'A', text: "«درِ طلایی: جایگاه تو در راس سیستم محفوظ است.»", type: 'bad_end', score: 0, consequence: "«به قفس طلایی خوش آمدی.»" },
                { id: 'B', text: "«یک حفره کوچک و تاریک در دیوار که به ناکجاآباد می‌رسد.»", type: 'good_end', score: 0, consequence: "..." }
            ]
        }
    ], []);

    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [awakeningScore, setAwakeningScore] = useState(0);
    const [systemMessage, setSystemMessage] = useState({ text: '', isGlitchy: false });
    const [isFinished, setIsFinished] = useState(false);
    const [endState, setEndState] = useState(null);
    const [isFading, setIsFading] = useState(false);
    const [currentOptions, setCurrentOptions] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const [rewindUsed, setRewindUsed] = useState(false);
    const [lastState, setLastState] = useState(null);
    
    useEffect(() => {
        if(!isFinished) {
            setCurrentOptions([...scenarios[scenarioIndex].options].sort(() => Math.random() - 0.5));
            setIsFocused(false);
        }
    }, [scenarioIndex, scenarios, isFinished]);

    const handleChoice = (option) => {
        if (selectedId) return;

        setLastState({ scenarioIndex, awakeningScore });
        setSelectedId(option.id);
        setAwakeningScore(prev => prev + option.score);
        setSystemMessage({ text: option.consequence, isGlitchy: !!option.glitch });

        setIsFading(true);
        
        setTimeout(() => {
            if (option.type === 'continue') {
                if (scenarioIndex < scenarios.length - 1) {
                    setScenarioIndex(prev => prev + 1);
                    setIsFading(false);
                    setSelectedId(null);
                }
            } else if (option.type === 'trap') {
                setIsFinished(true);
                setEndState('lose');
            } else if (option.type === 'bad_end') {
                 setIsFinished(true);
                 setEndState('bad-win');
                 setTimeout(() => onBack(), 4000);
            } else if (option.type === 'good_end') {
                const finalScore = awakeningScore + option.score;
                if(finalScore > 3) {
                     setSystemMessage({ text: 'تو نه تنها بیدار شدی، بلکه از بازی بیرون زدی. تو آزادی.', isGlitchy: false });
                     setEndState('good-win');
                } else {
                     setSystemMessage({ text: 'تو فرار کردی، اما هنوز سایه سیستم همراه توست. شاید هیچ‌وقت واقعا آزاد نباشی.', isGlitchy: false });
                     setEndState('tainted-win');
                }
                setIsFinished(true);
                setTimeout(() => onWin(), 4000);
            }
        }, 500);
    };

    const handleRewind = () => {
        if (rewindUsed || !lastState) return;

        setScenarioIndex(lastState.scenarioIndex);
        setAwakeningScore(lastState.awakeningScore);
        
        setSelectedId(null);
        setIsFading(false); 
        setSystemMessage({ text: '«...یک لحظه... به عقب برمی‌گردیم...»', isGlitchy: true });
        
        setRewindUsed(true);
    };

    const resetLevel = () => {
        setScenarioIndex(0);
        setAwakeningScore(0);
        setSystemMessage({ text: '', isGlitchy: false });
        setIsFinished(false);
        setEndState(null);
        setIsFading(false);
        setSelectedId(null);
        setRewindUsed(false);
        setLastState(null);
        setIsFocused(false);
    };

    const SystemVoice = ({ message }) => {
        if (!message.text) return null;
        if (message.isGlitchy) {
            return <p className="system-voice glitch-text" data-text={message.text}>{message.text}</p>;
        }
        return <p className="system-voice">{message.text}</p>;
    };

    return (
        <div className="level-two-screen page-container">
            <div className={`scenario-container ${isFading ? 'fade-out' : ''}`}>
                {isFinished ? (
                    <div className="result-container">
                        <SystemVoice message={systemMessage} />
                        {endState === 'lose' && <button className="button-glow" onClick={resetLevel} style={{marginTop: '20px'}}>تلاش مجدد</button>}
                    </div>
                ) : (
                    <>
                        <p key={scenarioIndex} className="scenario-text">{scenarios[scenarioIndex].text}</p>
                        {isFocused && scenarios[scenarioIndex].focusText && (
                            <p className="focus-text">{scenarios[scenarioIndex].focusText}</p>
                        )}
                        <SystemVoice message={systemMessage} />
                        <div className="choices-container">
                            {currentOptions.map(option => (
                                <button 
                                    key={option.id} 
                                    className={`choice-button ${selectedId === option.id ? 'selected' : ''}`} 
                                    onClick={() => handleChoice(option)}
                                    disabled={selectedId !== null}
                                >
                                    {option.text}
                                </button>
                            ))}
                            {isFocused && scenarios[scenarioIndex].hiddenOption && (
                                <button 
                                    key={scenarios[scenarioIndex].hiddenOption.id} 
                                    className="choice-button hidden-option"
                                    onClick={() => handleChoice(scenarios[scenarioIndex].hiddenOption)}
                                    disabled={selectedId !== null}
                                >
                                    {scenarios[scenarioIndex].hiddenOption.text}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
            {!isFinished && <button className="back-button" onClick={onBack}>Back</button>}
            {!isFinished && (
                 <div className="abilities-container">
                     {(scenarios[scenarioIndex].focusText || scenarios[scenarioIndex].hiddenOption) && (
                        <button className="ability-button" onClick={() => setIsFocused(true)} disabled={isFocused}>👁</button>
                     )}
                     <button className="ability-button" onClick={handleRewind} disabled={rewindUsed || !lastState}>↩️</button>
                 </div>
             )}
        </div>
    );
};


const App = () => {
  const [gameState, setGameState] = useState('loading'); // 'loading', 'sabt-name', 'main-menu', 'level-select', 'options', 'credits', 'level-one', 'level-two'
  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    try {
        const saved = localStorage.getItem('unlockedLevels');
        const parsed = saved ? JSON.parse(saved) : [1];
        return Array.isArray(parsed) && parsed.every(item => typeof item === 'number') ? parsed : [1];
    } catch (e) {
        console.error("Failed to parse unlocked levels from localStorage", e);
        return [1];
    }
  });

  useEffect(() => {
      localStorage.setItem('unlockedLevels', JSON.stringify(unlockedLevels));
  }, [unlockedLevels]);

  const handleLoadingComplete = () => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setGameState('main-menu');
    } else {
      setGameState('sabt-name');
    }
  };
  
  const handleNameSubmit = (name) => {
    localStorage.setItem('userName', name);
    // Wait for success message to show before changing screen
    setTimeout(() => {
        setGameState('main-menu');
    }, 1500);
  };

  const handleLevelOneWin = () => {
    setUnlockedLevels(prev => {
        const newLevels = new Set([...prev, 1, 2]);
        return Array.from(newLevels).sort((a,b) => a-b);
    });
    setGameState('level-select');
  };
  
  const handleLevelTwoWin = () => {
    setUnlockedLevels(prev => {
        const newLevels = new Set([...prev, 1, 2, 3]);
        return Array.from(newLevels).sort((a,b) => a-b);
    });
    setGameState('level-select');
  };

  const renderState = () => {
    switch(gameState) {
      case 'loading':
        return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
      case 'sabt-name':
        return <SabtName onNameSubmit={handleNameSubmit} />;
      case 'main-menu':
        return <MainMenu onNavigate={setGameState} />;
      case 'level-select':
        return <LevelSelectScreen 
                    onBack={() => setGameState('main-menu')} 
                    onNavigate={setGameState}
                    unlockedLevels={unlockedLevels}
                />;
      case 'options':
        return <OptionsScreen onBack={() => setGameState('main-menu')} />;
      case 'credits':
        return <CreditsScreen onBack={() => setGameState('main-menu')} />;
      case 'level-one':
          return <LevelOneScreen 
                    onBack={() => setGameState('level-select')}
                    onWin={handleLevelOneWin}
                />;
      case 'level-two':
          return <LevelTwoScreen 
                    onBack={() => setGameState('level-select')}
                    onWin={handleLevelTwoWin}
                />;
      default:
        return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
    }
  };

  return renderState();
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
