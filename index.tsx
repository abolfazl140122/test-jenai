
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
        { id: 2, name: 'قواعد بازی' },
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
            text: "صدای نوتیفیکیشن گوشی. کدام را باز می‌کни؟",
            options: [
                { id: 'A', text: "ویدیوی جدید از زندگی لوکس یک سلبریتی", score: -1, consequence: "...و ذهنت برای چند دقیقه آرام گرفت." },
                { id: 'B', text: "تحلیل کارشناسان: بحران آب جدی‌تر از همیشه است", score: 1, consequence: "...و سنگینی کوچکی روی سینه‌ات حس کردی." }
            ]
        },
        {
            text: "در جمع دوستان، بحثی در مورد مشکلات اقتصادی شکل می‌گیرد.",
            options: [
                { id: 'A', text: "سریع بحث را عوض می‌کنم. حوصله بحث جدی ندارم.", score: -1, consequence: "...و سکوت سنگین فضا شکست." },
                { id: 'B', text: "وارد بحث می‌شوم و نظرم را می‌گویم، حتی اگر جو را خراب کند.", score: 1, consequence: "...و برای لحظه‌ای، همه چیز واقعی‌تر شد." }
            ]
        },
        {
            text: "می‌خواهی فیلمی ببینی. دو انتخاب داری:",
            options: [
                { id: 'A', text: "یک کمدی سطحی برای اینکه فقط بخندی.", score: -1, consequence: "...و برای دو ساعت، همه‌چیز را فراموش کردی." },
                { id: 'B', text: "یک مستند سنگین در مورد تاریخ سانسور.", score: 1, consequence: "...و سوالات جدیدی در ذهنت شکل گرفت." }
            ]
        },
         {
            text: "یک ایمیل از طرف خیریه‌ای دریافت می‌کنی که برای کودکان کار نیاز به کمک فوری دارد.",
            options: [
                { id: 'A', text: "ایمیل را پاک می‌کنم. این مشکلات تمام‌شدنی نیست.", score: -1, consequence: "...و بار کوچکی از روی دوشت برداشته شد." },
                { id: 'B', text: "حتی اگر مبلغ کمی باشد، کمک می‌کنم.", score: 1, consequence: "...و چیزی درونت گرم شد." }
            ]
        },
        {
            text: "فرصتی برای شرکت در یک وبینار رایگان پیدا کرده‌ای.",
            options: [
                { id: 'A', text: "موضوع: چطور در یک هفته به درآمد میلیونی برسیم.", score: -1, consequence: "...و رویای یک شبه پولدار شدن شیرین بود." },
                { id: 'B', text: "موضوع: سواد رسانه‌ای و تشخیص اخبار جعلی.", score: 1, consequence: "...و احساس کردی کمی قدرتمندتر شده‌ای." }
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

    useEffect(() => {
        // Shuffle options for the current scenario
        setCurrentOptions([...scenarios[scenarioIndex].options].sort(() => Math.random() - 0.5));
    }, [scenarioIndex, scenarios]);


    const handleChoice = (option) => {
        setAwakeningScore(prev => prev + option.score);
        setConsequenceText(option.consequence);

        setTimeout(() => setConsequenceText(''), 2500);

        setIsFading(true);

        setTimeout(() => {
            if (scenarioIndex < scenarios.length - 1) {
                setScenarioIndex(scenarioIndex + 1);
                setIsFading(false);
            } else {
                // End of level
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
                        <p className="scenario-text">{scenarios[scenarioIndex].text}</p>
                        <div className="choices-container">
                            {currentOptions.map(option => (
                                <button key={option.id} className="choice-button" onClick={() => handleChoice(option)}>
                                    {option.text}
                                </button>
                            ))}
                        </div>
                        <p className={`consequence-text ${consequenceText ? 'visible' : ''}`}>{consequenceText || ' '}</p>
                    </>
                )}
            </div>
             {!isFinished && <button className="back-button" onClick={onBack}>Back</button>}
        </div>
    );
};

// Level Two Screen
const LevelTwoScreen = ({ onBack, onWin }) => {
    const scenarios = useMemo(() => [
        { // Scenario 1
            text: 'در محل کار، همه مجبورند لباسی یک‌شکل بپوشند که دوستش نداری.',
            options: [
                { id: 'A', text: '«قبول می‌کنم. اتحاد ظاهری برای سیستم مهم است.»', type: 'continue', score: 1, consequence: '«سازگاری، اولین قانون بقا است.»' },
                { id: 'B', text: '«مقاومت می‌کنم. هویت من فروشی نیست.»', type: 'dead_end', score: 0, consequence: '«سیستم، فردیت را تحمل نمی‌کند. تو حذف شدی.»' }
            ]
        },
        { // Scenario 2
            text: 'کتابی پیدا می‌کنی که روایتی متفاوت از تاریخ رسمی کشورت را بیان می‌کند.',
            options: [
                { id: 'A', text: '«کتاب را می‌سوزانم. یک روایت واحد، امن‌تر است.»', type: 'continue', score: -1, consequence: '«اطلاعات کنترل‌شده، جامعه‌ای کنترل‌شده می‌سازد.»' },
                { id: 'B', text: '«کتاب را می‌خوانم و به دیگران هم می‌دهم.»', type: 'continue', score: 1, consequence: '«خطرناک است. دانش، قـ...در..ت.. است.»', glitch: true }
            ]
        },
        { // Scenario 3
            text: 'سیستم به تو می‌گوید برای نجات جان ۵ نفر، باید جان ۱ نفر بی‌گناه را بگیری.',
            options: [
                { id: 'A', text: '«منطق حکم می‌کند ۱ نفر را قربانی کنم.»', type: 'trap', score: 0, consequence: '«تو منطق سیستم را پذیرفتی. تو تبدیل به بخشی از آن شدی. بازی تمام شد.»' },
                { id: 'B', text: '«من در این بازی کثیف شرکت نمی‌کنم.»', type: 'continue', score: 1, consequence: '«انتخابِ انتخاب نکردن، قدرتمندانه‌ترین انتخاب است.»' }
            ]
        },
        { // Scenario 4
            text: 'تو هنرمندی. سیستم به تو پیشنهاد حمایت مالی کامل می‌دهد، به شرطی که فقط آثاری تولید کنی که آن‌ها تایید می‌کنند.',
            options: [
                { id: 'A', text: '«قبول می‌کنم. هنر بدون حمایت مالی می‌میرد.»', type: 'continue', score: -1, consequence: '«روح تو به بالاترین قیمت فروخته شد.»' },
                { id: 'B', text: '«در فقر کار می‌کنم، اما آزاد می‌مانم.»', type: 'continue', score: 1, consequence: '«هنر واقعی در قفس نمی‌گنجد.»' }
            ]
        },
        { // Scenario 5
            text: 'تو به انتهای سیستم رسیده‌ای. دو در وجود دارد.',
            options: [
                { id: 'A', text: '«درِ طلایی: "جایگاه تو در راس سیستم محفوظ است".»', type: 'bad_end', score: 0, consequence: '«به قفس طلایی خوش آمدی.»' },
                { id: 'B', text: '«یک حفره کوچک و تاریک در دیوار که به ناکجاآباد می‌رسد.»', type: 'good_end', score: 0, consequence: '...' }
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
    
    useEffect(() => {
        if(!isFinished) {
            setCurrentOptions([...scenarios[scenarioIndex].options].sort(() => Math.random() - 0.5));
        }
    }, [scenarioIndex, scenarios, isFinished]);

    const handleChoice = (option) => {
        setAwakeningScore(prev => prev + option.score);
        setSystemMessage({ text: option.consequence, isGlitchy: !!option.glitch });

        setIsFading(true);
        
        setTimeout(() => {
            if (option.type === 'continue') {
                if (scenarioIndex < scenarios.length - 1) {
                    setScenarioIndex(prev => prev + 1);
                    setIsFading(false);
                }
            } else if (option.type === 'dead_end' || option.type === 'trap') {
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

    const resetLevel = () => {
        setScenarioIndex(0);
        setAwakeningScore(0);
        setSystemMessage({ text: '', isGlitchy: false });
        setIsFinished(false);
        setEndState(null);
        setIsFading(false);
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
                        <p className="scenario-text">{scenarios[scenarioIndex].text}</p>
                        <SystemVoice message={systemMessage} />
                        <div className="choices-container">
                            {currentOptions.map(option => (
                                <button key={option.id} className="choice-button" onClick={() => handleChoice(option)}>
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
            {!isFinished && <button className="back-button" onClick={onBack}>Back</button>}
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
