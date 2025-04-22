import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.role === 'admin') {
          console.log('Admin already logged in, navigating to /admin');
          navigate('/admin', { replace: true });
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        toast.error('Invalid token. Please log in again.');
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting to log in admin with email:', email);
      const res = await axios.post('http://localhost:5000/api/admins/login', formData);
      console.log('Login response:', res.data);

      if (!res.data.token) {
        throw new Error('No token received from server');
      }

      toast.success('Admin login successful!');
      localStorage.setItem('token', res.data.token);
      console.log('Token stored in localStorage:', localStorage.getItem('token'));
      console.log('Navigating to /admin');
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        toast.error(err.response.data.message || 'Admin login failed');
      } else if (err.request) {
        toast.error('Server not responding. Please try again later.');
      } else {
        toast.error(err.message || 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    body {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .auth-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      position: relative;
      overflow: hidden;
    }

    .auth-page::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Ccircle cx="1" cy="1" r="1" fill="rgba(0,0,0,0.1)"/%3E%3C/svg%3E');
      background-size: 20px 20px;
      opacity: 0.5;
      z-index: 0;
    }

    .auth-form {
      background: #ffffff;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      z-index: 1;
    }

    .auth-form h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333333;
      margin-bottom: 20px;
      text-align: center;
    }

    .auth-tabs {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .auth-tab {
      padding: 10px 20px;
      font-size: 1rem;
      font-weight: 500;
      color: #666666;
      background: #e6e6e6;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      transition: background 0.3s, color 0.3s;
      margin: 0 5px;
    }

    .auth-tab.active {
      background: #34D399;
      color: #ffffff;
    }

    .auth-tab:hover {
      background: #d5d5d5;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group input {
      width: 100%;
      padding: 12px;
      font-size: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-family: 'Poppins', sans-serif;
      outline: none;
      transition: border-color 0.3s;
    }

    .form-group input:focus {
      border-color: #34D399;
    }

    .form-group input:disabled {
      background: #f0f0f0;
      cursor: not-allowed;
    }

    .forgot-password {
      display: block;
      text-align: right;
      font-size: 0.9rem;
      color: #34D399;
      text-decoration: none;
      margin-bottom: 20px;
    }

    .forgot-password:hover {
      text-decoration: underline;
    }

    .auth-button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(90deg, #34D399 0%, #059669 100%);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    .auth-button:hover {
      background: linear-gradient(90deg, #059669 0%, #34D399 100%);
    }

    .auth-button:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }

    .signup-link {
      text-align: center;
      margin-top: 20px;
      font-size: 0.9rem;
      color: #666666;
    }

    .signup-link a {
      color: #34D399;
      text-decoration: none;
      font-weight: 500;
    }

    .signup-link a:hover {
      text-decoration: underline;
    }

    .social-login {
      margin-top: 30px;
      text-align: center;
    }

    .social-login p {
      font-size: 0.9rem;
      color: #666666;
      margin-bottom: 15px;
    }

    .social-icons {
      display: flex;
      justify-content: center;
      gap: 15px;
    }

    .social-icon {
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      font-size: 1.2rem;
      color: #ffffff;
      transition: transform 0.3s ease;
    }

    .social-icon:hover {
      transform: scale(1.1);
    }

    .social-icon:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .social-icon.facebook {
      background: #3b5998;
    }

    .social-icon.twitter {
      background: #1da1f2;
    }

    .social-icon.google {
      background: #db4a39;
    }

    @media (max-width: 768px) {
      .auth-page {
        padding: 20px;
      }

      .auth-form {
        padding: 20px;
      }

      .auth-form h2 {
        font-size: 1.3rem;
      }

      .auth-tab {
        padding: 8px 15px;
        font-size: 0.9rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="auth-page">
        <form className="auth-form" onSubmit={onSubmit}>
          <h2>Admin Login Form</h2>
          <div className="auth-tabs">
            <button type="button" className="auth-tab active">Login</button>
            <Link to="/admin/register">
              <button type="button" className="auth-tab">Signup</button>
            </Link>
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Email Address"
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Password"
              required
              disabled={isLoading}
            />
          </div>
          <Link to="#" className="forgot-password">
            Forget password?
          </Link>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'LOGIN NOW'}
          </button>
          <div className="signup-link">
            Not a member? <Link to="/admin/register">Signup now</Link>
          </div>
          <div className="social-login">
            <p>Login with social</p>
            <div className="social-icons">
              <button className="social-icon facebook" aria-label="Login with Facebook" disabled={isLoading}>
                <FontAwesomeIcon icon={faFacebookF} />
              </button>
              <button className="social-icon twitter" aria-label="Login with Twitter" disabled={isLoading}>
                <FontAwesomeIcon icon={faTwitter} />
              </button>
              <button className="social-icon google" aria-label="Login with Google" disabled={isLoading}>
                <FontAwesomeIcon icon={faGoogle} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminLogin;