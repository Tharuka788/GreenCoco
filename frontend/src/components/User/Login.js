import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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

    // Client-side validation
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      toast.success('Login successful!');
      // Store the token (for now, we'll just log it; in a real app, you'd store it in localStorage or context)
      console.log('Token:', res.data.token);
      // Redirect to a dashboard or homepage after login
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .login-page {
      margin-top: 80px;
      padding: 40px;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e6f0ea 100%);
      font-family: 'Poppins', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .login-form {
      background: #fff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .login-form h2 {
      font-size: 1.8rem;
      font-weight: 600;
      color: #2a7458;
      text-align: center;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      font-size: 0.9rem;
      color: #5e6d55;
      margin-bottom: 5px;
    }

    .form-group input {
      width: 100%;
      padding: 10px;
      font-size: 1rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-family: 'Poppins', sans-serif;
      outline: none;
      transition: border-color 0.3s;
    }

    .form-group input:focus {
      border-color: #2a7458;
    }

    .login-button {
      width: 100%;
      padding: 12px;
      background-color: #2a7458;
      color: #fff;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .login-button:hover {
      background-color: #1e5c45;
    }

    @media (max-width: 768px) {
      .login-page {
        padding: 20px;
        margin-top: 120px;
      }

      .login-form {
        padding: 20px;
      }

      .login-form h2 {
        font-size: 1.5rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="login-page">
        <form className="login-form" onSubmit={onSubmit}>
          <h2>Login</h2>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;