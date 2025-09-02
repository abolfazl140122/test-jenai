import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const SabtName = () => {
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
    console.log('User Name:', userName);
  };

  return (
    <>
      <style>{`
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-5px, 5px);
          }
          40% {
            transform: translate(-5px, -5px);
          }
          60% {
            transform: translate(5px, 5px);
          }
          80% {
            transform: translate(5px, -5px);
          }
          100% {
            transform: translate(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
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

        @keyframes textFlicker {
            0%, 100% { text-shadow: 0 0 5px #ff0000; color: #ff0000; }
            50% { text-shadow: 0 0 10px #ff4d4d, 0 0 20px #ff0000; color: #ff4d4d; }
        }

        @keyframes inputGlow {
            0%, 100% { box-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000; }
            50% { box-shadow: 0 0 10px #ff4d4d, 0 0 20px #ff0000, 0 0 30px #b40000; }
        }

        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          font-family: 'Creepster', cursive;
          background: radial-gradient(ellipse at center, #1a1a1a 0%, #000 75%);
          color: #ff0000;
        }

        .container {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at center, #2e0000 0%, #000 75%);
          user-select: none;
          isolation: isolate;
        }

        .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.5"/></svg>');
            background-size: 100px;
            opacity: 0.15;
            animation: grain 0.4s steps(1, end) infinite;
            z-index: 1;
        }

        .form-card {
          position: relative;
          z-index: 2;
          padding: 40px;
          background: rgba(0, 0, 0, 0.6);
          border: 2px solid #ff0000;
          border-radius: 15px;
          backdrop-filter: blur(5px);
          box-shadow: 0 0 20px #ff0000;
          text-align: center;
          width: 90%;
          max-width: 400px;
        }

        h1 {
          font-size: clamp(2rem, 8vw, 3rem);
          margin-bottom: 20px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          animation: textFlicker 3s linear infinite;
        }

        p {
          font-size: 1rem;
          margin-bottom: 30px;
          animation: textFlicker 4s linear infinite;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group.shake {
          animation: shake 0.5s;
        }

        input {
          width: 100%;
          padding: 10px;
          background-color: transparent;
          border: 2px solid #b40000;
          border-radius: 8px;
          color: #ff0000;
          font-size: 1.2rem;
          text-align: center;
          font-family: 'Creepster', cursive;
          transition: all 0.3s ease;
          animation: inputGlow 2.5s infinite ease-in-out;
        }

        input:focus {
          outline: none;
          border-color: #ff4d4d;
          box-shadow: 0 0 15px #ff4d4d;
        }
        
        .button-glow {
          position: relative;
          padding: 10px 20px;
          background: linear-gradient(45deg, #b40000, #ff0000);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-family: 'Creepster', cursive;
          font-size: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000;
        }

        .button-glow:hover {
          background: linear-gradient(45deg, #ff0000, #b40000);
          box-shadow: 0 0 15px #ff4d4d, 0 0 30px #ff0000;
          transform: translateY(-2px);
        }

        .button-glow:active {
            transform: translateY(0);
        }

        .success-message {
            font-size: 1.5rem;
            text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00;
            animation: textFlicker 2s linear infinite;
        }
      `}</style>
      <div className="container">
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
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<SabtName />);