import React, { useEffect } from 'react';
import { Admin } from 'payload/admin';

// Custom ModernMen Admin Wrapper
export const CustomAdminWrapper: React.FC<{ collections: any[]; globals: any[] }> = ({ 
  collections, 
  globals 
}) => {
  useEffect(() => {
    // Inject custom CSS to override default Payload styles
    const customCSS = `
      /* ModernMen Admin Custom Styles */
      
      /* Override default Payload logo on login page */
      body div[class*="login"] svg[class*="graphic-logo"],
      body div[class*="login"] svg[viewBox="0 0 180 50"],
      body div[class*="login"] svg[width="180"][height="50"] {
        display: none !important;
      }
      
      /* Replace with ModernMen logo */
      body div[class*="login"] div[class*="logo"]::before {
        content: '';
        display: block;
        width: 120px;
        height: 120px;
        margin: 0 auto 1rem;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500"><title>ModernMen Login Logo</title><defs><style>:root { --bg: %231f2937; --fg: %23ffffff; } .ring { fill: none; stroke: var(--fg); stroke-width: 18; }</style><linearGradient id="shimmerGradLeft" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--fg)" stop-opacity="0.4"><animate attributeName="stop-opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/></stop><stop offset="100%" stop-color="var(--fg)" stop-opacity="0.1"><animate attributeName="stop-opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite"/></stop></linearGradient><linearGradient id="shimmerGradRight" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="var(--fg)" stop-opacity="0.4"><animate attributeName="stop-opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite"/></stop><stop offset="100%" stop-color="var(--fg)" stop-opacity="0"><animate attributeName="stop-opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/></stop></linearGradient></defs><rect width="500" height="500" fill="var(--bg)"/><circle cx="250" cy="250" r="230" class="ring"/><g transform="translate(150,110)"><path d="M0 0H30L50 130L70 0H100V260H70V100L50 200L30 100V260H0Z M85 0H115L135 130L155 0H185V260H155V100L135 200L115 100V260H85Z" fill="var(--fg)"/><g><path d="-2 -2H28L48 128L68 -2H98V258H68V98L48 198L28 98V258H-2Z M83 -2H113L133 128L153 -2H183V258H153V98L133 198L113 98V258H83Z" fill="url(%23shimmerGradLeft)"/><animateTransform attributeName="transform" type="rotate" from="0 105 130" to="5 105 130" dur="2s" repeatCount="indefinite" additive="sum"/><animateTransform attributeName="transform" type="rotate" from="5 105 130" to="0 105 130" dur="2s" begin="2s" repeatCount="indefinite" additive="sum"/></g><g><path d="2 2H32L52 132L72 2H102V262H72V102L52 202L32 102V262H2Z M87 2H117L137 132L157 2H187V262H157V102L137 202L117 102V262H87Z" fill="url(%23shimmerGradRight)"/><animateTransform attributeName="transform" type="rotate" from="0 105 130" to="-5 105 130" dur="2.5s" repeatCount="indefinite" additive="sum"/><animateTransform attributeName="transform" type="rotate" from="-5 105 130" to="0 105 130" dur="2.5s" begin="2.5s" repeatCount="indefinite" additive="sum"/></g></g></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
      
      /* Override default Payload logo in admin header */
      body header svg[class*="graphic-logo"],
      body header svg[viewBox="0 0 180 50"],
      body header svg[width="180"][height="50"] {
        display: none !important;
      }
      
      /* Replace header logo with ModernMen logo */
      body header div[class*="logo"]::before {
        content: '';
        display: block;
        width: 32px;
        height: 32px;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500"><title>ModernMen Admin Logo</title><defs><style>:root { --bg: %23000000; --fg: %23ffffff; } .ring { fill: none; stroke: var(--fg); stroke-width: 18; }</style><linearGradient id="shimmerGradLeftDark" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--fg)" stop-opacity="0.4"><animate attributeName="stop-opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/></stop><stop offset="100%" stop-color="var(--fg)" stop-opacity="0.1"><animate attributeName="stop-opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite"/></stop></linearGradient><linearGradient id="shimmerGradRightDark" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="var(--fg)" stop-opacity="0.4"><animate attributeName="stop-opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite"/></stop><stop offset="100%" stop-color="var(--fg)" stop-opacity="0"><animate attributeName="stop-opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/></stop></linearGradient></defs><rect width="500" height="500" fill="var(--bg)"/><circle cx="250" cy="250" r="230" class="ring"/><g transform="translate(150,110)"><path d="M0 0H30L50 130L70 0H100V260H70V100L50 200L30 100V260H0Z M85 0H115L135 130L155 0H185V260H155V100L135 200L115 100V260H85Z" fill="var(--fg)"/><g><path d="-2 -2H28L48 128L68 -2H98V258H68V98L48 198L28 98V258H-2Z M83 -2H113L133 128L153 -2H183V258H153V98L133 198L113 98V258H83Z" fill="url(%23shimmerGradLeftDark)"/><animateTransform attributeName="transform" type="rotate" from="0 105 130" to="5 105 130" dur="2s" repeatCount="indefinite" additive="sum"/><animateTransform attributeName="transform" type="rotate" from="5 105 130" to="0 105 130" dur="2s" begin="2s" repeatCount="indefinite" additive="sum"/></g><g><path d="2 2H32L52 132L72 2H102V262H72V102L52 202L32 102V262H2Z M87 2H117L137 132L157 2H187V262H157V102L137 202L117 102V262H87Z" fill="url(%23shimmerGradRightDark)"/><animateTransform attributeName="transform" type="rotate" from="0 105 130" to="-5 105 130" dur="2.5s" repeatCount="indefinite" additive="sum"/><animateTransform attributeName="transform" type="rotate" from="-5 105 130" to="0 105 130" dur="2.5s" begin="2.5s" repeatCount="indefinite" additive="sum"/></g></g></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
      
      /* Override any other default Payload logos */
      svg[class*="graphic-logo"],
      svg[viewBox="0 0 180 50"],
      svg[width="180"][height="50"] {
        display: none !important;
      }
      
      /* Add ModernMen branding text */
      body header div[class*="logo"]::after {
        content: 'ModernMen';
        display: inline-block;
        margin-left: 8px;
        font-size: 18px;
        font-weight: bold;
        color: #ffffff;
      }
      
      /* Custom collection icons */
      .collection-icon {
        width: 24px;
        height: 24px;
      }
      
      /* Override favicon */
      link[rel="icon"],
      link[rel="shortcut icon"] {
        href: '/modernmen-logo-dark.svg' !important;
      }
    `;

    // Create and inject the style element
    const styleElement = document.createElement('style');
    styleElement.textContent = customCSS;
    document.head.appendChild(styleElement);

    // Cleanup function
    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);

  return (
    <Admin
      collections={collections}
      globals={globals}
      admin={{
        meta: {
          titleSuffix: '- Modern Men Admin',
          ogImage: '/modernmen-logo-dark.svg',
          favicon: '/modernmen-logo-dark.svg',
        },
        // Override the default logo with ModernMen logo
        logo: () => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="32" height="32" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <title>ModernMen Admin Logo</title>
              <defs>
                <style>
                  :root {
                    --bg: #000000;
                    --fg: #ffffff;
                  }
                  .ring { fill: none; stroke: var(--fg); stroke-width: 18; }
                </style>
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
      }}
    />
  );
};

export default CustomAdminWrapper;
