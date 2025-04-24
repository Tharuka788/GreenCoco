import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:5000/api/admins/login', formData);
      
      if (!res.data.token) {
        throw new Error('No token received from server');
      }

      // Store the token
      localStorage.setItem('token', res.data.token);

      // Verify the token contains admin role
      const tokenPayload = JSON.parse(atob(res.data.token.split('.')[1]));
      if (tokenPayload.role !== 'admin') {
        throw new Error('Invalid role in token');
      }

      toast.success('Admin login successful!');
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      localStorage.removeItem('token'); // Clear token on error
      
      if (err.response) {
        const message = err.response.data.message || 'Admin login failed';
        setError(message);
        toast.error(message);
      } else if (err.request) {
        setError('Server not responding. Please try again later.');
        toast.error('Server not responding. Please try again later.');
      } else {
        setError(err.message || 'An unexpected error occurred');
        toast.error(err.message || 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .admin-login {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #e6f0ea 100%);
      padding: 20px;
      font-family: 'Poppins', sans-serif;
    }

    .login-container {
      background: #ffffff;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .login-header h1 {
      color: #2a7458;
      font-size: 2rem;
      margin-bottom: 10px;
    }

    .login-header p {
      color: #666;
      font-size: 0.9rem;
    }

    .form-group {
      margin-bottom: 20px;
      position: relative;
    }

    .form-group input {
      width: 100%;
      padding: 12px 40px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-group input:focus {
      border-color: #2a7458;
      outline: none;
      box-shadow: 0 0 0 3px rgba(42, 116, 88, 0.1);
    }

    .form-group .icon {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }

    .error-message {
      color: #ff4f5d;
      font-size: 0.9rem;
      margin-top: 5px;
    }

    .login-button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #2a7458 0%, #3b9c73 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .login-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(42, 116, 88, 0.3);
    }

    .login-button:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .register-link {
      text-align: center;
      margin-top: 20px;
      font-size: 0.9rem;
      color: #666;
    }

    .register-link a {
      color: #2a7458;
      text-decoration: none;
      font-weight: 600;
    }

    .register-link a:hover {
      text-decoration: underline;
    }

    .spinner {
      border: 2px solid #ffffff;
      border-top: 2px solid transparent;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 30px;
      }

      .login-header h1 {
        font-size: 1.8rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="admin-login">
        <div className="login-container">
          <div className="login-header">
            <h1>Admin Login</h1>
            <p>Access your admin dashboard</p>
          </div>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
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
              <FontAwesomeIcon icon={faLock} className="icon" />
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
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faUser} />
                  Login
                </>
              )}
            </button>
          </form>
          <div className="register-link">
            Don't have an account? <Link to="/admin/register">Register here</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin; 