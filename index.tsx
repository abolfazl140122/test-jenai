
import React, { useState, useEffect } from 'react';
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
        { id: 2, name: 'Echoing Halls' },
        { id: 3, name: 'The Cellar' },
        { id: 4, name: 'Crimson Library' },
        { id: 5, name: 'The Ritual' },
        { id: 6, name: 'Final Descent' },
    ];

    const handleLevelClick = (level) => {
        if (!unlockedLevels.includes(level.id)) return;
        
        if (level.id === 1) {
            onNavigate('level-one');
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
    const scenarios = [
        {
            text: "صبح شده. دو تیتر خبر روی صفحه گوشی‌ات می‌بینی. کدام را باز می‌کنی؟",
            options: [
                { id: 'A', text: "جشنواره بزرگ تخفیف آخر هفته! همه چیز نصف قیمت!" },
                { id: 'B', text: "آلودگی هوای شهر در وضعیت هشدار باقی ماند" }
            ]
        },
        {
            text: "در راهرو، همکارت بسته‌ای شیرینی تعارف می‌کند. چه می‌کنی؟",
            options: [
                { id: 'A', text: "یکی برمی‌دارم و تشکر می‌کنم. روزم را می‌سازد." },
                { id: 'B', text: "رد می‌کنم و به او یادآوری می‌کنم که قند برای سلامتی مضر است." }
            ]
        },
        {
            text: "شب در خانه، صدای گریه‌ی ضعیفی از آپارتمان همسایه می‌شنوی. چه می‌کنی؟",
            options: [
                { id: 'A', text: "صدای تلویزیون را بلندتر می‌کنم تا نشنوم." },
                { id: 'B', text: "می‌روم در بزنم و بپرسم آیا همه چیز مرتب است." }
            ]
        }
    ];

    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [choices, setChoices] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [result, setResult] = useState(null); // 'win' or 'lose'
    const [containerKey, setContainerKey] = useState(0);

    const handleChoice = (choiceId) => {
        const newChoices = [...choices, choiceId];
        setChoices(newChoices);

        if (scenarioIndex < scenarios.length - 1) {
            setScenarioIndex(scenarioIndex + 1);
            setContainerKey(prev => prev + 1);
        } else {
            const bCount = newChoices.filter(c => c === 'B').length;
            const finalResult = bCount >= 2 ? 'win' : 'lose';
            setResult(finalResult);
            setIsFinished(true);
            setContainerKey(prev => prev + 1);

            if (finalResult === 'win') {
                setTimeout(() => {
                    onWin();
                }, 2500);
            }
        }
    };

    const resetLevel = () => {
        setScenarioIndex(0);
        setChoices([]);
        setIsFinished(false);
        setResult(null);
        setContainerKey(prev => prev + 1);
    };
    
    return (
        <div className="level-one-screen page-container">
            <div className="scenario-container" key={containerKey}>
                {isFinished ? (
                    <div className="result-container">
                        {result === 'win' ? (
                            <h2 className="success-message">تو درد را انتخاب کردی، چون به دنبال حقیقت بودی. این اولین قدم بیداری است.</h2>
                        ) : (
                            <>
                                <p>تو راحتی را انتخاب کردی. قفس‌هایی هستند که از طلا ساخته شده‌اند.</p>
                                <button className="button-glow" onClick={resetLevel}>تلاش مجدد</button>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <p className="scenario-text">{scenarios[scenarioIndex].text}</p>
                        <div className="choices-container">
                            {scenarios[scenarioIndex].options.map(option => (
                                <button key={option.id} className="choice-button" onClick={() => handleChoice(option.id)}>
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
  const [gameState, setGameState] = useState('loading'); // 'loading', 'sabt-name', 'main-menu', 'level-select', 'options', 'credits', 'level-one'
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
