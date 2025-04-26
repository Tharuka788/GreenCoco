import React from 'react';
import './Footer.css';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaLeaf, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3><FaLeaf className="logo-icon" /> GreenCoco</h3>
          <p>Making finance management simple and sustainable for a greener future. Join us in our mission to transform financial practices.</p>
          <div className="contact-info">
            <p><FaPhone className="contact-icon" /> +94 11 234 5678</p>
            <p><FaEnvelope className="contact-icon" /> info@greencoco.com</p>
            <p><FaMapMarkerAlt className="contact-icon" /> Colombo, Sri Lanka</p>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Connect With Us</h4>
          <p>Follow us on social media for updates and financial tips</p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub">
              <FaGithub className="social-icon" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <FaLinkedin className="social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
              <FaTwitter className="social-icon" />
            </a>
            <a href="mailto:contact@greencoco.com" title="Email Us">
              <FaEnvelope className="social-icon" />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Newsletter</h4>
          <p>Subscribe to our newsletter for the latest updates</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="button">Subscribe</button>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} GreenCoco. All rights reserved. | Made with 💚 in Sri Lanka</p>
      </div>
    </footer>
  );
};

export default Footer; 