import React, { useState, useEffect } from 'react';
import ElementalVideoBackground from './ElementalVideoBackground';

export interface ElementalAdminHeaderProps {
  /** The current section/collection being viewed */
  section: 'dashboard' | 'appointments' | 'social' | 'loyalty' | 'customers' | 'services';
  /** Whether to show the video background */
  showVideo?: boolean;
  /** Custom title override */
  customTitle?: string;
  /** Custom subtitle */
  customSubtitle?: string;
}

/**
 * Elemental Admin Header Component
 * 
 * Provides dynamic video backgrounds for different admin sections
 * with contextual elemental themes
 */
export const ElementalAdminHeader: React.FC<ElementalAdminHeaderProps> = ({
  section,
  showVideo = true,
  customTitle,
  customSubtitle
}) => {
  const [currentElement, setCurrentElement] = useState<'fire' | 'water' | 'wind' | 'lightning'>('fire');

  // Section to element mapping
  const sectionElements = {
    dashboard: 'fire',      // Fire for main dashboard - energy and power
    appointments: 'water',  // Water for appointments - flow and smoothness
    social: 'wind',        // Wind for social media - dynamic and fresh
    loyalty: 'lightning',  // Lightning for loyalty - electrifying rewards
    customers: 'water',    // Water for customers - nurturing relationships
    services: 'fire'       // Fire for services - passion and excellence
  };

  // Section-specific content
  const sectionContent = {
    dashboard: {
      title: 'ModernMen Dashboard',
      subtitle: 'Ignite Your Business Performance',
      element: 'fire',
      icon: '🔥',
      color: '#FF4500'
    },
    appointments: {
      title: 'Appointment Management',
      subtitle: 'Flow Through Your Schedule',
      element: 'water',
      icon: '💧',
      color: '#00BFFF'
    },
    social: {
      title: 'Social Media Hub',
      subtitle: 'Fresh & Dynamic Content',
      element: 'wind',
      icon: '💨',
      color: '#B0C4DE'
    },
    loyalty: {
      title: 'Loyalty & Rewards',
      subtitle: 'Electrifying Customer Engagement',
      element: 'lightning',
      icon: '⚡',
      color: '#FFFF00'
    },
    customers: {
      title: 'Customer Management',
      subtitle: 'Nurture Relationships',
      element: 'water',
      icon: '💧',
      color: '#00BFFF'
    },
    services: {
      title: 'Service Catalog',
      subtitle: 'Passion for Excellence',
      element: 'fire',
      icon: '🔥',
      color: '#FF4500'
    }
  };

  const currentContent = sectionContent[section] || sectionContent.dashboard;

  // Auto-rotate elements for visual interest
  useEffect(() => {
    if (!showVideo) return;

    const elements: Array<'fire' | 'water' | 'wind' | 'lightning'> = ['fire', 'water', 'wind', 'lightning'];
    let currentIndex = elements.indexOf(currentContent.element);

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % elements.length;
      setCurrentElement(elements[currentIndex]);
    }, 12000); // Rotate every 12 seconds

    return () => clearInterval(interval);
  }, [showVideo, currentContent.element]);

  return (
    <div className="elemental-admin-header">
      <style jsx>{`
        .elemental-admin-header {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          border-radius: 16px;
          margin-bottom: 2rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .video-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        .header-overlay {
          position: relative;
          z-index: 10;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0.4) 100%
          );
          color: white;
          text-align: center;
          padding: 2rem;
        }
        
        .section-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
          animation: float 3s ease-in-out infinite;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          background: linear-gradient(135deg, ${currentContent.color}, #ffffff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.5s ease;
        }
        
        .section-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          max-width: 600px;
          line-height: 1.4;
        }
        
        .element-indicator {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
          z-index: 20;
        }
        
        .element-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        
        .element-dot.active {
          background: ${currentContent.color};
          transform: scale(1.3);
          border-color: rgba(255, 255, 255, 0.8);
        }
        
        .element-dot:hover {
          background: ${currentContent.color};
          transform: scale(1.2);
        }
        
        .section-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          z-index: 20;
        }
        
        .no-video-header {
          background: linear-gradient(135deg, ${currentContent.color}20, #1f2937);
          border: 1px solid ${currentContent.color}40;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          color: white;
        }
        
        .no-video-header .section-title {
          color: white;
          -webkit-text-fill-color: white;
        }
        
        .no-video-header .section-subtitle {
          color: rgba(255, 255, 255, 0.8);
        }
        
        @media (max-width: 768px) {
          .elemental-admin-header {
            height: 150px;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .section-subtitle {
            font-size: 1rem;
          }
          
          .section-icon {
            font-size: 2.5rem;
          }
        }
      `}</style>

      {showVideo ? (
        <>
          {/* Elemental Video Background */}
          <div className="video-background">
            <ElementalVideoBackground
              element={currentElement}
              loop={true}
              autoplay={true}
              muted={true}
              opacity={0.7}
            />
          </div>

          {/* Header Overlay */}
          <div className="header-overlay">
            {/* Section Badge */}
            <div className="section-badge">
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </div>

            {/* Section Icon */}
            <span className="section-icon">{currentContent.icon}</span>

            {/* Section Title */}
            <h1 className="section-title">
              {customTitle || currentContent.title}
            </h1>

            {/* Section Subtitle */}
            <p className="section-subtitle">
              {customSubtitle || currentContent.subtitle}
            </p>

            {/* Element Indicator */}
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
        </>
      ) : (
        /* No Video Header */
        <div className="no-video-header">
          <span className="section-icon">{currentContent.icon}</span>
          <h1 className="section-title">
            {customTitle || currentContent.title}
          </h1>
          <p className="section-subtitle">
            {customSubtitle || currentContent.subtitle}
          </p>
        </div>
      )}
    </div>
  );
};

export default ElementalAdminHeader;
