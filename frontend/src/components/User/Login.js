import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      toast.success('Login successful!');
      localStorage.setItem('token', res.data.token);
      navigate('/finance');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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

    .auth-checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      font-size: 0.9rem;
      color: #666666;
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
          <h2>Login Form</h2>
          <div className="auth-tabs">
            <button type="button" className="auth-tab active">Login</button>
            <Link to="/register">
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
            />
          </div>
          <div className="auth-checkbox">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">Accept terms and conditions & privacy policy</label>
          </div>
          <Link to="#" className="forgot-password">
            Forget password?
          </Link>
          <button type="submit" className="auth-button">
            LOGIN NOW
          </button>
          <div className="signup-link">
            Not a member? <Link to="/register">Signup now</Link>
          </div>
          <div className="social-login">
            <p>Login with social</p>
            <div className="social-icons">
              <button className="social-icon facebook" aria-label="Login with Facebook">
                <FontAwesomeIcon icon={faFacebookF} />
              </button>
              <button className="social-icon twitter" aria-label="Login with Twitter">
                <FontAwesomeIcon icon={faTwitter} />
              </button>
              <button className="social-icon google" aria-label="Login with Google">
                <FontAwesomeIcon icon={faGoogle} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;