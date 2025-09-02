import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [startClicked, setStartClicked] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    // Start the intro animation after a longer delay for suspense
    const introTimer = setTimeout(() => {
      setIntroFinished(true);
    }, 1500); // Increased from 500ms to 1.5s

    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    // Don't start the loading progress until the intro animation is done
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
      // In a real game, you would navigate to the main menu here
      // setTimeout(() => console.log("Start Game!"), 500);
    }
  };

  const logoUrl = 'https://up.20script.ir/file/e71f-gemini-2-5-flash-image-preview-nano-banana-میخوام-دست-هایشان-پی.png';

  return (
    <>
      <style>{`
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
              0 0 5px #fff,
              0 0 10px #fff,
              0 0 15px #fff,
              0 0 20px #ff0000,
              0 0 35px #ff0000,
              0 0 40px #ff0000,
              0 0 50px #ff0000,
              0 0 75px #ff0000;
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
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(1%, 1%); }
          30% { transform: translate(-2%, 2%); }
          40% { transform: translate(2%, -2%); }
          50% { transform: translate(-1%, 2%); }
          60% { transform: translate(2%, 1%); }
          70% { transform: translate(1%, -2%); }
          80% { transform: translate(-2%, -1%); }
          90% { transform: translate(1%, 2%); }
        }

        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          font-family: 'Creepster', cursive;
          /* Updated background to a red-black theme */
          background: radial-gradient(ellipse at center, #2e0000 0%, #000 75%);
          animation: backgroundPulse 7s infinite ease-in-out;
        }

        .loading-container {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background: transparent;
          color: #ff0000;
          text-align: center;
          user-select: none;
          isolation: isolate;
          opacity: 0;
          transition: opacity 0.5s ease-in;
        }

        .loading-container.intro-finished {
            opacity: 1;
        }
        
        .loading-container.shake {
            animation: screenShake 0.5s ease-in-out;
        }

        .loading-container::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            z-index: -2;
            opacity: 0;
        }

        .intro-finished .loading-container::before {
            animation: revealFlash 0.5s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards, 
                       backgroundSwirl 60s 0.5s linear infinite;
        }
        
        .loading-container::after {
            content: '';
            position: absolute;
            top: -10%;
            left: -10%;
            width: 120%;
            height: 120%;
            box-shadow: inset 0 0 10vw 5vw #000;
            z-index: -1;
            /* Film grain effect */
            background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.5"/></svg>');
            background-size: 100px;
            opacity: 0.1;
            animation: grain 0.4s steps(1, end) infinite;
        }

        .logo {
          width: 60%;
          max-width: 250px;
          margin-bottom: 40px;
          opacity: 0;
          will-change: transform, filter, opacity;
          z-index: 1; /* Ensure logo is above grain */
        }
        
        .intro-finished .logo {
          animation: logoSlam 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, 
                     pulse 3s 0.5s infinite ease-in-out, 
                     float 8s 0.5s infinite ease-in-out;
        }

        .progress-bar-container {
          width: 80%;
          max-width: 400px;
          height: 12px;
          background-color: rgba(51, 0, 0, 0.5);
          border: 1px solid #660000;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
          backdrop-filter: blur(2px);
          opacity: 0;
          z-index: 1; /* Ensure progress bar is above grain */
        }

        .intro-finished .progress-bar-container {
            animation: barGlitchIn 0.5s 0.1s ease-out forwards;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #b40000, #ff0000, #ff4d4d);
          box-shadow: 0 0 15px #ff0000, 0 0 5px #ff4d4d;
          transition: width 0.1s linear;
          border-radius: 5px;
          position: relative;
          overflow: hidden;
        }
        
        .progress-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: flicker 1.5s infinite linear;
        }

        .loading-text {
          margin-top: 25px;
          font-size: clamp(1.5rem, 5vw, 2rem);
          letter-spacing: 0.2em;
          opacity: 0;
          z-index: 1; /* Ensure text is above grain */
        }
        
        .intro-finished .loading-text.loading {
            opacity: 1; /* Instantly visible for animation */
            animation: flicker 2s 0.2s linear infinite;
        }
        
        .intro-finished .loading-text.tap-to-start {
            opacity: 1;
            animation: tapGlow 2.5s infinite ease-in-out;
            cursor: pointer;
        }

      `}</style>
      <div 
        className={`loading-container ${introFinished ? 'intro-finished' : ''} ${startClicked ? 'shake' : ''}`} 
        role="application" 
        aria-busy={!isLoaded} 
        aria-label="Game is loading"
        onClick={handleStartClick}
      >
        <img src={logoUrl} alt="Game Logo" className="logo" />
        {/* FIX: The aria-valuemin and aria-valuemax props expect numbers, not strings. */}
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
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);