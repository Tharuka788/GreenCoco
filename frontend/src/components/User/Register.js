import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    gender: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const { name, email, phoneNumber, gender, password, confirmPassword, role } = formData;
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phoneNumber || !gender || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (!['male', 'female', 'other'].includes(gender)) {
      toast.error('Please select a valid gender');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      toast.success('Registration successful! You can now log in.');
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        gender: '',
        password: '',
        confirmPassword: '',
        role: 'user',
      });
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .auth-container {
      display: flex;
      min-height: 100vh;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
    }

    .auth-image {
      flex: 1;
      background: url('/4.jpg') no-repeat center center;
      background-size: cover;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 40px;
      color: #ffffff;
    }

    .auth-form-container {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px;
      background: #ffffff;
    }

    .auth-form {
      width: 100%;
      max-width: 400px;
    }

    .auth-form h2 {
      font-size: 1.8rem;
      font-weight: 600;
      color: #333333;
      margin-bottom: 10px;
    }

    .auth-form p {
      font-size: 0.9rem;
      color: #666666;
      margin-bottom: 30px;
    }

    .auth-form .login-link {
      color: #c7d36f;
      text-decoration: none;
      font-weight: 500;
    }

    .auth-form .login-link:hover {
      text-decoration: underline;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-size: 0.9rem;
      color: #666666;
      margin-bottom: 5px;
      text-transform: uppercase;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 10px 0;
      font-size: 1rem;
      border: none;
      border-bottom: 1px solid #ddd;
      font-family: 'Poppins', sans-serif;
      outline: none;
      transition: border-color 0.3s;
    }

    .form-group input:focus,
    .form-group select:focus {
      border-bottom: 1px solid #c7d36f;
    }

    .auth-checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      font-size: 0.9rem;
      color: #666666;
    }

    .auth-button {
      width: 100%;
      padding: 12px;
      background-color: #2a7458;
      color: #ffffff;
      border: none;
      border-radius: 25px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .auth-button:hover {
      background-color:rgb(52, 143, 108);
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
      .auth-container {
        flex-direction: column;
      }

      .auth-image {
        min-height: 200px;
        padding: 20px;
      }

      .auth-form-container {
        padding: 20px;
      }

      .auth-form h2 {
        font-size: 1.5rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="auth-container">
        <div className="auth-image">
          {/* Removed the text since the image is now the focus */}
        </div>
        <div className="auth-form-container">
          <form className="auth-form" onSubmit={onSubmit}>
            <h2>Register</h2>
            <p>
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Sign in now
              </Link>
              , less than a minute.
            </p>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email ID</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone No</label>
              <input
                type="text"
                name="phoneNumber"
                value={phoneNumber}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={gender}
                onChange={onChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={role}
                onChange={onChange}
              >
                <option value="user">User</option>
                <option value="supplier">Supplier</option>
              </select>
            </div>
            <div className="auth-checkbox">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">Accept terms and conditions & privacy policy</label>
            </div>
            <button type="submit" className="auth-button">
              Register
            </button>
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
      </div>
    </>
  );
};

export default Register;