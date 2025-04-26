import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const footerPosition = document.querySelector('.footer')?.offsetTop;
      if (footerPosition && scrollPosition > footerPosition) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className={`footer ${isVisible ? 'visible' : ''}`}>
      <div className="footer-decoration">
        <div className="decoration-circle"></div>
        <div className="decoration-line"></div>
      </div>

      <div className="footer-waves">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>
      
      <div className="footer-content">
        <div className="footer-section main-section">
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-text">GC</span>
            </div>
          </div>
          <h3>GreenCoco</h3>
          <p>Empowering sustainable business management with innovative solutions.</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link">
              <i className="fab fa-facebook"></i>
              <span className="social-tooltip">Facebook</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-link">
              <i className="fab fa-twitter"></i>
              <span className="social-tooltip">Twitter</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link">
              <i className="fab fa-linkedin"></i>
              <span className="social-tooltip">LinkedIn</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">
              <i className="fab fa-instagram"></i>
              <span className="social-tooltip">Instagram</span>
            </a>
          </div>
        </div>

        <div className="footer-section links-section">
          <div className="section-header">
            <i className="fas fa-link section-icon"></i>
            <h4>Quick Links</h4>
          </div>
          <ul>
            <li><Link to="/inventory"><i className="fas fa-box"></i>Inventory</Link></li>
            <li><Link to="/finance"><i className="fas fa-chart-line"></i>Finance</Link></li>
            <li><Link to="/suppliers"><i className="fas fa-truck"></i>Suppliers</Link></li>
            <li><Link to="/employee"><i className="fas fa-users"></i>Employees</Link></li>
          </ul>
        </div>

        <div className="footer-section resources-section">
          <div className="section-header">
            <i className="fas fa-book section-icon"></i>
            <h4>Resources</h4>
          </div>
          <ul>
            <li><Link to="/about"><i className="fas fa-info-circle"></i>About Us</Link></li>
            <li><Link to="/contact"><i className="fas fa-envelope"></i>Contact</Link></li>
            <li><Link to="/privacy"><i className="fas fa-shield-alt"></i>Privacy Policy</Link></li>
            <li><Link to="/terms"><i className="fas fa-file-contract"></i>Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer-section contact-section">
          <div className="section-header">
            <i className="fas fa-address-card section-icon"></i>
            <h4>Contact Us</h4>
          </div>
          <ul className="contact-info">
            <li className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-phone"></i>
              </div>
              <div className="contact-text">
                <span className="label">Phone</span>
                <span className="value">+1 (123) 456-7890</span>
              </div>
            </li>
            <li className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="contact-text">
                <span className="label">Email</span>
                <span className="value">info@greencoco.com</span>
              </div>
            </li>
            <li className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="contact-text">
                <span className="label">Address</span>
                <span className="value">123 Green Street, Eco City</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-line"></div>
        <p>&copy; {currentYear} GreenCoco. All rights reserved.</p>
        <div className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <i className="fas fa-arrow-up"></i>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 