import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="brand-text">DIY Community</span>
            </h1>
            <p className="hero-subtitle">
              Discover, Create, and Share Amazing DIY Projects with Fellow
              Crafters
            </p>
            <p className="hero-description">
              Join thousands of makers sharing their creativity, learning new
              skills, and building beautiful things together. From woodworking
              to crafts, find inspiration for your next project!
            </p>{" "}
            <div className="hero-buttons">
              <Link to="/feed" className="btn btn-primary">
                Explore Projects
              </Link>
              <Link to="/register" className="btn btn-primary">
                Start Creating
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="craft-icons">
              <div className="craft-icon">🔨</div>
              <div className="craft-icon">🛠️</div>
              <div className="craft-icon">✂️</div>
              <div className="craft-icon">🎨</div>
              <div className="craft-icon">📐</div>
              <div className="craft-icon">🪚</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose DIY Community?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3 className="feature-title">Learn & Discover</h3>
              <p className="feature-description">
                Access thousands of step-by-step tutorials and project guides
                from experienced makers.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Community Support</h3>
              <p className="feature-description">
                Connect with fellow DIY enthusiasts, share tips, and get help
                with your projects.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Save & Organize</h3>
              <p className="feature-description">
                Bookmark your favorite projects and organize them into custom
                collections.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3 className="feature-title">Share Your Work</h3>
              <p className="feature-description">
                Showcase your completed projects and inspire others with your
                creativity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Popular Categories</h2>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">🪵</div>
              <h3 className="category-title">Woodworking</h3>
              <p className="category-count">250+ Projects</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🏠</div>
              <h3 className="category-title">Home Decor</h3>
              <p className="category-count">180+ Projects</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🧵</div>
              <h3 className="category-title">Crafts & Sewing</h3>
              <p className="category-count">320+ Projects</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🌱</div>
              <h3 className="category-title">Garden & Outdoor</h3>
              <p className="category-count">150+ Projects</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🔧</div>
              <h3 className="category-title">Electronics</h3>
              <p className="category-count">90+ Projects</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🍳</div>
              <h3 className="category-title">Kitchen & Food</h3>
              <p className="category-count">120+ Projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your DIY Journey?</h2>
            <p className="cta-subtitle">
              Join our community today and unlock your creative potential!
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Join Now - It's Free!
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3 className="footer-title">DIY Community</h3>
              <p className="footer-text">
                Empowering makers to create, learn, and share amazing projects.
              </p>
            </div>
            <div className="footer-links">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-list">
                <li>
                  <Link to="/login">Sign In</Link>
                </li>
                <li>
                  <Link to="/register">Join Community</Link>
                </li>
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#categories">Categories</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              &copy; 2025 DIY Community. Made with ❤️ for makers everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
