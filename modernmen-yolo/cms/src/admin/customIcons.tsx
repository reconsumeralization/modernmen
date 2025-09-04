import React from 'react';

// Generic Business Icons
const BusinessIcons = {
  // Collection Icons
  Users: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Users Icon</title>
      <defs>
        <style>{`
          :root {
            --bg: #ffffff;
            --fg: #000000;
            --accent: #1f2937;
          }
          .users-icon { fill: none; stroke: var(--fg); stroke-width: 1.5; }
          .users-bg { fill: var(--accent); }
        `}</style>
      </defs>
      
      <circle cx="12" cy="8" r="4" className="users-bg"/>
      <circle cx="12" cy="8" r="4" className="users-icon"/>
      <circle cx="6" cy="16" r="3" className="users-bg"/>
      <circle cx="6" cy="16" r="3" className="users-icon"/>
      <circle cx="18" cy="16" r="3" className="users-bg"/>
      <circle cx="18" cy="16" r="3" className="users-icon"/>
      
      <g transform="translate(8,8)">
        <path d="M0 0H1L1.5 3L2 0H3V6H2.5V2L1.5 4L0.5 2V6H0Z" fill="var(--bg)"/>
        <path d="M3.5 0H4.5V6H3.5V1.5L4.8 4.5H5.2L6.5 1.5V6H7.5V0H6.5L5 3L3.5 0Z" fill="var(--bg)"/>
      </g>
    </svg>
  ),

  Appointments: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Appointments Icon</title>
      <defs>
        <style>{`
          :root {
            --bg: #ffffff;
            --fg: #000000;
            --accent: #1f2937;
          }
          .appointments-icon { fill: none; stroke: var(--fg); stroke-width: 1.5; }
          .appointments-bg { fill: var(--accent); }
        `}</style>
      </defs>
      
      <rect x="4" y="4" width="16" height="16" rx="2" className="appointments-bg"/>
      <rect x="4" y="4" width="16" height="16" rx="2" className="appointments-icon"/>
      <rect x="4" y="4" width="16" height="4" className="appointments-bg"/>
      <line x1="8" y1="12" x2="10" y2="12" className="appointments-icon"/>
      <line x1="12" y1="12" x2="14" y2="12" className="appointments-icon"/>
      <line x1="16" y1="12" x2="18" y2="12" className="appointments-icon"/>
      <line x1="8" y1="16" x2="10" y2="16" className="appointments-icon"/>
      <line x1="12" y1="16" x2="14" y2="16" className="appointments-icon"/>
      
      <g transform="translate(8,8)">
        <path d="M0 0H1L1.5 3L2 0H3V6H2.5V2L1.5 4L0.5 2V6H0Z" fill="var(--bg)"/>
        <path d="M3.5 0H4.5V6H3.5V1.5L4.8 4.5H5.2L6.5 1.5V6H7.5V0H6.5L5 3L3.5 0Z" fill="var(--bg)"/>
      </g>
    </svg>
  ),

  Services: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Services Icon</title>
      <defs>
        <style>{`
          :root {
            --bg: #ffffff;
            --fg: #000000;
            --accent: #1f2937;
          }
          .services-icon { fill: none; stroke: var(--fg); stroke-width: 1.5; }
          .services-bg { fill: var(--accent); }
        `}</style>
      </defs>
      
      <circle cx="12" cy="12" r="8" className="services-bg"/>
      <circle cx="12" cy="12" r="8" className="services-icon"/>
      <path d="M6 6L18 18" className="services-icon"/>
      <path d="M18 6L6 18" className="services-icon"/>
      <circle cx="6" cy="6" r="2" className="services-icon"/>
      <circle cx="18" cy="6" r="2" className="services-icon"/>
      <circle cx="6" cy="18" r="2" className="services-icon"/>
      <circle cx="18" cy="18" r="2" className="services-icon"/>
      
      <g transform="translate(8,8)">
        <path d="M0 0H1L1.5 3L2 0H3V6H2.5V2L1.5 4L0.5 2V6H0Z" fill="var(--bg)"/>
        <path d="M3.5 0H4.5V6H3.5V1.5L4.8 4.5H5.2L6.5 1.5V6H7.5V0H6.5L5 3L3.5 0Z" fill="var(--bg)"/>
      </g>
    </svg>
  ),

  Customers: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Customers Icon</title>
      <defs>
        <style>{`
          :root {
            --bg: #ffffff;
            --fg: #000000;
            --accent: #1f2937;
          }
          .customers-icon { fill: none; stroke: var(--fg); stroke-width: 1.5; }
          .customers-bg { fill: var(--accent); }
        `}</style>
      </defs>
      
      <circle cx="12" cy="8" r="4" className="customers-bg"/>
      <circle cx="12" cy="8" r="4" className="customers-icon"/>
      <path d="M4 20C4 16.686 7.582 14 12 14C16.418 14 20 16.686 20 20" className="customers-bg"/>
      <path d="M4 20C4 16.686 7.582 14 12 14C16.418 14 20 16.686 20 20" className="customers-icon"/>
      <circle cx="12" cy="8" r="3" className="customers-icon"/>
      
      <g transform="translate(8,8)">
        <path d="M0 0H1L1.5 3L2 0H3V6H2.5V2L1.5 4L0.5 2V6H0Z" fill="var(--bg)"/>
        <path d="M3.5 0H4.5V6H3.5V1.5L4.8 4.5H5.2L6.5 1.5V6H7.5V0H6.5L5 3L3.5 0Z" fill="var(--bg)"/>
      </g>
    </svg>
  ),

  Staff: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Staff Icon</title>
      <defs>
        <style>{`
          :root {
            --bg: #ffffff;
            --fg: #000000;
            --accent: #1f2937;
          }
          .staff-icon { fill: none; stroke: var(--fg); stroke-width: 1.5; }
          .staff-bg { fill: var(--accent); }
        `}</style>
      </defs>
      
      <path d="M12 2L20 6V12C20 16.418 16.418 20 12 20C7.582 20 4 16.418 4 12V6L12 2Z" className="staff-bg"/>
      <path d="M12 2L20 6V12C20 16.418 16.418 20 12 20C7.582 20 4 16.418 4 12V6L12 2Z" className="staff-icon"/>
      
      <g transform="translate(9,4)">
        <path d="M0 2L1 0L2 1L3 0L4 1L5 0L6 2H0Z" fill="var(--bg)"/>
        <circle cx="1" cy="0.5" r="0.3" fill="var(--accent)"/>
        <circle cx="3" cy="0.5" r="0.3" fill="var(--accent)"/>
        <circle cx="5" cy="0.5" r="0.3" fill="var(--accent)"/>
      </g>
      
      <g transform="translate(8,8)">
        <path d="M0 0H1L1.5 3L2 0H3V6H2.5V2L1.5 4L0.5 2V6H0Z" fill="var(--bg)"/>
        <path d="M3.5 0H4.5V6H3.5V1.5L4.8 4.5H5.2L6.5 1.5V6H7.5V0H6.5L5 3L3.5 0Z" fill="var(--bg)"/>
      </g>
    </svg>
  ),

  Notifications: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Notifications Icon</title>
      <defs>
        <style>{`
          :root {
            --bg: #ffffff;
            --fg: #000000;
            --accent: #1f2937;
          }
          .notifications-icon { fill: none; stroke: var(--fg); stroke-width: 1.5; }
          .notifications-bg { fill: var(--accent); }
        `}</style>
      </defs>
      
      <path d="M6 8C6 4.686 8.686 2 12 2C15.314 2 18 4.686 18 8C18 12 20 14 20 14H4C4 14 6 12 6 8Z" className="notifications-bg"/>
      <path d="M6 8C6 4.686 8.686 2 12 2C15.314 2 18 4.686 18 8C18 12 20 14 20 14H4C4 14 6 12 6 8Z" className="notifications-icon"/>
      <path d="M9 14C9 15.657 10.343 17 12 17C13.657 17 15 15.657 15 14" className="notifications-icon"/>
      <circle cx="18" cy="6" r="2" fill="#ef4444"/>
      
      <g transform="translate(8,8)">
        <path d="M0 0H1L1.5 3L2 0H3V6H2.5V2L1.5 4L0.5 2V6H0Z" fill="var(--bg)"/>
        <path d="M3.5 0H4.5V6H3.5V1.5L4.8 4.5H5.2L6.5 1.5V6H7.5V0H6.5L5 3L3.5 0Z" fill="var(--bg)"/>
      </g>
    </svg>
  ),

  Settings: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Settings Icon</title>
      <defs>
        <style>{`
          :root {
            --bg: #ffffff;
            --fg: #000000;
            --accent: #1f2937;
          }
          .settings-icon { fill: none; stroke: var(--fg); stroke-width: 1.5; }
          .settings-bg { fill: var(--accent); }
        `}</style>
      </defs>
      
      <circle cx="12" cy="12" r="8" className="settings-bg"/>
      <circle cx="12" cy="12" r="8" className="settings-icon"/>
      <path d="M12 2V4" className="settings-icon"/>
      <path d="M12 20V22" className="settings-icon"/>
      <path d="M2 12H4" className="settings-icon"/>
      <path d="M20 12H22" className="settings-icon"/>
      <path d="M4.93 4.93L6.34 6.34" className="settings-icon"/>
      <path d="M17.66 17.66L19.07 19.07" className="settings-icon"/>
      <path d="M4.93 19.07L6.34 17.66" className="settings-icon"/>
      <path d="M17.66 6.34L19.07 4.93" className="settings-icon"/>
      <circle cx="12" cy="12" r="3" className="settings-icon"/>
      
      <g transform="translate(8,8)">
        <path d="M0 0H1L1.5 3L2 0H3V6H2.5V2L1.5 4L0.5 2V6H0Z" fill="var(--bg)"/>
        <path d="M3.5 0H4.5V6H3.5V1.5L4.8 4.5H5.2L6.5 1.5V6H7.5V0H6.5L5 3L3.5 0Z" fill="var(--bg)"/>
      </g>
    </svg>
  ),

  Barbers: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Barbers Icon</title>
      <defs>
        <style>{`
          :root {
            --bg: #ffffff;
            --fg: #000000;
            --accent: #1f2937;
          }
          .barbers-icon { fill: none; stroke: var(--fg); stroke-width: 1.5; }
          .barbers-bg { fill: var(--accent); }
        `}</style>
      </defs>
      
      <rect x="8" y="2" width="8" height="20" rx="4" className="barbers-bg"/>
      <rect x="8" y="2" width="8" height="20" rx="4" className="barbers-icon"/>
      <rect x="8" y="2" width="8" height="4" fill="#ef4444"/>
      <rect x="8" y="6" width="8" height="4" fill="#ffffff"/>
      <rect x="8" y="10" width="8" height="4" fill="#3b82f6"/>
      <rect x="8" y="14" width="8" height="4" fill="#ffffff"/>
      <rect x="8" y="18" width="8" height="4" fill="#ef4444"/>
      <path d="M6 6L18 18" className="barbers-icon" strokeWidth="2"/>
      <path d="M18 6L6 18" className="barbers-icon" strokeWidth="2"/>
      
      <g transform="translate(8,8)">
        <path d="M0 0H1L1.5 3L2 0H3V6H2.5V2L1.5 4L0.5 2V6H0Z" fill="var(--bg)"/>
        <path d="M3.5 0H4.5V6H3.5V1.5L4.8 4.5H5.2L6.5 1.5V6H7.5V0H6.5L5 3L3.5 0Z" fill="var(--bg)"/>
      </g>
    </svg>
  ),

  Gallery: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Gallery Icon</title>
      <defs>
        <style>{`
          :root {
            --bg: #ffffff;
            --fg: #000000;
            --accent: #1f2937;
          }
          .gallery-icon { fill: none; stroke: var(--fg); stroke-width: 1.5; }
          .gallery-bg { fill: var(--accent); }
        `}</style>
      </defs>
      
      <rect x="2" y="2" width="20" height="20" rx="2" className="gallery-bg"/>
      <rect x="2" y="2" width="20" height="20" rx="2" className="gallery-icon"/>
      <rect x="4" y="4" width="6" height="6" fill="#e5e7eb"/>
      <rect x="4" y="4" width="6" height="6" className="gallery-icon"/>
      <rect x="12" y="4" width="6" height="6" fill="#e5e7eb"/>
      <rect x="12" y="4" width="6" height="6" className="gallery-icon"/>
      <rect x="4" y="12" width="6" height="6" fill="#e5e7eb"/>
      <rect x="4" y="12" width="6" height="6" className="gallery-icon"/>
      <rect x="12" y="12" width="6" height="6" fill="#e5e7eb"/>
      <rect x="12" y="12" width="6" height="6" className="gallery-icon"/>
      <circle cx="7" cy="7" r="1" fill="#9ca3af"/>
      <circle cx="15" cy="7" r="1" fill="#9ca3af"/>
      <circle cx="7" cy="15" r="1" fill="#9ca3af"/>
      <circle cx="15" cy="15" r="1" fill="#9ca3af"/>
      
      <g transform="translate(8,8)">
        <path d="M0 0H1L1.5 3L2 0H3V6H2.5V2L1.5 4L0.5 2V6H0Z" fill="var(--bg)"/>
        <path d="M3.5 0H4.5V6H3.5V1.5L4.8 4.5H5.2L6.5 1.5V6H7.5V0H6.5L5 3L3.5 0Z" fill="var(--bg)"/>
      </g>
    </svg>
  ),

  Reviews: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Reviews Icon</title>
      <defs>
        <style>{`
          :root {
            --bg: #ffffff;
            --fg: #000000;
            --accent: #1f2937;
          }
          .reviews-icon { fill: none; stroke: var(--fg); stroke-width: 1.5; }
          .reviews-bg { fill: var(--accent); }
        `}</style>
      </defs>
      
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" className="reviews-bg"/>
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" className="reviews-icon"/>
      <circle cx="12" cy="12" r="2" className="reviews-icon"/>
      
      <g transform="translate(8,8)">
        <path d="M0 0H1L1.5 3L2 0H3V6H2.5V2L1.5 4L0.5 2V6H0Z" fill="var(--bg)"/>
        <path d="M3.5 0H4.5V6H3.5V1.5L4.8 4.5H5.2L6.5 1.5V6H7.5V0H6.5L5 3L3.5 0Z" fill="var(--bg)"/>
      </g>
    </svg>
  ),

  Media: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Media Icon</title>
      <defs>
        <style>{`
          :root {
            --bg: #ffffff;
            --fg: #000000;
            --accent: #1f2937;
          }
          .media-icon { fill: none; stroke: var(--fg); stroke-width: 1.5; }
          .media-bg { fill: var(--accent); }
        `}</style>
      </defs>
      
      <rect x="4" y="6" width="16" height="12" rx="2" className="media-bg"/>
      <rect x="4" y="6" width="16" height="12" rx="2" className="media-icon"/>
      <circle cx="12" cy="12" r="3" className="media-icon"/>
      <circle cx="12" cy="12" r="1.5" className="media-icon"/>
      <rect x="18" y="8" width="2" height="2" className="media-icon"/>
      
      <g transform="translate(8,8)">
        <path d="M0 0H1L1.5 3L2 0H3V6H2.5V2L1.5 4L0.5 2V6H0Z" fill="var(--bg)"/>
        <path d="M3.5 0H4.5V6H3.5V1.5L4.8 4.5H5.2L6.5 1.5V6H7.5V0H6.5L5 3L3.5 0Z" fill="var(--bg)"/>
      </g>
    </svg>
  ),
};

export default BusinessIcons;
