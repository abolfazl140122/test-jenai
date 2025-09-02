
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
const LevelSelectScreen = ({ onBack }) => {
    const levels = [
        { id: 1, name: 'The Awakening', locked: false },
        { id: 2, name: 'Echoing Halls', locked: true },
        { id: 3, name: 'The Cellar', locked: true },
        { id: 4, name: 'Crimson Library', locked: true },
        { id: 5, name: 'The Ritual', locked: true },
        { id: 6, name: 'Final Descent', locked: true },
    ];

    const handleLevelClick = (level) => {
        if (level.locked) return;
        console.log(`Clicked on level: ${level.name}`);
        // No action for now as requested
    }

    return (
        <div className="level-select-container page-container">
            <h1 className="page-title">Stages</h1>
            <div className="level-grid">
                {levels.map(level => (
                    <div 
                        key={level.id} 
                        className={`level-card ${level.locked ? 'locked' : ''}`}
                        onClick={() => handleLevelClick(level)}
                        aria-label={level.locked ? `${level.name} (Locked)` : level.name}
                        role="button"
                        tabIndex={level.locked ? -1 : 0}
                    >
                        {level.locked ? <span className="lock-icon" aria-hidden="true">🔒</span> : level.id}
                    </div>
                ))}
            </div>
            <button className="back-button" onClick={onBack}>Back</button>
        </div>
    );
};


const App = () => {
  const [gameState, setGameState] = useState('loading'); // 'loading', 'sabt-name', 'main-menu', 'level-select', 'options', 'credits'

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

  const renderState = () => {
    switch(gameState) {
      case 'loading':
        return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
      case 'sabt-name':
        return <SabtName onNameSubmit={handleNameSubmit} />;
      case 'main-menu':
        return <MainMenu onNavigate={setGameState} />;
      case 'level-select':
        return <LevelSelectScreen onBack={() => setGameState('main-menu')} />;
      case 'options':
        return <OptionsScreen onBack={() => setGameState('main-menu')} />;
      case 'credits':
        return <CreditsScreen onBack={() => setGameState('main-menu')} />;
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
