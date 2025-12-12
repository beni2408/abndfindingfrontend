import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Connect. Create. <span className="gradient-text">Collaborate.</span>
              </h1>
              <p className="hero-subtitle">
                The professional network for musicians. Find bandmates, share your music, 
                and build meaningful connections in the music industry.
              </p>
              <div className="hero-buttons">
                <button 
                  onClick={() => navigate('/register')} 
                  className="btn btn-primary btn-large"
                >
                  Get Started Free
                </button>
                <button 
                  onClick={() => navigate('/login')} 
                  className="btn btn-secondary btn-large"
                >
                  Sign In
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="music-card">
                <div className="card-header">
                  <div className="avatar">🎸</div>
                  <div>
                    <div className="name">Jascar Benish</div>
                    <div className="location">📍 TN, India</div>
                  </div>
                </div>
                <div className="card-content">
                  "Looking for a drummer to complete our indie rock band. 
                  We have gigs lined up and need someone passionate!"
                </div>
                <div className="card-tags">
                  <span className="tag">Guitar</span>
                  <span className="tag">Indie Rock</span>
                  <span className="tag">Live Gigs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Musicians Choose JamSync</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎵</div>
              <h3 className="feature-title">Find Your Bandmates</h3>
              <p className="feature-description">
                Connect with musicians in your city. Filter by instruments, 
                genres, and experience level to find the perfect match.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Share Your Music</h3>
              <p className="feature-description">
                Post your latest tracks, rehearsal videos, and musical journey. 
                Get feedback from fellow musicians and grow your network.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">Direct Messaging</h3>
              <p className="feature-description">
                Chat directly with potential bandmates. Discuss projects, 
                share ideas, and plan your next musical collaboration.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Location-Based</h3>
              <p className="feature-description">
                Find musicians near you for in-person collaborations. 
                Build local music communities and attend nearby events.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Private & Secure</h3>
              <p className="feature-description">
                Your musical journey is safe with us. Connect only with 
                verified musicians and control your privacy settings.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Instant Connections</h3>
              <p className="feature-description">
                Send connection requests and start collaborating immediately. 
                No waiting, no barriers - just pure musical connection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Musicians Are Saying</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                "JamSync helped me find the perfect drummer for my band. 
                Within a week, we were jamming together and now we're 
                performing at local venues!"
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">🎸</div>
                <div className="author-info">
                  <div className="author-name">Heisenberg</div>
                  <div className="author-role">Lead Guitarist</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                "The location-based feature is amazing! I connected with 
                musicians in my neighborhood and we've formed an incredible 
                jazz trio. Highly recommended!"
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">🎹</div>
                <div className="author-info">
                  <div className="author-name">Joel</div>
                  <div className="author-role">Pianist & Composer</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                "As a bassist, finding the right band was always challenging. 
                JamSync made it so easy to showcase my skills and connect 
                with serious musicians. Love it!"
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">🎵</div>
                <div className="author-info">
                  <div className="author-name">Roman</div>
                  <div className="author-role">Bass Player</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How JamSync Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Create Your Profile</h3>
                <p className="step-description">
                  Set up your musician profile with your instruments, genres, 
                  and musical experience. Add photos and showcase your style.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Discover Musicians</h3>
                <p className="step-description">
                  Browse through profiles of musicians in your area. 
                  Use filters to find exactly what you're looking for.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Connect & Collaborate</h3>
                <p className="step-description">
                  Send connection requests, chat with potential bandmates, 
                  and start creating music together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Find Your Musical Match?</h2>
            <p className="cta-subtitle">
              Join thousands of musicians already connecting on JamSync
            </p>
            <button 
              onClick={() => navigate('/register')} 
              className="btn btn-primary btn-large"
            >
              Start Your Musical Journey
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="welcome-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>🎵 JamSync</h3>
              <p>Connecting musicians worldwide</p>
            </div>
            <div className="footer-links">
              <button onClick={() => navigate('/login')} className="footer-link">
                Sign In
              </button>
              <button onClick={() => navigate('/register')} className="footer-link">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;