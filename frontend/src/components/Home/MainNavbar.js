import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faMoneyBillWave,
  faBox,
  faTruck,
  faUsers,
  faUser,
  faSignOutAlt,
  faSignInAlt,
  faUserCircle,
  faLock,
  faSignature
} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons';

const MainNavbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Check localStorage for authentication state on mount
  useEffect(() => {
    const authState = localStorage.getItem('isAuthenticated');
    if (authState === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setFormErrors({});
    setFormData({ username: '', password: '', name: '', confirmPassword: '' });
    setIsLoginForm(true);
    setAuthError('');
  };

  const switchForm = (formType) => {
    setIsLoginForm(formType === 'login');
    setFormErrors({});
    setFormData({ username: '', password: '', name: '', confirmPassword: '' });
    setAuthError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const errors = { ...formErrors };

    if (name === 'username') {
      if (!value) {
        errors.username = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errors.username = 'Please enter a valid email address';
      } else {
        delete errors.username;
      }
    }

    if (name === 'password') {
      if (!value) {
        errors.password = 'Password is required';
      } else if (value.length < 8 || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
        errors.password = 'Password must be 8+ characters with an uppercase letter and a number';
      } else {
        delete errors.password;
      }
    }

    if (name === 'name' && !isLoginForm) {
      if (!value) {
        errors.name = 'Name is required';
      } else if (value.length < 2) {
        errors.name = 'Name must be at least 2 characters';
      } else {
        delete errors.name;
      }
    }

    if (name === 'confirmPassword' && !isLoginForm) {
      if (!value) {
        errors.confirmPassword = 'Confirm password is required';
      } else if (value !== formData.password) {
        errors.confirmPassword = 'Passwords do not match';
      } else {
        delete errors.confirmPassword;
      }
    }

    setFormErrors(errors);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username) {
      errors.username = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.username)) {
      errors.username = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      errors.password = 'Password must be 8+ characters with an uppercase letter and a number';
    }

    if (!isLoginForm) {
      if (!formData.name) {
        errors.name = 'Name is required';
      } else if (formData.name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Confirm password is required';
      } else if (formData.confirmPassword !== formData.password) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (isLoginForm) {
        // Simulate login API call
        if (formData.username === 'test@example.com' && formData.password === 'Password123') {
          localStorage.setItem('isAuthenticated', 'true');
          setIsAuthenticated(true);
          toggleModal();
        } else {
          throw new Error('Invalid email or password');
        }
      } else {
        // Simulate register API call
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        toggleModal();
      }
    } catch (err) {
      setAuthError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (platform) => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      toggleModal();
      setIsLoading(false);
    }, 1000);
  };

  const navStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .main-navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background: linear-gradient(90deg, #00796b, #26a69a);
      color: white;
      padding: 15px 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: 'Poppins', sans-serif;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      z-index: 2000;
      animation: slideIn 0.5s ease;
    }

    @keyframes slideIn {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .main-navbar-logo {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    .main-navbar-logo img {
      height: 50px;
      width: auto;
      transition: transform 0.3s ease;
    }

    .main-navbar-logo img:hover {
      transform: scale(1.1);
    }

    .logo-fallback {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ffffff;
      background: linear-gradient(90deg, #26a69a, #009688);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .main-nav-links {
      display: flex;
      align-items: center;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .main-nav-links li {
      position: relative;
      margin-left: 25px;
    }

    .main-nav-links a,
    .dropdown-toggle,
    .login-button,
    .logout-button {
      color: #ffffff;
      text-decoration: none;
      font-size: 1rem;
      font-weight: 500;
      padding: 8px 15px;
      border-radius: 25px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
    }

    .main-nav-links a svg,
    .dropdown-toggle svg,
    .login-button svg,
    .logout-button svg {
      margin-right: 8px;
    }

    .main-nav-links a:hover,
    .dropdown-toggle:hover,
    .login-button:hover,
    .logout-button:hover {
      background: #009688;
      transform: translateY(-2px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    .main-nav-links a.active {
      background: #26a69a;
      color: #ffffff;
      font-weight: 600;
    }

    .login-button,
    .logout-button {
      background: none;
      border: none;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
    }

    .dropdown {
      position: relative;
    }

    .dropdown-toggle {
      cursor: pointer;
    }

    .dropdown-toggle::after {
      content: '▼';
      margin-left: 5px;
      font-size: 0.8rem;
      transition: transform 0.3s ease;
    }

    .dropdown:hover .dropdown-toggle::after {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background: #00796b;
      min-width: 220px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
      opacity: 0;
    }

    .dropdown:hover .dropdown-menu {
      max-height: 400px;
      opacity: 1;
    }

    .dropdown-menu a {
      display: flex;
      align-items: center;
      padding: 12px 15px;
      color: #ffffff;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    .dropdown-menu a svg {
      margin-right: 8px;
    }

    .dropdown-menu a:hover {
      background: #009688;
      transform: translateX(5px);
    }

    .dropdown-menu a.active {
      background: #26a69a;
      font-weight: 600;
    }

    .hamburger {
      display: none;
      flex-direction: column;
      cursor: pointer;
      background: none;
      border: none;
      padding: 5px;
    }

    .hamburger span {
      width: 25px;
      height: 3px;
      background: #ffffff;
      margin: 2px 0;
      transition: all 0.3s ease;
    }

    .hamburger.open span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger.open span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.open span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }

    .modal-overlay {
      display: ${isModalOpen ? 'flex' : 'none'};
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      justify-content: center;
      align-items: center;
      z-index: 3000;
      transition: opacity 0.3s ease;
    }

    .modal {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
      animation: slideInModal 0.3s ease;
    }

    @keyframes slideInModal {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .modal-tabs {
      display: flex;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      overflow: hidden;
    }

    .modal-tab {
      flex: 1;
      padding: 12px;
      text-align: center;
      font-size: 1rem;
      font-weight: 500;
      color: #004d40;
      background: #f0f0f0;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .modal-tab.active {
      background: linear-gradient(90deg, #00796b, #26a69a);
      color: #ffffff;
    }

    .modal-content {
      padding: 20px;
      position: relative;
    }

    .modal .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #004d40;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .modal .close-button:hover {
      color: #d32f2f;
    }

    .auth-error {
      color: #d32f2f;
      text-align: center;
      margin-bottom: 15px;
      background: #ffebee;
      padding: 10px;
      border-radius: 4px;
    }

    .social-buttons {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 20px;
    }

    .social-button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.2rem;
      color: #ffffff;
      cursor: pointer;
      transition: transform 0.3s ease;
      position: relative;
    }

    .social-button:hover {
      transform: scale(1.1);
    }

    .social-button.facebook {
      background: #3b5998;
    }

    .social-button.google {
      background: #db4437;
    }

    .social-button.twitter {
      background: #1da1f2;
    }

    .social-button .tooltip {
      visibility: hidden;
      width: 120px;
      background: #37474f;
      color: white;
      text-align: center;
      padding: 5px;
      border-radius: 4px;
      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .social-button:hover .tooltip {
      visibility: visible;
      opacity: 1;
    }

    .modal label {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      color: #004d40;
      font-weight: 500;
      font-size: 1rem;
    }

    .modal label svg {
      margin-right: 8px;
      color: #26a69a;
    }

    .modal input[type="text"],
    .modal input[type="password"] {
      width: 100%;
      padding: 10px 12px;
      margin-bottom: 15px;
      border: 2px solid #b0bec5;
      border-radius: 6px;
      font-size: 1rem;
      font-family: 'Poppins', sans-serif;
      transition: all 0.3s ease;
      background: #f5f5f5;
    }

    .modal input:focus {
      outline: none;
      border-color: #26a69a;
      background: white;
      box-shadow: 0 0 8px rgba(38, 166, 154, 0.2);
    }

    .modal .error {
      color: #d32f2f;
      font-size: 0.85rem;
      margin-top: -10px;
      margin-bottom: 10px;
    }

    .modal .checkbox-label {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      font-size: 0.9rem;
      color: #004d40;
    }

    .modal input[type="checkbox"] {
      margin-right: 8px;
    }

    .modal button[type="submit"] {
      display: block;
      width: 100%;
      padding: 12px;
      background: linear-gradient(90deg, #00796b, #26a69a);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-family: 'Poppins', sans-serif;
      transition: all 0.3s ease;
      position: relative;
    }

    .modal button[type="submit"]:hover {
      background: linear-gradient(90deg, #009688, #26a69a);
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 150, 136, 0.3);
    }

    .modal button[type="submit"]:disabled {
      background: #b0bec5;
      cursor: not-allowed;
    }

    .loading-spinner {
      display: inline-block;
      border: 3px solid #ffffff;
      border-top: 3px solid transparent;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    @keyframes spin {
      0% { transform: translateX(-50%) rotate(0deg); }
      100% { transform: translateX(-50%) rotate(360deg); }
    }

    @media (max-width: 768px) {
      .main-navbar {
        padding: 10px 20px;
      }

      .main-navbar-logo img {
        height: 40px;
      }

      .logo-fallback {
        font-size: 1.2rem;
      }

      .hamburger {
        display: flex;
      }

      .main-nav-links {
        display: ${isMobileMenuOpen ? 'flex' : 'none'};
        flex-direction: column;
        position: absolute;
        top: 60px;
        left: 0;
        width: 100%;
        background: linear-gradient(90deg, #00796b, #26a69a);
        padding: 10px 0;
        animation: slideInMobile 0.3s ease;
      }

      @keyframes slideInMobile {
        from { transform: translateY(-10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      .main-nav-links li {
        margin: 10px 0;
        width: 100%;
        text-align: center;
      }

      .dropdown-menu {
        position: static;
        width: 100%;
        background: #009688;
        border: none;
        box-shadow: none;
      }

      .modal {
        max-width: 90%;
      }

      .modal-content {
        padding: 15px;
      }

      .modal-tab {
        font-size: 0.9rem;
      }

      .social-button {
        width: 35px;
        height: 35px;
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .main-navbar {
        padding: 8px 15px;
      }

      .main-navbar-logo img {
        height: 35px;
      }

      .logo-fallback {
        font-size: 1rem;
      }

      .modal-content {
        padding: 10px;
      }

      .modal-tab {
        font-size: 0.85rem;
      }

      .social-button {
        width: 30px;
        height: 30px;
        font-size: 0.9rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: navStyles }} />
      <nav className="main-navbar" aria-label="Main navigation">
        <Link to="/" className="main-navbar-logo" aria-label="Green Coco Home">
          <img
            src="/logo.png"
            alt="Green Coco Logo"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <span className="logo-fallback" style={{ display: 'none' }}>
            GreenCoco
          </span>
        </Link>
        <button
          className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className="main-nav-links" role="menubar">
          <li className="dropdown" role="none">
            <div className="dropdown-toggle" role="menuitem" aria-haspopup="true" aria-expanded="false" tabIndex="0">
              <FontAwesomeIcon icon={faMoneyBillWave} /> Financial Management
            </div>
            <div className="dropdown-menu" role="menu">
              <Link to="/finance" className={location.pathname === '/finance' ? 'active' : ''} role="menuitem">
                Dashboard
              </Link>
              <Link to="/finance/income" className={location.pathname === '/finance/income' ? 'active' : ''} role="menuitem">
                Income
              </Link>
              <Link to="/finance/expense" className={location.pathname === '/finance/expense' ? 'active' : ''} role="menuitem">
                Expenses
              </Link>
              <Link to="/finance/salary" className={location.pathname === '/finance/salary' ? 'active' : ''} role="menuitem">
                Salaries
              </Link>
              <Link to="/finance/transactions" className={location.pathname === '/finance/transactions' ? 'active' : ''} role="menuitem">
                View Transactions
              </Link>
            </div>
          </li>
          <li className="dropdown" role="none">
            <div className="dropdown-toggle" role="menuitem" aria-haspopup="true" aria-expanded="false" tabIndex="0">
              <FontAwesomeIcon icon={faBox} /> Inventory Management
            </div>
            <div className="dropdown-menu" role="menu">
              <Link to="/inventory" className={location.pathname === '/inventory' ? 'active' : ''} role="menuitem">
                Inventory List
              </Link>
              <Link to="/inventory/add" className={location.pathname === '/inventory/add' ? 'active' : ''} role="menuitem">
                Add Inventory
              </Link>
              <Link to="/inventory/low-stock" className={location.pathname === '/inventory/low-stock' ? 'active' : ''} role="menuitem">
                Low Stock Report
              </Link>
            </div>
          </li>
          <li role="none">
            <Link to="/delivery" className={location.pathname === '/delivery' ? 'active' : ''} role="menuitem">
              <FontAwesomeIcon icon={faTruck} /> Delivery
            </Link>
          </li>
          <li role="none">
            <Link to="/order-supplier" className={location.pathname === '/order-supplier' ? 'active' : ''} role="menuitem">
              <FontAwesomeIcon icon={faBox} /> Order & Supplier
            </Link>
          </li>
          <li role="none">
            <Link to="/employee" className={location.pathname === '/employee' ? 'active' : ''} role="menuitem">
              <FontAwesomeIcon icon={faUsers} /> Employee Management
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li role="none">
                <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''} role="menuitem">
                  <FontAwesomeIcon icon={faUser} /> Profile
                </Link>
              </li>
              <li role="none">
                <button onClick={handleLogout} className="logout-button" role="menuitem">
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
              </li>
            </>
          ) : (
            <li role="none">
              <button onClick={toggleModal} className="login-button" role="menuitem" aria-label="Open login modal">
                <FontAwesomeIcon icon={faSignInAlt} /> Login
              </button>
            </li>
          )}
        </ul>
      </nav>

      <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <div className="modal">
          <div className="modal-tabs">
            <div
              className={`modal-tab ${isLoginForm ? 'active' : ''}`}
              onClick={() => switchForm('login')}
              role="tab"
              aria-selected={isLoginForm}
              tabIndex="0"
            >
              Log in
            </div>
            <div
              className={`modal-tab ${!isLoginForm ? 'active' : ''}`}
              onClick={() => switchForm('register')}
              role="tab"
              aria-selected={!isLoginForm}
              tabIndex="0"
            >
              Register
            </div>
          </div>
          <div className="modal-content">
            <button
              onClick={toggleModal}
              className="close-button"
              aria-label="Close authentication modal"
            >
              ×
            </button>
            <h2 id="auth-modal-title" style={{ display: 'none' }}>
              {isLoginForm ? 'Login' : 'Register'}
            </h2>
            {authError && <div className="auth-error">{authError}</div>}
            <div className="social-buttons">
              <button
                className="social-button facebook"
                onClick={() => handleSocialLogin('Facebook')}
                aria-label="Login with Facebook"
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faFacebookF} />
                <span className="tooltip">Login with Facebook</span>
              </button>
              <button
                className="social-button google"
                onClick={() => handleSocialLogin('Google')}
                aria-label="Login with Google"
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faGoogle} />
                <span className="tooltip">Login with Google</span>
              </button>
              <button
                className="social-button twitter"
                onClick={() => handleSocialLogin('Twitter')}
                aria-label="Login with Twitter"
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faTwitter} />
                <span className="tooltip">Login with Twitter</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {!isLoginForm && (
                <label>
                  <FontAwesomeIcon icon={faSignature} /> Name:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLoginForm}
                    aria-invalid={!!formErrors.name}
                    aria-describedby={formErrors.name ? 'name-error' : undefined}
                  />
                  {formErrors.name && <div className="error" id="name-error">{formErrors.name}</div>}
                </label>
              )}
              <label>
                <FontAwesomeIcon icon={faUserCircle} /> Email:
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  aria-invalid={!!formErrors.username}
                  aria-describedby={formErrors.username ? 'username-error' : undefined}
                />
                {formErrors.username && <div className="error" id="username-error">{formErrors.username}</div>}
              </label>
              <label>
                <FontAwesomeIcon icon={faLock} /> Password:
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  aria-invalid={!!formErrors.password}
                  aria-describedby={formErrors.password ? 'password-error' : undefined}
                />
                {formErrors.password && <div className="error" id="password-error">{formErrors.password}</div>}
              </label>
              {isLoginForm && (
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberPassword}
                    onChange={(e) => setRememberPassword(e.target.checked)}
                  />
                  Remember Password
                </label>
              )}
              {!isLoginForm && (
                <label>
                  <FontAwesomeIcon icon={faLock} /> Confirm Password:
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={!isLoginForm}
                    aria-invalid={!!formErrors.confirmPassword}
                    aria-describedby={formErrors.confirmPassword ? 'confirm-password-error' : undefined}
                  />
                  {formErrors.confirmPassword && (
                    <div className="error" id="confirm-password-error">{formErrors.confirmPassword}</div>
                  )}
                </label>
              )}
              <button type="submit" disabled={isLoading}>
                {isLoading ? <span className="loading-spinner"></span> : (isLoginForm ? 'Log in' : 'Register')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainNavbar;