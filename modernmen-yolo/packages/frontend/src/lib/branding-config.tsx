/**
 * ModernMen Barbershop - Custom Branding Configuration
 * Replaces all Payload CMS branding with ModernMen branding
 */

'use client'

import Image from 'next/image'

export const MODERNMEN_BRANDING = {
  // Basic brand information
  name: 'ModernMen Barbershop',
  tagline: 'Where Tradition Meets Modern Style',
  description: 'Premium barbershop services for the modern gentleman',

  // Logo and visual assets
  logo: {
    primary: '/images/logo/modernmen-logo.svg',
    white: '/images/logo/modernmen-logo-white.svg',
    icon: '/images/logo/modernmen-icon.svg',
    favicon: '/favicon.ico'
  },

  // Video assets
  videos: {
    hero: '/videos/modernmen-hero.mp4',
    intro: '/videos/modernmen-intro.mp4',
    services: '/videos/modernmen-services.mp4',
    testimonials: '/videos/modernmen-testimonials.mp4'
  },

  // Color scheme
  colors: {
    primary: '#1a1a1a',        // Deep black
    secondary: '#d4af37',      // Gold accent
    accent: '#8b7355',         // Bronze
    background: '#ffffff',      // Clean white
    surface: '#f8f9fa',        // Light gray
    text: '#333333',           // Dark gray
    muted: '#6c757d',          // Muted gray
    success: '#28a745',        // Green
    warning: '#ffc107',        // Yellow
    error: '#dc3545',          // Red
    info: '#17a2b8'            // Blue
  },

  // Typography
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    heading: 'Playfair Display, serif',
    mono: 'JetBrains Mono, monospace'
  },

  // Admin panel customization
  admin: {
    title: 'ModernMen Admin',
    meta: {
      titleSuffix: '- ModernMen Admin Dashboard',
      description: 'Administrative dashboard for ModernMen Barbershop',
      ogImage: '/images/og/modernmen-admin.png'
    },
    favicon: '/favicon.ico',
    brandLogo: '/images/logo/modernmen-admin-logo.svg'
  },

  // Social media and contact
  contact: {
    phone: '+1 (555) 123-CUTS',
    email: 'hello@modernmenbarbershop.com',
    address: '123 Main Street, Your City, ST 12345',
    website: 'https://modernmenbarbershop.com'
  },

  social: {
    instagram: '@modernmenbarbershop',
    facebook: 'ModernMenBarbershop',
    twitter: '@modernmencuts',
    linkedin: 'company/modernmen-barbershop',
    youtube: '@ModernMenBarbershop'
  },

  // Custom styles for admin interface
  adminStyles: `
    /* ModernMen Admin Branding */
    :root {
      --payload-color-base-0: #ffffff;
      --payload-color-base-50: #f8f9fa;
      --payload-color-base-100: #e9ecef;
      --payload-color-base-200: #dee2e6;
      --payload-color-base-300: #ced4da;
      --payload-color-base-400: #adb5bd;
      --payload-color-base-500: #6c757d;
      --payload-color-base-600: #495057;
      --payload-color-base-700: #343a40;
      --payload-color-base-800: #1a1a1a;
      --payload-color-base-900: #000000;
      
      --payload-color-brand: #d4af37;
      --payload-color-brand-light: #e8c547;
      --payload-color-brand-dark: #b8941f;
    }

    /* Header customization */
    .payload-admin__header {
      background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
      border-bottom: 2px solid #d4af37;
    }

    /* Logo replacement */
    .payload-admin__nav-brand img,
    .payload-admin__nav-brand svg {
      content: url('/images/logo/modernmen-admin-logo.svg');
      max-height: 40px;
      width: auto;
    }

    /* Navigation styling */
    .payload-admin__nav {
      background: #1a1a1a;
    }

    .payload-admin__nav-item {
      border-bottom: 1px solid rgba(212, 175, 55, 0.1);
    }

    .payload-admin__nav-item:hover {
      background: rgba(212, 175, 55, 0.1);
    }

    .payload-admin__nav-item.active {
      background: rgba(212, 175, 55, 0.2);
      border-left: 3px solid #d4af37;
    }

    /* Button styling */
    .btn.btn--style-primary {
      background: #d4af37;
      border-color: #d4af37;
    }

    .btn.btn--style-primary:hover {
      background: #b8941f;
      border-color: #b8941f;
    }

    /* Form elements */
    .field-type__text input:focus,
    .field-type__textarea textarea:focus,
    .field-type__select select:focus {
      border-color: #d4af37;
      box-shadow: 0 0 0 0.2rem rgba(212, 175, 55, 0.25);
    }

    /* Table styling */
    .table thead th {
      background: #1a1a1a;
      color: #ffffff;
      border-color: #d4af37;
    }

    /* Status indicators */
    .status-indicator.status-indicator--published {
      background: #d4af37;
    }

    /* Custom dashboard widgets */
    .dashboard-stats {
      background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
      color: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .dashboard-stats h3 {
      color: #d4af37;
      margin-bottom: 10px;
    }

    /* Loading states */
    .payload-loader {
      border-top-color: #d4af37;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    ::-webkit-scrollbar-thumb {
      background: #d4af37;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #b8941f;
    }
  `,

  // Custom JavaScript for additional branding
  adminScripts: `
    // Remove Payload branding and add ModernMen branding
    document.addEventListener('DOMContentLoaded', function() {
      // Replace any Payload text with ModernMen
      const replacePayloadText = () => {
        const elementsToReplace = document.querySelectorAll('*');
        elementsToReplace.forEach(el => {
          if (el.textContent && el.textContent.includes('Payload')) {
            el.textContent = el.textContent.replace(/Payload/g, 'ModernMen');
          }
        });
      };

      // Initial replacement
      replacePayloadText();

      // Watch for dynamic content changes
      const observer = new MutationObserver(replacePayloadText);
      observer.observe(document.body, { childList: true, subtree: true });

      // Add custom branding elements
      const addCustomBranding = () => {
        const header = document.querySelector('.payload-admin__header');
        if (header && !header.querySelector('.modernmen-badge')) {
          const badge = document.createElement('div');
          badge.className = 'modernmen-badge';
          const smallElement = document.createElement('small');
          smallElement.style.color = '#d4af37';
          smallElement.style.fontWeight = '500';
          smallElement.textContent = 'ModernMen Admin Dashboard';
          badge.appendChild(smallElement);
          header.appendChild(badge);
        }
      };

      addCustomBranding();
    });
  `
}

// CSS variables for consistent theming
export const CSS_VARIABLES = `
  :root {
    --modernmen-primary: ${MODERNMEN_BRANDING.colors.primary};
    --modernmen-secondary: ${MODERNMEN_BRANDING.colors.secondary};
    --modernmen-accent: ${MODERNMEN_BRANDING.colors.accent};
    --modernmen-background: ${MODERNMEN_BRANDING.colors.background};
    --modernmen-surface: ${MODERNMEN_BRANDING.colors.surface};
    --modernmen-text: ${MODERNMEN_BRANDING.colors.text};
    --modernmen-muted: ${MODERNMEN_BRANDING.colors.muted};
    --modernmen-success: ${MODERNMEN_BRANDING.colors.success};
    --modernmen-warning: ${MODERNMEN_BRANDING.colors.warning};
    --modernmen-error: ${MODERNMEN_BRANDING.colors.error};
    --modernmen-info: ${MODERNMEN_BRANDING.colors.info};
    
    --modernmen-font-primary: ${MODERNMEN_BRANDING.fonts.primary};
    --modernmen-font-heading: ${MODERNMEN_BRANDING.fonts.heading};
    --modernmen-font-mono: ${MODERNMEN_BRANDING.fonts.mono};
  }
`

// Component for logo display
export const ModernMenLogo = ({
  variant = 'primary',
  size = 'medium',
  className = ''
}: {
  variant?: 'primary' | 'white' | 'icon'
  size?: 'small' | 'medium' | 'large'
  className?: string
}) => {
  const sizes = {
    small: { height: 32, width: 32 },
    medium: { height: 48, width: 48 },
    large: { height: 64, width: 64 }
  }

  const sizeClasses = {
    small: 'h-8',
    medium: 'h-12',
    large: 'h-16'
  }

  const logoSrc = MODERNMEN_BRANDING.logo[variant]

  // For client-side rendering, use regular img tag to avoid hydration issues
  if (typeof window === 'undefined') {
    return (
      <div
        className={`${sizeClasses[size]} w-auto bg-gray-200 animate-pulse rounded ${className}`}
      />
    )
  }

  return (
    <Image
      src={logoSrc}
      alt={MODERNMEN_BRANDING.name}
      width={200}
      height={60}
      className={`${sizeClasses[size]} w-auto ${className}`}
      priority={size === 'large'}
    />
  )
}

// Component for video backgrounds
export const ModernMenVideo = ({ 
  type = 'hero',
  autoplay = true,
  muted = true,
  loop = true,
  className = ''
}: {
  type?: keyof typeof MODERNMEN_BRANDING.videos
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  className?: string
}) => {
  return (
    <video
      src={MODERNMEN_BRANDING.videos[type]}
      autoPlay={autoplay}
      muted={muted}
      loop={loop}
      playsInline
      className={`w-full h-full object-cover ${className}`}
      poster="/images/video-poster.jpg"
    >
      <source src={MODERNMEN_BRANDING.videos[type]} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}

// Utility function to inject custom styles
export const injectModernMenStyles = () => {
  if (typeof document !== 'undefined') {
    // Inject CSS variables
    const styleElement = document.createElement('style')
    styleElement.textContent = CSS_VARIABLES + MODERNMEN_BRANDING.adminStyles
    document.head.appendChild(styleElement)

    // Inject custom scripts
    const scriptElement = document.createElement('script')
    scriptElement.textContent = MODERNMEN_BRANDING.adminScripts
    document.body.appendChild(scriptElement)
  }
}

// Export default branding object
export default MODERNMEN_BRANDING