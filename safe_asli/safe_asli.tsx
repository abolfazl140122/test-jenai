import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const MainMenu = () => {
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    // In a real game, you would handle navigation here
    console.log(`${buttonName} button clicked!`);
    setTimeout(() => setActiveButton(null), 500);
  };

  return (
    <>
      <style>{`
        @keyframes neonGlow {
          0%, 100% { text-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000; color: #ff0000; }
          50% { text-shadow: 0 0 10px #ff4d4d, 0 0 20px #ff0000, 0 0 30px #ff0000; color: #ff4d4d; }
        }

        @keyframes buttonHover {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); box-shadow: 0 0 15px #ff0000, 0 0 25px #ff0000; }
          100% { transform: scale(1); }
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

        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          font-family: 'Creepster', cursive;
          background: radial-gradient(ellipse at center, #2e0000 0%, #000 75%);
          color: #ff0000;
        }

        .main-menu-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          text-align: center;
          padding: 20px;
          box-sizing: border-box;
        }

        .title {
          font-size: clamp(3rem, 10vw, 5rem);
          margin-bottom: 40px;
          animation: neonGlow 2.5s infinite ease-in-out;
        }

        .menu-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 300px;
          animation: menuSlideIn 1s ease-out forwards;
        }

        .menu-button {
          background-color: rgba(0, 0, 0, 0.7);
          color: #ff0000;
          border: 2px solid #ff0000;
          padding: 15px 0;
          font-family: 'Creepster', cursive;
          font-size: 1.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
        }

        .menu-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px #ff4d4d, 0 0 40px #ff0000;
        }

        .menu-button:active {
          animation: buttonClick 0.5s ease-out;
        }

        .menu-button.active {
          animation: buttonHover 0.7s infinite ease-in-out;
          background-color: #ff0000;
          color: #000;
        }
      `}</style>
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
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<MainMenu />);