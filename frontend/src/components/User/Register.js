import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
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

    if (!['user', 'supplier'].includes(role)) {
      toast.error('Please select a valid role');
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .register-page {
      margin-top: 80px;
      padding: 40px;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e6f0ea 100%);
      font-family: 'Poppins', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .register-form {
      background: #fff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .register-form h2 {
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

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 10px;
      font-size: 1rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-family: 'Poppins', sans-serif;
      outline: none;
      transition: border-color 0.3s;
    }

    .form-group select {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background: url('data:image/svg+xml;utf8,<svg fill="gray" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')
        no-repeat right 10px center;
      background-size: 16px;
    }

    .form-group input:focus,
    .form-group select:focus {
      border-color: #2a7458;
    }

    .register-button {
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

    .register-button:hover {
      background-color: #1e5c45;
    }

    @media (max-width: 768px) {
      .register-page {
        padding: 20px;
        margin-top: 120px;
      }

      .register-form {
        padding: 20px;
      }

      .register-form h2 {
        font-size: 1.5rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="register-page">
        <form className="register-form" onSubmit={onSubmit}>
          <h2>Register</h2>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
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
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
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
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={onChange}
              required
            >
              <option value="user">User</option>
              <option value="supplier">Supplier</option>
            </select>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;