import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLeaf, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3><FontAwesomeIcon icon={faLeaf} className="logo-icon" /> GreenCoco</h3>
          <p>Making finance management simple and sustainable for a greener future. Join us in our mission to transform finance management.</p>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p><FontAwesomeIcon icon={faPhone} /> +1 234 567 890</p>
          <p><FontAwesomeIcon icon={faEnvelope} /> info@greencoco.com</p>
          <p><FontAwesomeIcon icon={faMapMarkerAlt} /> 123 Green Street, Eco City</p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faGithub} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTwitter} /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} GreenCoco. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 