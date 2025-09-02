import React, { useState, useEffect } from 'react';
import { Login } from 'payload/components/Login';
import ElementalVideoBackground from './ElementalVideoBackground';

// Enhanced ModernMen Login with Elemental Videos
export const ElementalLogin: React.FC = () => {
  const [currentElement, setCurrentElement] = useState<'fire' | 'water' | 'wind' | 'lightning'>('fire');
  const [isLoading, setIsLoading] = useState(false);

  // Rotate through elements every 8 seconds
  useEffect(() => {
    const elements: Array<'fire' | 'water' | 'wind' | 'lightning'> = ['fire', 'water', 'wind', 'lightning'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % elements.length;
      setCurrentElement(elements[currentIndex]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Element-specific content
  const elementContent = {
    fire: {
      title: 'Ignite Your Style',
      subtitle: 'Transform with ModernMen',
      color: '#FF4500',
      icon: '🔥'
    },
    water: {
      title: 'Flow with Confidence',
      subtitle: 'Smooth, Professional Cuts',
      color: '#00BFFF',
      icon: '💧'
    },
    wind: {
      title: 'Fresh & Dynamic',
      subtitle: 'Innovative Hair Solutions',
      color: '#B0C4DE',
      icon: '💨'
    },
    lightning: {
      title: 'Electrifying Results',
      subtitle: 'Lightning-Fast Service',
      color: '#FFFF00',
      icon: '⚡'
    }
  };

  const currentContent = elementContent[currentElement];

  return (
    <div className="elemental-login-container">
      <style jsx>{`
        .elemental-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        
        .video-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        .login-overlay {
          position: relative;
          z-index: 10;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
        }
        
        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          padding: 3rem;
          width: 100%;
          max-width: 450px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideInUp 0.6s ease-out;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .element-header {
          margin-bottom: 2rem;
          transition: all 0.5s ease;
        }
        
        .element-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .element-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, ${currentContent.color}, #1f2937);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.5s ease;
        }
        
        .element-subtitle {
          font-size: 1.1rem;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 2rem;
        }
        
        .modernmen-logo {
          margin-bottom: 2rem;
          opacity: 0.9;
        }
        
        .login-form {
          text-align: left;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .form-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.8);
        }
        
        .form-input:focus {
          outline: none;
          border-color: ${currentContent.color};
          box-shadow: 0 0 0 4px rgba(255, 69, 0, 0.1);
          background: rgba(255, 255, 255, 1);
        }
        
        .login-button {
          width: 100%;
          background: linear-gradient(135deg, ${currentContent.color}, #1f2937);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          position: relative;
          overflow: hidden;
        }
        
        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .login-button:active {
          transform: translateY(0);
        }
        
        .login-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .login-button:hover::before {
          left: 100%;
        }
        
        .element-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          z-index: 20;
        }
        
        .element-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .element-dot.active {
          background: ${currentContent.color};
          transform: scale(1.2);
        }
        
        .element-dot:hover {
          background: ${currentContent.color};
          transform: scale(1.1);
        }
        
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: 0.5rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Elemental Video Background */}
      <div className="video-background">
        <ElementalVideoBackground
          element={currentElement}
          loop={true}
          autoplay={true}
          muted={true}
          opacity={0.6}
        />
      </div>

      {/* Login Overlay */}
      <div className="login-overlay">
        <div className="login-card">
          {/* Element Header */}
          <div className="element-header">
            <span className="element-icon">{currentContent.icon}</span>
            <h1 className="element-title">{currentContent.title}</h1>
            <p className="element-subtitle">{currentContent.subtitle}</p>
          </div>

          {/* ModernMen Logo */}
          <div className="modernmen-logo">
            <svg width="80" height="80" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <title>ModernMen Logo</title>
              <defs>
                <style>
                  :root { --bg: #1f2937; --fg: #ffffff; }
                  .ring { fill: none; stroke: var(--fg); stroke-width: 18; }
                </style>
                <linearGradient id="shimmerGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--fg)" stopOpacity="0.4">
                    <animate attributeName="stop-opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/>
                  </stop>
                  <stop offset="100%" stopColor="var(--fg)" stopOpacity="0.1">
                    <animate attributeName="stop-opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite"/>
                  </stop>
                </linearGradient>
                <linearGradient id="shimmerGradRight" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--fg)" stopOpacity="0.4">
                    <animate attributeName="stop-opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite"/>
                  </stop>
                  <stop offset="100%" stopColor="var(--fg)" stopOpacity="0">
                    <animate attributeName="stop-opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/>
                  </stop>
                </linearGradient>
              </defs>
              <rect width="500" height="500" fill="var(--bg)"/>
              <circle cx="250" cy="250" r="230" class="ring"/>
              <g transform="translate(150,110)">
                <path d="M0 0H30L50 130L70 0H100V260H70V100L50 200L30 100V260H0Z M85 0H115L135 130L155 0H185V260H155V100L135 200L115 100V260H85Z" fill="var(--fg)"/>
                <g>
                  <path d="-2 -2H28L48 128L68 -2H98V258H68V98L48 198L28 98V258H-2Z M83 -2H113L133 128L153 -2H183V258H153V98L133 198L113 98V258H83Z" fill="url(#shimmerGradLeft)"/>
                  <animateTransform attributeName="transform" type="rotate" from="0 105 130" to="5 105 130" dur="2s" repeatCount="indefinite" additive="sum"/>
                  <animateTransform attributeName="transform" type="rotate" from="5 105 130" to="0 105 130" dur="2s" begin="2s" repeatCount="indefinite" additive="sum"/>
                </g>
                <g>
                  <path d="2 2H32L52 132L72 2H102V262H72V102L52 202L32 102V262H2Z M87 2H117L137 132L157 2H187V262H157V102L137 202L117 102V262H87Z" fill="url(#shimmerGradRight)"/>
                  <animateTransform attributeName="transform" type="rotate" from="0 105 130" to="-5 105 130" dur="2.5s" repeatCount="indefinite" additive="sum"/>
                  <animateTransform attributeName="transform" type="rotate" from="-5 105 130" to="0 105 130" dur="2.5s" begin="2.5s" repeatCount="indefinite" additive="sum"/>
                </g>
              </g>
            </svg>
          </div>

          {/* Login Form */}
          <div className="login-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
            
            <button 
              className="login-button"
              onClick={() => setIsLoading(true)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing In...
                </>
              ) : (
                'Sign In to ModernMen'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Element Indicator Dots */}
      <div className="element-indicator">
        {(['fire', 'water', 'wind', 'lightning'] as const).map((element) => (
          <div
            key={element}
            className={`element-dot ${element === currentElement ? 'active' : ''}`}
            onClick={() => setCurrentElement(element)}
            title={`Switch to ${element} theme`}
          />
        ))}
      </div>
    </div>
  );
};

export default ElementalLogin;
