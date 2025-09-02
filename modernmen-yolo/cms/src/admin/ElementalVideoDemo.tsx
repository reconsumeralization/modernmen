import React, { useState } from 'react';
import ElementalVideoBackground from './ElementalVideoBackground';
import ElementalAdminHeader from './ElementalAdminHeader';
import CollectionVideoBackground from './CollectionVideoBackground';

/**
 * Elemental Video Demo Component
 * 
 * Showcases all available elemental video components
 * for testing and demonstration purposes
 */
export const ElementalVideoDemo: React.FC = () => {
  const [activeElement, setActiveElement] = useState<'fire' | 'water' | 'wind' | 'lightning'>('fire');
  const [showVideos, setShowVideos] = useState(true);
  const [demoSection, setDemoSection] = useState<'login' | 'header' | 'collection'>('login');

  const elements = ['fire', 'water', 'wind', 'lightning'] as const;

  return (
    <div className="elemental-video-demo">
      <style jsx>{`
        .elemental-video-demo {
          min-height: 100vh;
          background: #0f172a;
          color: white;
          padding: 2rem;
        }
        
        .demo-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, #1e293b, #334155);
          border-radius: 16px;
          border: 1px solid #475569;
        }
        
        .demo-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .demo-subtitle {
          font-size: 1.2rem;
          color: #cbd5e1;
          margin-bottom: 2rem;
        }
        
        .demo-controls {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }
        
        .control-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #475569;
          color: white;
        }
        
        .control-button:hover {
          background: #64748b;
          transform: translateY(-2px);
        }
        
        .control-button.active {
          background: #f59e0b;
          color: #0f172a;
        }
        
        .element-selector {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 2rem;
        }
        
        .element-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        
        .element-dot.fire { background: #ef4444; }
        .element-dot.water { background: #06b6d4; }
        .element-dot.wind { background: #94a3b8; }
        .element-dot.lightning { background: #eab308; }
        
        .element-dot.active {
          transform: scale(1.3);
          border-color: white;
        }
        
        .element-dot:hover {
          transform: scale(1.2);
        }
        
        .demo-section {
          margin-bottom: 4rem;
          padding: 2rem;
          background: #1e293b;
          border-radius: 16px;
          border: 1px solid #475569;
        }
        
        .section-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #f1f5f9;
        }
        
        .section-description {
          color: #94a3b8;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .demo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .demo-item {
          background: #334155;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #475569;
        }
        
        .demo-item-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #f1f5f9;
        }
        
        .demo-item-description {
          color: #94a3b8;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        
        .demo-item-code {
          background: #0f172a;
          padding: 1rem;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-size: 0.8rem;
          color: #e2e8f0;
          overflow-x: auto;
          margin-bottom: 1rem;
        }
        
        .toggle-switch {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .toggle-switch input[type="checkbox"] {
          width: 40px;
          height: 20px;
          appearance: none;
          background: #475569;
          border-radius: 10px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .toggle-switch input[type="checkbox"]:checked {
          background: #f59e0b;
        }
        
        .toggle-switch input[type="checkbox"]::before {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: all 0.3s ease;
        }
        
        .toggle-switch input[type="checkbox"]:checked::before {
          transform: translateX(20px);
        }
        
        .demo-preview {
          margin-top: 1rem;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #475569;
        }
        
        @media (max-width: 768px) {
          .elemental-video-demo {
            padding: 1rem;
          }
          
          .demo-title {
            font-size: 2rem;
          }
          
          .demo-controls {
            flex-direction: column;
            align-items: center;
          }
          
          .demo-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Demo Header */}
      <div className="demo-header">
        <h1 className="demo-title">Elemental Video Demo</h1>
        <p className="demo-subtitle">
          Experience the power of ModernMen's elemental video integration system
        </p>
        
        {/* Demo Controls */}
        <div className="demo-controls">
          <button
            className={`control-button ${demoSection === 'login' ? 'active' : ''}`}
            onClick={() => setDemoSection('login')}
          >
            Login Components
          </button>
          <button
            className={`control-button ${demoSection === 'header' ? 'active' : ''}`}
            onClick={() => setDemoSection('header')}
          >
            Admin Headers
          </button>
          <button
            className={`control-button ${demoSection === 'collection' ? 'active' : ''}`}
            onClick={() => setDemoSection('collection')}
          >
            Collection Backgrounds
          </button>
        </div>

        {/* Element Selector */}
        <div className="element-selector">
          {elements.map((element) => (
            <div
              key={element}
              className={`element-dot ${element} ${element === activeElement ? 'active' : ''}`}
              onClick={() => setActiveElement(element)}
              title={`Switch to ${element} element`}
            />
          ))}
        </div>

        {/* Video Toggle */}
        <div className="toggle-switch">
          <input
            type="checkbox"
            id="video-toggle"
            checked={showVideos}
            onChange={(e) => setShowVideos(e.target.checked)}
          />
          <label htmlFor="video-toggle">Show Video Backgrounds</label>
        </div>
      </div>

      {/* Login Components Demo */}
      {demoSection === 'login' && (
        <div className="demo-section">
          <h2 className="section-title">Login Components</h2>
          <p className="section-description">
            Enhanced login experience with rotating elemental themes and immersive video backgrounds.
          </p>
          
          <div className="demo-grid">
            <div className="demo-item">
              <h3 className="demo-item-title">ElementalVideoBackground</h3>
              <p className="demo-item-description">
                Core video component with customizable element, opacity, and overlay options.
              </p>
              <div className="demo-item-code">
                {`<ElementalVideoBackground
  element="${activeElement}"
  opacity={0.8}
  showOverlay={true}
  overlayText="ModernMen Style"
  overlayStyle="modern"
/>`}
              </div>
              <div className="demo-preview">
                <ElementalVideoBackground
                  element={activeElement}
                  opacity={0.8}
                  showOverlay={true}
                  overlayText="ModernMen Style"
                  overlayStyle="modern"
                />
              </div>
            </div>

            <div className="demo-item">
              <h3 className="demo-item-title">ElementalLogin</h3>
              <p className="demo-item-description">
                Complete login component with auto-rotating themes and interactive controls.
              </p>
              <div className="demo-item-code">
                {`<ElementalLogin />`}
              </div>
              <div className="demo-preview" style={{ height: '400px' }}>
                {/* Note: ElementalLogin would be used in the actual login flow */}
                <div style={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #1e293b, #334155)',
                  borderRadius: '8px',
                  border: '1px solid #475569'
                }}>
                  <p style={{ color: '#94a3b8', textAlign: 'center' }}>
                    ElementalLogin component<br/>
                    (Used in actual login flow)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Headers Demo */}
      {demoSection === 'header' && (
        <div className="demo-section">
          <h2 className="section-title">Admin Headers</h2>
          <p className="section-description">
            Section-specific headers with contextual video backgrounds and thematic content.
          </p>
          
          <div className="demo-grid">
            <div className="demo-item">
              <h3 className="demo-item-title">Dashboard Header</h3>
              <p className="demo-item-description">
                Fire-themed header for the main dashboard with energy and power messaging.
              </p>
              <div className="demo-item-code">
                {`<ElementalAdminHeader section="dashboard" />`}
              </div>
              <div className="demo-preview">
                <ElementalAdminHeader section="dashboard" showVideo={showVideos} />
              </div>
            </div>

            <div className="demo-item">
              <h3 className="demo-item-title">Appointments Header</h3>
              <p className="demo-item-description">
                Water-themed header for appointment management with flow and smoothness messaging.
              </p>
              <div className="demo-item-code">
                {`<ElementalAdminHeader section="appointments" />`}
              </div>
              <div className="demo-preview">
                <ElementalAdminHeader section="appointments" showVideo={showVideos} />
              </div>
            </div>

            <div className="demo-item">
              <h3 className="demo-item-title">Social Media Header</h3>
              <p className="demo-item-description">
                Wind-themed header for social media with fresh and dynamic messaging.
              </p>
              <div className="demo-item-code">
                {`<ElementalAdminHeader section="social" />`}
              </div>
              <div className="demo-preview">
                <ElementalAdminHeader section="social" showVideo={showVideos} />
              </div>
            </div>

            <div className="demo-item">
              <h3 className="demo-item-title">Loyalty Header</h3>
              <p className="demo-item-description">
                Lightning-themed header for loyalty programs with electrifying messaging.
              </p>
              <div className="demo-item-code">
                {`<ElementalAdminHeader section="loyalty" />`}
              </div>
              <div className="demo-preview">
                <ElementalAdminHeader section="loyalty" showVideo={showVideos} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collection Backgrounds Demo */}
      {demoSection === 'collection' && (
        <div className="demo-section">
          <h2 className="section-title">Collection Backgrounds</h2>
          <p className="section-description">
            Collection-specific video backgrounds with automatic element mapping and contextual content.
          </p>
          
          <div className="demo-grid">
            <div className="demo-item">
              <h3 className="demo-item-title">BarberSocial Collection</h3>
              <p className="demo-item-description">
                Wind-themed background for social media posts with dynamic and fresh messaging.
              </p>
              <div className="demo-item-code">
                {`<CollectionVideoBackground
  collectionName="BarberSocial"
  height="250px"
/>`}
              </div>
              <div className="demo-preview">
                <CollectionVideoBackground
                  collectionName="BarberSocial"
                  height="250px"
                  showVideo={showVideos}
                />
              </div>
            </div>

            <div className="demo-item">
              <h3 className="demo-item-title">Appointments Collection</h3>
              <p className="demo-item-description">
                Water-themed background for appointments with flow and smoothness messaging.
              </p>
              <div className="demo-item-code">
                {`<CollectionVideoBackground
  collectionName="Appointments"
  height="250px"
/>`}
              </div>
              <div className="demo-preview">
                <CollectionVideoBackground
                  collectionName="Appointments"
                  height="250px"
                  showVideo={showVideos}
                />
              </div>
            </div>

            <div className="demo-item">
              <h3 className="demo-item-title">LoyaltyProgram Collection</h3>
              <p className="demo-item-description">
                Lightning-themed background for loyalty programs with electrifying messaging.
              </p>
              <div className="demo-item-code">
                {`<CollectionVideoBackground
  collectionName="LoyaltyProgram"
  height="250px"
/>`}
              </div>
              <div className="demo-preview">
                <CollectionVideoBackground
                  collectionName="LoyaltyProgram"
                  height="250px"
                  showVideo={showVideos}
                />
              </div>
            </div>

            <div className="demo-item">
              <h3 className="demo-item-title">Custom Element Override</h3>
              <p className="demo-item-description">
                Force a specific element theme regardless of collection type.
              </p>
              <div className="demo-item-code">
                {`<CollectionVideoBackground
  collectionName="Services"
  customElement="${activeElement}"
  height="250px"
/>`}
              </div>
              <div className="demo-preview">
                <CollectionVideoBackground
                  collectionName="Services"
                  customElement={activeElement}
                  height="250px"
                  showVideo={showVideos}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="demo-section">
        <h2 className="section-title">Integration Notes</h2>
        <p className="section-description">
          These components are designed to be easily integrated into your ModernMen CMS admin interface.
          Each component is fully responsive, accessible, and optimized for performance.
        </p>
        
        <div className="demo-grid">
          <div className="demo-item">
            <h3 className="demo-item-title">Performance</h3>
            <p className="demo-item-description">
              Videos are muted by default and optimized for smooth playback across all devices.
            </p>
          </div>
          
          <div className="demo-item">
            <h3 className="demo-item-title">Accessibility</h3>
            <p className="demo-item-description">
              Full keyboard navigation support and screen reader compatibility.
            </p>
          </div>
          
          <div className="demo-item">
            <h3 className="demo-item-title">Responsive</h3>
            <p className="demo-item-description">
              Automatically adapts to different screen sizes and device capabilities.
            </p>
          </div>
          
          <div className="demo-item">
            <h3 className="demo-item-title">Customizable</h3>
            <p className="demo-item-description">
              Extensive customization options for themes, styling, and behavior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementalVideoDemo;
