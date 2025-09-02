import React, { useState, useEffect } from 'react';
import ElementalVideoBackground from './ElementalVideoBackground';

export interface CollectionVideoBackgroundProps {
  /** The collection name to determine the video theme */
  collectionName: string;
  /** Whether to show the video background */
  showVideo?: boolean;
  /** Custom element override */
  customElement?: 'fire' | 'water' | 'wind' | 'lightning';
  /** Video opacity */
  opacity?: number;
  /** Whether to show collection info overlay */
  showOverlay?: boolean;
  /** Custom overlay text */
  overlayText?: string;
  /** Position of the video background */
  position?: 'top' | 'center' | 'bottom';
  /** Height of the video container */
  height?: string;
}

/**
 * Collection Video Background Component
 * 
 * Provides contextual elemental video backgrounds for collection pages
 * based on the collection type and content
 */
export const CollectionVideoBackground: React.FC<CollectionVideoBackgroundProps> = ({
  collectionName,
  showVideo = true,
  customElement,
  opacity = 0.6,
  showOverlay = false,
  overlayText,
  position = 'center',
  height = '300px'
}) => {
  const [currentElement, setCurrentElement] = useState<'fire' | 'water' | 'wind' | 'lightning'>('fire');

  // Collection to element mapping
  const collectionElements = {
    // Core business collections
    users: 'fire',           // Fire for users - energy and power
    appointments: 'water',    // Water for appointments - flow and smoothness
    services: 'fire',         // Fire for services - passion and excellence
    customers: 'water',       // Water for customers - nurturing relationships
    staff: 'wind',           // Wind for staff - dynamic and fresh
    barbers: 'fire',         // Fire for barbers - creativity and skill
    gallery: 'lightning',    // Lightning for gallery - electrifying showcase
    reviews: 'wind',         // Wind for reviews - fresh perspectives
    
    // Social media collections
    barbersocial: 'wind',    // Wind for social media - dynamic content
    barbercomments: 'water', // Water for comments - flowing conversation
    barberratings: 'lightning', // Lightning for ratings - electrifying feedback
    barberchallenges: 'fire', // Fire for challenges - competitive spirit
    
    // Loyalty & rewards collections
    loyaltyprogram: 'lightning', // Lightning for loyalty - electrifying rewards
    customerloyalty: 'water',    // Water for customer loyalty - nurturing
    rewardsoffers: 'fire',       // Fire for offers - exciting promotions
    
    // Other collections
    notifications: 'wind',   // Wind for notifications - fresh updates
    settings: 'water',       // Water for settings - smooth configuration
    pages: 'lightning',      // Lightning for pages - electrifying content
    globals: 'fire'          // Fire for globals - core power
  };

  // Element-specific styling and content
  const elementContent = {
    fire: {
      icon: '🔥',
      color: '#FF4500',
      title: 'Ignite',
      description: 'Powerful & Dynamic'
    },
    water: {
      icon: '💧',
      color: '#00BFFF',
      title: 'Flow',
      description: 'Smooth & Nurturing'
    },
    wind: {
      icon: '💨',
      color: '#B0C4DE',
      title: 'Fresh',
      description: 'Dynamic & Innovative'
    },
    lightning: {
      icon: '⚡',
      color: '#FFFF00',
      title: 'Electrify',
      description: 'Fast & Exciting'
    }
  };

  // Determine the element for this collection
  const collectionKey = collectionName.toLowerCase().replace(/\s+/g, '');
  const defaultElement = collectionElements[collectionKey] || 'fire';
  const selectedElement = customElement || defaultElement;
  const currentContent = elementContent[selectedElement];

  // Auto-rotate elements for visual interest
  useEffect(() => {
    if (!showVideo || customElement) return;

    const elements: Array<'fire' | 'water' | 'wind' | 'lightning'> = ['fire', 'water', 'wind', 'lightning'];
    let currentIndex = elements.indexOf(selectedElement);

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % elements.length;
      setCurrentElement(elements[currentIndex]);
    }, 15000); // Rotate every 15 seconds

    return () => clearInterval(interval);
  }, [showVideo, customElement, selectedElement]);

  // Position-specific styling
  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return { alignItems: 'flex-start', paddingTop: '2rem' };
      case 'bottom':
        return { alignItems: 'flex-end', paddingBottom: '2rem' };
      default:
        return { alignItems: 'center' };
    }
  };

  return (
    <div className="collection-video-background">
      <style jsx>{`
        .collection-video-background {
          position: relative;
          width: 100%;
          height: ${height};
          overflow: hidden;
          border-radius: 16px;
          margin-bottom: 2rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .video-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        .collection-overlay {
          position: relative;
          z-index: 10;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          ${position === 'top' ? 'justify-content: flex-start; padding-top: 2rem;' : ''}
          ${position === 'bottom' ? 'justify-content: flex-end; padding-bottom: 2rem;' : ''}
          align-items: center;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0.1) 50%,
            rgba(0, 0, 0, 0.3) 100%
          );
          color: white;
          text-align: center;
          padding: 2rem;
        }
        
        .collection-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          display: block;
          animation: bounce 2s ease-in-out infinite;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .collection-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          background: linear-gradient(135deg, ${currentContent.color}, #ffffff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.5s ease;
        }
        
        .collection-subtitle {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          max-width: 700px;
          line-height: 1.4;
          margin-bottom: 1rem;
        }
        
        .element-badge {
          background: rgba(0, 0, 0, 0.7);
          color: ${currentContent.color};
          padding: 0.5rem 1.5rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: 2px solid ${currentContent.color};
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          gap: 0.5rem;
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
          width: 12px;
          height: 12px;
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
        
        .collection-name-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(15px);
          z-index: 20;
        }
        
        .no-video-container {
          background: linear-gradient(135deg, ${currentContent.color}30, #1f2937);
          border: 2px solid ${currentContent.color}50;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          color: white;
        }
        
        .no-video-container .collection-title {
          color: white;
          -webkit-text-fill-color: white;
        }
        
        .no-video-container .collection-subtitle {
          color: rgba(255, 255, 255, 0.8);
        }
        
        @media (max-width: 768px) {
          .collection-video-background {
            height: 200px;
          }
          
          .collection-title {
            font-size: 2rem;
          }
          
          .collection-subtitle {
            font-size: 1rem;
          }
          
          .collection-icon {
            font-size: 3rem;
          }
          
          .element-badge {
            font-size: 0.8rem;
            padding: 0.4rem 1rem;
          }
        }
      `}</style>

      {showVideo ? (
        <>
          {/* Video Container */}
          <div className="video-container">
            <ElementalVideoBackground
              element={currentElement}
              loop={true}
              autoplay={true}
              muted={true}
              opacity={opacity}
            />
          </div>

          {/* Collection Overlay */}
          <div className="collection-overlay" style={getPositionStyle()}>
            {/* Collection Name Badge */}
            <div className="collection-name-badge">
              {collectionName}
            </div>

            {/* Collection Icon */}
            <span className="collection-icon">{currentContent.icon}</span>

            {/* Collection Title */}
            <h1 className="collection-title">
              {collectionName}
            </h1>

            {/* Collection Subtitle */}
            <p className="collection-subtitle">
              Manage your {collectionName.toLowerCase()} with ModernMen precision
            </p>

            {/* Element Badge */}
            <div className="element-badge">
              <span>{currentContent.icon}</span>
              {currentContent.title} • {currentContent.description}
            </div>

            {/* Element Indicator */}
            {!customElement && (
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
            )}
          </div>
        </>
      ) : (
        /* No Video Container */
        <div className="no-video-container">
          <span className="collection-icon">{currentContent.icon}</span>
          <h1 className="collection-title">
            {collectionName}
          </h1>
          <p className="collection-subtitle">
            Manage your {collectionName.toLowerCase()} with ModernMen precision
          </p>
          <div className="element-badge">
            <span>{currentContent.icon}</span>
            {currentContent.title} • {currentContent.description}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionVideoBackground;
