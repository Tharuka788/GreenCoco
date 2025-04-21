import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setFormErrors({});
    setFormData({ username: '', password: '', name: '', confirmPassword: '' });
    setIsLoginForm(true);
  };

  const switchForm = (formType) => {
    setIsLoginForm(formType === 'login');
    setFormErrors({});
    setFormData({ username: '', password: '', name: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    console.log('Logged out');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const errors = { ...formErrors };

    if (name === 'username') {
      if (!value) {
        errors.username = 'Username is required';
      } else {
        delete errors.username;
      }
    }

    if (name === 'password') {
      if (!value) {
        errors.password = 'Password is required';
      } else if (value.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
      } else {
        delete errors.password;
      }
    }

    if (name === 'name' && !isLoginForm) {
      if (!value) {
        errors.name = 'Name is required';
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
      errors.username = 'Username is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (!isLoginForm) {
      if (!formData.name) {
        errors.name = 'Name is required';
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Confirm password is required';
      } else if (formData.confirmPassword !== formData.password) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (isLoginForm) {
      alert('Login submitted! Username: ' + formData.username);
      setIsAuthenticated(true);
    } else {
      alert('Registration submitted! Name: ' + formData.name + ', Username: ' + formData.username);
      setIsAuthenticated(true);
    }

    toggleModal();
  };

  const handleSocialLogin = (platform) => {
    alert(`Logging in with ${platform}`);
    setIsAuthenticated(true);
    toggleModal();
  };

  const navStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .main-navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background: #1a4d38;
      color: white;
      padding: 15px 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: 'Poppins', sans-serif;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      z-index: 2000;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
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
      background: linear-gradient(90deg, #46b38a, #2a7458);
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
      position: relative;
      overflow: hidden;
    }

    .main-nav-links a::after,
    .dropdown-toggle::after,
    .login-button::after,
    .logout-button::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: #46b38a;
      transform: scaleX(0);
      transform-origin: bottom right;
      transition: transform 0.3s ease;
    }

    .main-nav-links a:hover::after,
    .dropdown-toggle:hover::after,
    .login-button:hover::after,
    .logout-button:hover::after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }

    .main-nav-links a:hover,
    .dropdown-toggle:hover,
    .login-button:hover,
    .logout-button:hover {
      color: #ffffff;
      background: #2a7458;
      transform: translateY(-2px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    .main-nav-links a.active {
      background: #46b38a;
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
      display: flex;
      align-items: center;
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
      background: #1a4d38;
      min-width: 220px;
      border-radius: 10px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.3);
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
      display: block;
      padding: 12px 15px;
      color: #ffffff;
      text-decoration: none;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    .dropdown-menu a:hover {
      background: #2a7458;
      color: #ffffff;
      transform: translateX(5px);
    }

    .dropdown-menu a.active {
      background: #46b38a;
      color: #ffffff;
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
      background: rgba(0, 0, 0, 0.5);
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
      position: relative;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
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
      color: #333;
      background: #f0f0f0;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .modal-tab.active {
      background: linear-gradient(90deg, #328e6e, #46b38a);
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
      color: #333;
      cursor: pointer;
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

    .modal label {
      display: block;
      margin-bottom: 8px;
      color: #2a7458;
      font-weight: 400;
      font-size: 1rem;
      text-align: left;
    }

    .modal input[type="text"],
    .modal input[type="password"] {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      font-family: 'Poppins', sans-serif;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }

    .modal input:focus {
      outline: none;
      border-color: #46b38a;
      box-shadow: 0 0 5px rgba(70, 179, 138, 0.3);
    }

    .modal .error {
      color: #e74c3c;
      font-size: 0.85rem;
      margin-top: -10px;
      margin-bottom: 10px;
      text-align: left;
    }

    .modal .checkbox-label {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      font-size: 0.9rem;
      color: #2a7458;
    }

    .modal input[type="checkbox"] {
      margin-right: 8px;
    }

    .modal button[type="submit"] {
      display: block;
      width: 100%;
      padding: 12px;
      background: linear-gradient(90deg, #328e6e, #46b38a);
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-size: 1rem;
      font-family: 'Poppins', sans-serif;
      transition: background 0.3s ease, transform 0.1s ease;
    }

    .modal button[type="submit"]:hover {
      background: linear-gradient(90deg, #46b38a, #328e6e);
      transform: scale(1.02);
    }

    .modal button[type="submit"]:active {
      transform: scale(0.98);
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
        background: #1a4d38;
        border-top: 1px solid rgba(255, 255, 255, 0.3);
        padding: 10px 0;
      }

      .main-nav-links li {
        margin: 10px 0;
        width: 100%;
        text-align: center;
      }

      .main-nav-links a,
      .dropdown-toggle,
      .login-button,
      .logout-button {
        padding: 10px;
        font-size: 1rem;
        display: block;
      }

      .dropdown-menu {
        position: static;
        width: 100%;
        background: #2a7458;
        border: none;
        box-shadow: none;
      }

      .dropdown:hover .dropdown-menu {
        max-height: 400px;
        opacity: 1;
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

      .main-nav-links a,
      .dropdown-toggle,
      .login-button,
      .logout-button {
        font-size: 0.9rem;
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
      <nav className="main-navbar">
        <Link to="/" className="main-navbar-logo">
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
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className="main-nav-links">
          <li className="dropdown">
            <div className="dropdown-toggle">
              Financial Management
            </div>
            <div className="dropdown-menu">
              <Link
                to="/finance"
                className={location.pathname === '/finance' ? 'active' : ''}
              >
                Dashboard
              </Link>
              <Link
                to="/finance/income"
                className={location.pathname === '/finance/income' ? 'active' : ''}
              >
                Income
              </Link>
              <Link
                to="/finance/expense"
                className={location.pathname === '/finance/expense' ? 'active' : ''}
              >
                Expenses
              </Link>
              <Link
                to="/finance/salary"
                className={location.pathname === '/finance/salary' ? 'active' : ''}
              >
                Salaries
              </Link>
              <Link
                to="/finance/transactions"
                className={location.pathname === '/finance/transactions' ? 'active' : ''}
              >
                View Transactions
              </Link>
            </div>
          </li>
          <li>
            <Link
              to="/inventory"
              className={location.pathname === '/inventory' ? 'active' : ''}
            >
              Inventory Management
            </Link>
          </li>
          <li>
            <Link
              to="/delivery"
              className={location.pathname === '/delivery' ? 'active' : ''}
            >
              Delivery
            </Link>
          </li>
          <li>
            <Link
              to="/order-supplier"
              className={location.pathname === '/order-supplier' ? 'active' : ''}
            >
              Order & Supplier
            </Link>
          </li>
          <li>
            <Link
              to="/employee"
              className={location.pathname === '/employee' ? 'active' : ''}
            >
              Employee Management
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/profile"
                  className={location.pathname === '/profile' ? 'active' : ''}
                >
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <button onClick={toggleModal} className="login-button">
                Login
              </button>
            </li>
          )}
        </ul>
      </nav>

      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-tabs">
            <div
              className={`modal-tab ${isLoginForm ? 'active' : ''}`}
              onClick={() => switchForm('login')}
            >
              Log in
            </div>
            <div
              className={`modal-tab ${!isLoginForm ? 'active' : ''}`}
              onClick={() => switchForm('register')}
            >
              Register
            </div>
          </div>
          <div className="modal-content">
            <button onClick={toggleModal} className="close-button" aria-label="Close modal">
              ×
            </button>
            <div className="social-buttons">
              <button
                className="social-button facebook"
                onClick={() => handleSocialLogin('Facebook')}
                aria-label="Login with Facebook"
              >
                f
              </button>
              <button
                className="social-button google"
                onClick={() => handleSocialLogin('Google')}
                aria-label="Login with Google"
              >
                G+
              </button>
              <button
                className="social-button twitter"
                onClick={() => handleSocialLogin('Twitter')}
                aria-label="Login with Twitter"
              >
                🐦
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {!isLoginForm && (
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLoginForm}
                  />
                  {formErrors.name && <div className="error">{formErrors.name}</div>}
                </label>
              )}
              <label>
                User Name:
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.username && <div className="error">{formErrors.username}</div>}
              </label>
              <label>
                {isLoginForm ? 'Enter Password:' : 'Password:'}
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.password && <div className="error">{formErrors.password}</div>}
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
                  Confirm Password:
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={!isLoginForm}
                  />
                  {formErrors.confirmPassword && (
                    <div className="error">{formErrors.confirmPassword}</div>
                  )}
                </label>
              )}
              <button type="submit">{isLoginForm ? 'Log in' : 'Register'}</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainNavbar;