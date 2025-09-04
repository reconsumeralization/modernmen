import React from 'react';
import { Admin } from 'payload/admin';
import ModernMenIcons from './customIcons';

// Custom ModernMen Admin Component
export const CustomAdmin: React.FC = () => {
  return (
    <Admin
      collections={[]} // Collections will be passed from payload config
      globals={[]} // Globals will be passed from payload config
      admin={{
        meta: {
          titleSuffix: '- Modern Men Admin',
          ogImage: '/modernmen-logo-dark.svg',
        },
        // Override the default logo with ModernMen logo
        logo: () => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="32" height="32" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <title>ModernMen Admin Logo</title>
              <defs>
                <style>{`
                  :root {
                    --bg: #000000;
                    --fg: #ffffff;
                  }
                  .ring { fill: none; stroke: var(--fg); stroke-width: 18; }
                `}</style>
                <linearGradient id="shimmerGradLeftDark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--fg)" stopOpacity="0.4">
                    <animate attributeName="stop-opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/>
                  </stop>
                  <stop offset="100%" stopColor="var(--fg)" stopOpacity="0.1">
                    <animate attributeName="stop-opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite"/>
                  </stop>
                </linearGradient>
                <linearGradient id="shimmerGradRightDark" x1="0%" y1="100%" x2="100%" y2="0%">
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
                  <path d="-2 -2H28L48 128L68 -2H98V258H68V98L48 198L28 98V258H-2Z M83 -2H113L133 128L153 -2H183V258H153V98L133 198L113 98V258H83Z" fill="url(#shimmerGradLeftDark)"/>
                  <animateTransform attributeName="transform" type="rotate" from="0 105 130" to="5 105 130" dur="2s" repeatCount="indefinite" additive="sum"/>
                  <animateTransform attributeName="transform" type="rotate" from="5 105 130" to="0 105 130" dur="2s" begin="2s" repeatCount="indefinite" additive="sum"/>
                </g>
                
                <g>
                  <path d="2 2H32L52 132L72 2H102V262H72V102L52 202L32 102V262H2Z M87 2H117L137 132L157 2H187V262H157V102L137 202L117 102V262H87Z" fill="url(#shimmerGradRightDark)"/>
                  <animateTransform attributeName="transform" type="rotate" from="0 105 130" to="-5 105 130" dur="2.5s" repeatCount="indefinite" additive="sum"/>
                  <animateTransform attributeName="transform" type="rotate" from="-5 105 130" to="0 105 130" dur="2.5s" begin="2.5s" repeatCount="indefinite" additive="sum"/>
                </g>
              </g>
            </svg>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>
              ModernMen
            </span>
          </div>
        ),
        // Override the default favicon
        favicon: '/modernmen-logo-dark.svg',
        // Custom CSS to override default Payload styles
        css: `
          /* Override default Payload logo */
          .payload-logo {
            display: none !important;
          }
          
          /* Custom ModernMen branding */
          .modernmen-brand {
            display: flex !important;
            align-items: center;
            gap: 8px;
          }
          
          /* Override collection icons */
          .collection-icon {
            width: 24px;
            height: 24px;
          }
        `,
      }}
    />
  );
};

export default CustomAdmin;
