import React from 'react';
import { ThemeSwitcher, useTheme } from './ThemeSwitcher';
import { themes } from './themes';

const DemoPage: React.FC = () => {
  const { currentTheme, setTheme, themeData } = useTheme();

  const sampleServices = [
    { name: 'Classic Haircut', duration: '30 min', price: '$35', description: 'Traditional scissor cut with styling' },
    { name: 'Fade Cut', duration: '45 min', price: '$45', description: 'Modern fade with precise blending' },
    { name: 'Beard Trim', duration: '20 min', price: '$25', description: 'Professional beard shaping' },
    { name: 'Hot Towel Shave', duration: '40 min', price: '$50', description: 'Traditional straight razor shave' }
  ];

  const sampleStaff = [
    { name: 'Marcus Johnson', specialty: 'Fades & Modern Cuts', avatar: '👨‍🎤' },
    { name: 'David Rodriguez', specialty: 'Classic Cuts & Shaves', avatar: '👨‍💼' },
    { name: 'James Wilson', specialty: 'Beard Styling', avatar: '🧔' },
    { name: 'Antonio Garcia', specialty: 'All Services', avatar: '👨‍🎨' }
  ];

  return (
    <div className="demo-page">
      {/* Header with Theme Switcher */}
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="#" className="nav-brand">Modern Men Barbershop</a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" className="nav-link active">Home</a>
                <a href="#" className="nav-link">Services</a>
                <a href="#" className="nav-link">Staff</a>
                <a href="#" className="nav-link">Book Now</a>
              </div>
              <ThemeSwitcher 
                currentTheme={currentTheme} 
                onThemeChange={setTheme}
                showInDemo={true}
              />
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="fade-in">Experience Premium Grooming</h1>
          <p className="slide-up">Where traditional craftsmanship meets modern style</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-accent">Book Appointment</button>
            <button className="btn btn-outline">View Services</button>
          </div>
        </div>
      </section>

      {/* Theme Info Banner */}
      <section className="section" style={{ background: 'var(--color-surface)', padding: '2rem 0' }}>
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Current Theme: <span className="text-accent">{themeData.name}</span></h3>
            <p className="text-light">{themeData.description}</p>
            <p style={{ fontSize: '0.9em', marginTop: '1rem' }}>
              <strong>Try switching themes above to see different looks for your barbershop!</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Our Services</h2>
          <div className="service-grid">
            {sampleServices.map((service, index) => (
              <div key={index} className="service-card">
                <h4>{service.name}</h4>
                <p className="text-light">{service.description}</p>
                <div className="service-price">{service.price}</div>
                <p className="text-light">{service.duration}</p>
                <button className="btn btn-primary">Book Now</button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Staff Section */}
      <section className="section section-alt">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Meet Our Team</h2>
          <div className="staff-grid">
            {sampleStaff.map((staff, index) => (
              <div key={index} className="staff-card">
                <div className="staff-avatar">{staff.avatar}</div>
                <h4>{staff.name}</h4>
                <p className="text-accent">{staff.specialty}</p>
                <button className="btn btn-secondary">Book with {staff.name.split(' ')[0]}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Demo */}
      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Book Your Appointment</h2>
          <div className="booking-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Select Service</label>
                <select className="form-select">
                  <option>Classic Haircut</option>
                  <option>Fade Cut</option>
                  <option>Beard Trim</option>
                  <option>Hot Towel Shave</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Choose Barber</label>
                <select className="form-select">
                  <option>Marcus Johnson</option>
                  <option>David Rodriguez</option>
                  <option>James Wilson</option>
                  <option>Antonio Garcia</option>
                </select>
              </div>
            </div>            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <select className="form-select">
                  <option>9:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                  <option>4:00 PM</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input type="text" className="form-input" placeholder="Enter your full name" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-input" placeholder="(555) 123-4567" />
            </div>
            <div className="form-group">
              <label className="form-label">Special Requests</label>
              <textarea 
                className="form-input" 
                rows={3} 
                placeholder="Any specific preferences or requests..."
              ></textarea>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              Confirm Appointment
            </button>
          </div>
        </div>
      </section>
      {/* Appointments Table Demo */}
      <section className="section section-alt">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Today's Appointments</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Client</th>
                <th>Service</th>
                <th>Barber</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>9:00 AM</td>
                <td>John Smith</td>
                <td>Fade Cut</td>
                <td>Marcus Johnson</td>
                <td><span className="status-badge status-completed">Completed</span></td>
              </tr>
              <tr>
                <td>10:30 AM</td>
                <td>Michael Brown</td>
                <td>Classic Cut</td>
                <td>David Rodriguez</td>
                <td><span className="status-badge status-completed">Completed</span></td>
              </tr>
              <tr>
                <td>2:00 PM</td>
                <td>Robert Davis</td>
                <td>Beard Trim</td>
                <td>James Wilson</td>
                <td><span className="status-badge status-confirmed">Confirmed</span></td>
              </tr>
              <tr>
                <td>3:30 PM</td>
                <td>William Miller</td>
                <td>Hot Towel Shave</td>
                <td>Antonio Garcia</td>
                <td><span className="status-badge status-pending">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      {/* Theme Showcase */}
      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Available Themes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {Object.values(themes).map((theme) => (
              <div 
                key={theme.id}
                className={`card ${currentTheme === theme.id ? 'card-elevated' : ''}`}
                style={{ 
                  cursor: 'pointer',
                  border: currentTheme === theme.id ? `2px solid var(--color-accent)` : undefined
                }}
                onClick={() => setTheme(theme.id)}
              >
                <div 
                  style={{
                    height: '60px',
                    borderRadius: 'var(--radius-small)',
                    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 50%, ${theme.colors.accent} 100%)`,
                    marginBottom: '1rem'
                  }}
                ></div>
                <h4>{theme.name}</h4>
                <p className="text-light">{theme.description}</p>
                {currentTheme === theme.id && (
                  <span className="status-badge status-confirmed" style={{ marginTop: '1rem' }}>
                    Currently Active
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div>
              <h4>Modern Men Barbershop</h4>
              <p>Premium grooming services for the modern gentleman.</p>
            </div>
            <div>
              <h4>Contact</h4>
              <p>📍 123 Main Street, Downtown</p>
              <p>📞 (555) 123-CUTS</p>
              <p>✉️ info@modernmenbarbershop.com</p>
            </div>
            <div>
              <h4>Hours</h4>
              <p>Monday - Friday: 9am - 8pm</p>
              <p>Saturday: 8am - 6pm</p>
              <p>Sunday: 10am - 4pm</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DemoPage;