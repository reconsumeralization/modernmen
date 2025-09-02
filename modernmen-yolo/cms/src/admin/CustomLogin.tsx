import React from 'react';
import { Login } from 'payload/components/Login';

// Custom ModernMen Login Component
export const CustomLogin: React.FC = () => {
  return (
    <div className="custom-login-container">
      <style>{`
        .custom-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
        }
        
        .login-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          padding: 2rem;
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        
        .modernmen-logo {
          margin-bottom: 2rem;
        }
        
        .login-form {
          text-align: left;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .login-button {
          width: 100%;
          background: #1f2937;
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .login-button:hover {
          background: #111827;
        }
      `}</style>
      
      <div className="login-card">
        <div className="modernmen-logo">
          <svg width="120" height="120" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <title>ModernMen Login Logo</title>
            <defs>
              <style>
                :root {
                  --bg: #1f2937;
                  --fg: #ffffff;
                }
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
            <circle cx="250" cy="250" r="230" className="ring"/>
            
            {/* MN monogram group */}
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
          
          <h1 style={{ 
            marginTop: '1rem', 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            ModernMen
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Professional Grooming Admin
          </p>
        </div>
        
        <Login />
      </div>
    </div>
  );
};

export default CustomLogin;
