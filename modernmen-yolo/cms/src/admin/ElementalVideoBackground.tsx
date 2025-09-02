import React, { useState, useEffect, useRef } from 'react';

export interface ElementalVideoProps {
  /** The type of elemental video to display */
  element: 'fire' | 'water' | 'wind' | 'lightning';
  /** Whether the video should loop */
  loop?: boolean;
  /** Whether the video should autoplay */
  autoplay?: boolean;
  /** Whether the video should be muted */
  muted?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Video opacity (0-1) */
  opacity?: number;
  /** Whether to show overlay text */
  showOverlay?: boolean;
  /** Overlay text content */
  overlayText?: string;
  /** Overlay text style */
  overlayStyle?: 'modern' | 'elegant' | 'bold';
}

/**
 * Elemental Video Background Component
 * 
 * Provides dynamic video backgrounds for different sections of the ModernMen CMS
 * based on elemental themes (fire, water, wind, lightning)
 */
export const ElementalVideoBackground: React.FC<ElementalVideoProps> = ({
  element,
  loop = true,
  autoplay = true,
  muted = true,
  className = '',
  opacity = 0.8,
  showOverlay = false,
  overlayText = '',
  overlayStyle = 'modern'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Video source mapping
  const videoSources = {
    fire: '/video/ModernMenFire.mp4',
    water: '/video/ModernMenWet.mp4',
    wind: '/video/ModernMenhaze.mp4',
    lightning: '/video/ModernMenLitLoop.mp4'
  };

  // Element-specific styling
  const elementStyles = {
    fire: {
      filter: 'brightness(1.2) saturate(1.3)',
      overlayColor: 'rgba(255, 69, 0, 0.1)',
      textColor: '#FF4500'
    },
    water: {
      filter: 'brightness(1.1) saturate(1.2) hue-rotate(180deg)',
      overlayColor: 'rgba(0, 191, 255, 0.1)',
      textColor: '#00BFFF'
    },
    wind: {
      filter: 'brightness(1.0) saturate(1.1)',
      overlayColor: 'rgba(176, 196, 222, 0.1)',
      textColor: '#B0C4DE'
    },
    lightning: {
      filter: 'brightness(1.3) saturate(1.4)',
      overlayColor: 'rgba(255, 255, 0, 0.1)',
      textColor: '#FFFF00'
    }
  };

  const currentStyle = elementStyles[element];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      if (autoplay) {
        video.play().then(() => setIsPlaying(true));
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      if (loop) {
        video.currentTime = 0;
        video.play();
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [autoplay, loop]);

  // Overlay text styles
  const getOverlayStyle = () => {
    switch (overlayStyle) {
      case 'elegant':
        return 'font-serif text-3xl font-light tracking-widest';
      case 'bold':
        return 'font-bold text-4xl tracking-tight';
      default:
        return 'font-sans text-3xl font-medium tracking-wide';
    }
  };

  return (
    <div className={`elemental-video-container ${className}`}>
      <style jsx>{`
        .elemental-video-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: inherit;
        }
        
        .elemental-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
          opacity: ${opacity};
          filter: ${currentStyle.filter};
          transition: all 0.3s ease;
        }
        
        .elemental-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${currentStyle.overlayColor};
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        
        .overlay-text {
          color: ${currentStyle.textColor};
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          text-align: center;
          padding: 2rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .video-loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
          color: ${currentStyle.textColor};
          font-size: 1.2rem;
          background: rgba(0, 0, 0, 0.7);
          padding: 1rem 2rem;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }
        
        .elemental-video-container:hover .elemental-video {
          transform: scale(1.05);
          filter: ${currentStyle.filter} brightness(1.1);
        }
      `}</style>

      {/* Video Element */}
      <video
        ref={videoRef}
        className="elemental-video"
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        playsInline
        preload="auto"
      >
        <source src={videoSources[element]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading State */}
      {!isLoaded && (
        <div className="video-loading">
          Loading {element} element...
        </div>
      )}

      {/* Overlay Text */}
      {showOverlay && overlayText && isLoaded && (
        <div className="elemental-overlay">
          <div className={`overlay-text ${getOverlayStyle()}`}>
            {overlayText}
          </div>
        </div>
      )}
    </div>
  );
};

export default ElementalVideoBackground;
