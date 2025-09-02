import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Main App component to handle routing
const App = () => {
  const [currentPage, setCurrentPage] = useState('loading');

  const handleLoadingComplete = () => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setCurrentPage('main_menu');
    } else {
      setCurrentPage('sabt_name');
    }
  };

  const handleNameSubmit = (name) => {
    localStorage.setItem('userName', name);
    setCurrentPage('main_menu');
  };

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

    const handleStartClick = () => {
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
      // Submit the name and proceed
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
  const MainMenu = () => {
    const [activeButton, setActiveButton] = useState(null);

    const handleButtonClick = (buttonName) => {
      setActiveButton(buttonName);
      console.log(`${buttonName} button clicked!`);
      setTimeout(() => setActiveButton(null), 500);
    };

    return (
      <div className="main-menu-container">
        <h1 className="title">
          THE ABYSS
        </h1>
        <div className="menu-list">
          <button
            className={`menu-button ${activeButton === 'start' ? 'active' : ''}`}
            onClick={() => handleButtonClick('start')}
          >
            Start
          </button>
          <button
            className={`menu-button ${activeButton === 'options' ? 'active' : ''}`}
            onClick={() => handleButtonClick('options')}
          >
            Options
          </button>
          <button
            className={`menu-button ${activeButton === 'credits' ? 'active' : ''}`}
            onClick={() => handleButtonClick('credits')}
          >
            Credits
          </button>
          <button
            className={`menu-button ${activeButton === 'exit' ? 'active' : ''}`}
            onClick={() => handleButtonClick('exit')}
          >
            Exit
          </button>
        </div>
      </div>
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'sabt_name':
        return <SabtName onNameSubmit={handleNameSubmit} />;
      case 'main_menu':
        return <MainMenu />;
      case 'loading':
      default:
        return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
    }
  };

  return (
    <>
      <style>{`
        /* Global Styles */
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          font-family: 'Creepster', cursive;
          background: radial-gradient(ellipse at center, #2e0000 0%, #000 75%);
          color: #ff0000;
          animation: backgroundPulse 7s infinite ease-in-out;
        }

        /* Keyframes */
        @keyframes pulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 5px #ff0000); }
          50% { transform: scale(1.03); filter: drop-shadow(0 0 15px #ff0000); }
          100% { transform: scale(1); filter: drop-shadow(0 0 5px #ff0000); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes flicker {
          0%, 18%, 22%, 25%, 53%, 57%, 100% {
            text-shadow:
              0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff,
              0 0 20px #ff0000, 0 0 35px #ff0000, 0 0 40px #ff0000,
              0 0 50px #ff0000, 0 0 75px #ff0000;
            opacity: 1;
          }
          20%, 24%, 55% { text-shadow: none; opacity: 0.7; }
        }
        @keyframes backgroundSwirl {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes tapGlow {
            0%, 100% { text-shadow: 0 0 10px #ff4d4d, 0 0 20px #ff0000; }
            50% { text-shadow: 0 0 20px #ff4d4d, 0 0 40px #ff0000, 0 0 50px #b40000; }
        }
        @keyframes screenShake {
          0%, 100% { transform: translate(0, 0); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-2px, 2px); }
          20%, 40%, 60%, 80% { transform: translate(2px, -2px); }
        }
        @keyframes logoSlam {
            0% { transform: scale(25); opacity: 0; }
            80% { transform: scale(0.95); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        @keyframes revealFlash {
            from { 
                background: radial-gradient(circle, rgba(255,0,0,0.9) 0%, rgba(0,0,0,0) 20%);
                opacity: 1;
            }
            to { 
                background: radial-gradient(circle, rgba(100,0,0,0.4) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 80%),
                            radial-gradient(circle, rgba(50,0,0,0.5) 0%, rgba(0,0,0,0) 70%);
                opacity: 1;
            }
        }
        @keyframes barGlitchIn {
            0% { opacity: 0; transform: scaleX(0); }
            60% { opacity: 1; transform: scaleX(1.1); }
            100% { opacity: 1; transform: scaleX(1); }
        }
        @keyframes backgroundPulse {
          0% { box-shadow: inset 0 0 80px 40px #000; }
          50% { box-shadow: inset 0 0 120px 60px rgba(100, 0, 0, 0.3); }
          100% { box-shadow: inset 0 0 80px 40px #000; }
        }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); } 10% { transform: translate(-1%, -1%); } 20% { transform: translate(1%, 1%); } 30% { transform: translate(-2%, 2%); } 40% { transform: translate(2%, -2%); } 50% { transform: translate(-1%, 2%); } 60% { transform: translate(2%, 1%); } 70% { transform: translate(1%, -2%); } 80% { transform: translate(-2%, -1%); } 90% { transform: translate(1%, 2%); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); }
        }
        @keyframes textFlicker {
            0%, 100% { text-shadow: 0 0 5px #ff0000; color: #ff0000; }
            50% { text-shadow: 0 0 10px #ff4d4d, 0 0 20px #ff0000; color: #ff4d4d; }
        }
        @keyframes inputGlow {
            0%, 100% { box-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000; }
            50% { box-shadow: 0 0 10px #ff4d4d, 0 0 20px #ff0000, 0 0 30px #b40000; }
        }
        @keyframes neonGlow {
          0%, 100% { text-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000; color: #ff0000; }
          50% { text-shadow: 0 0 10px #ff4d4d, 0 0 20px #ff0000, 0 0 30px #ff0000; color: #ff4d4d; }
        }
        @keyframes buttonClick {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); box-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000; }
          100% { transform: scale(1); }
        }
        @keyframes menuSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        /* Grain Overlay */
        .grain-overlay::after {
            content: ''; position: absolute; top: -10%; left: -10%; width: 120%; height: 120%; box-shadow: inset 0 0 10vw 5vw #000; z-index: -1; background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.5"/></svg>'); background-size: 100px; opacity: 0.1; animation: grain 0.4s steps(1, end) infinite;
        }

        /* Loading Screen Styles */
        .loading-container {
          position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%; background: transparent; color: #ff0000; text-align: center; user-select: none; isolation: isolate; opacity: 0; transition: opacity 0.5s ease-in;
        }
        .loading-container.intro-finished { opacity: 1; }
        .loading-container.shake { animation: screenShake 0.5s ease-in-out; }
        .loading-container::before {
            content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; z-index: -2; opacity: 0;
        }
        .intro-finished .loading-container::before {
            animation: revealFlash 0.5s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards, backgroundSwirl 60s 0.5s linear infinite;
        }
        .loading-container::after { /* Grain from shared style */
          content: ''; position: absolute; top: -10%; left: -10%; width: 120%; height: 120%; box-shadow: inset 0 0 10vw 5vw #000; z-index: -1; background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.5"/></svg>'); background-size: 100px; opacity: 0.1; animation: grain 0.4s steps(1, end) infinite;
        }
        .logo {
          width: 60%; max-width: 250px; margin-bottom: 40px; opacity: 0; will-change: transform, filter, opacity; z-index: 1;
        }
        .intro-finished .logo {
          animation: logoSlam 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, pulse 3s 0.5s infinite ease-in-out, float 8s 0.5s infinite ease-in-out;
        }
        .progress-bar-container {
          width: 80%; max-width: 400px; height: 12px; background-color: rgba(51, 0, 0, 0.5); border: 1px solid #660000; border-radius: 6px; overflow: hidden; box-shadow: 0 0 10px rgba(255, 0, 0, 0.5); backdrop-filter: blur(2px); opacity: 0; z-index: 1;
        }
        .intro-finished .progress-bar-container {
            animation: barGlitchIn 0.5s 0.1s ease-out forwards;
        }
        .progress-bar {
          height: 100%; background: linear-gradient(90deg, #b40000, #ff0000, #ff4d4d); box-shadow: 0 0 15px #ff0000, 0 0 5px #ff4d4d; transition: width 0.1s linear; border-radius: 5px; position: relative; overflow: hidden;
        }
        .progress-bar::after {
            content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); animation: flicker 1.5s infinite linear;
        }
        .loading-text {
          margin-top: 25px; font-size: clamp(1.5rem, 5vw, 2rem); letter-spacing: 0.2em; opacity: 0; z-index: 1;
        }
        .intro-finished .loading-text.loading {
            opacity: 1; animation: flicker 2s 0.2s linear infinite;
        }
        .intro-finished .loading-text.tap-to-start {
            opacity: 1; animation: tapGlow 2.5s infinite ease-in-out; cursor: pointer;
        }

        /* SabtName Styles */
        .sabt-name-container {
          position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%; user-select: none; isolation: isolate;
        }
        .sabt-name-container::before {
          content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.5"/></svg>'); background-size: 100px; opacity: 0.15; animation: grain 0.4s steps(1, end) infinite; z-index: 1;
        }
        .form-card {
          position: relative; z-index: 2; padding: 40px; background: rgba(0, 0, 0, 0.6); border: 2px solid #ff0000; border-radius: 15px; backdrop-filter: blur(5px); box-shadow: 0 0 20px #ff0000; text-align: center; width: 90%; max-width: 400px;
        }
        .form-card h1 {
          font-size: clamp(2rem, 8vw, 3rem); margin-bottom: 20px; letter-spacing: 0.1em; text-transform: uppercase; animation: textFlicker 3s linear infinite;
        }
        .form-card p {
          font-size: 1rem; margin-bottom: 30px; animation: textFlicker 4s linear infinite;
        }
        .form-group { margin-bottom: 20px; }
        .form-group.shake { animation: shake 0.5s; }
        .form-card input {
          box-sizing: border-box; width: 100%; padding: 10px; background-color: transparent; border: 2px solid #b40000; border-radius: 8px; color: #ff0000; font-size: 1.2rem; text-align: center; font-family: 'Creepster', cursive; transition: all 0.3s ease; animation: inputGlow 2.5s infinite ease-in-out;
        }
        .form-card input:focus {
          outline: none; border-color: #ff4d4d; box-shadow: 0 0 15px #ff4d4d;
        }
        .button-glow {
          position: relative; padding: 10px 20px; background: linear-gradient(45deg, #b40000, #ff0000); border: none; border-radius: 8px; color: #fff; font-family: 'Creepster', cursive; font-size: 1.5rem; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000;
        }
        .button-glow:hover {
          background: linear-gradient(45deg, #ff0000, #b40000); box-shadow: 0 0 15px #ff4d4d, 0 0 30px #ff0000; transform: translateY(-2px);
        }
        .button-glow:active { transform: translateY(0); }
        .success-message {
            font-size: 1.5rem; color: #00ff00; text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00; animation: textFlicker 2s linear infinite;
        }

        /* Main Menu Styles */
        .main-menu-container {
          display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; padding: 20px; box-sizing: border-box;
        }
        .title {
          font-size: clamp(3rem, 10vw, 5rem); margin-bottom: 40px; animation: neonGlow 2.5s infinite ease-in-out;
        }
        .menu-list {
          display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 300px; animation: menuSlideIn 1s ease-out forwards;
        }
        .menu-button {
          background-color: rgba(0, 0, 0, 0.7); color: #ff0000; border: 2px solid #ff0000; padding: 15px 0; font-family: 'Creepster', cursive; font-size: 1.8rem; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
        }
        .menu-button:hover {
          transform: scale(1.05); box-shadow: 0 0 20px #ff4d4d, 0 0 40px #ff0000;
        }
        .menu-button:active { animation: buttonClick 0.5s ease-out; }
        .menu-button.active {
          animation: buttonHover 0.7s infinite ease-in-out; background-color: #ff0000; color: #000;
        }
      `}</style>
      {renderPage()}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);