import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faInfoCircle, faShoppingCart, faMapMarkerAlt, faPhone, faEnvelope, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import MainNavbar from '../Home/MainNavbar'; // Assuming you have a similar navbar component

const AddOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    amount: '',
    address: '',
    phoneNumber: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  // Calculate form completion progress
  useEffect(() => {
    const fields = Object.values(formData);
    const filledFields = fields.filter(field => field !== '').length;
    const progress = (filledFields / fields.length) * 100;
    setFormProgress(progress);
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName) {
      newErrors.productName = 'Product Name is required';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.address) {
      newErrors.address = 'Address is required';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone Number must be 10 digits';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Sending order data:', formData);
      const response = await axios.post('http://localhost:5000/api/orders/', formData);
      console.log('Server response:', response.data);
      setSuccess('Order placed successfully!');
      setFormData({
        productName: '',
        quantity: '',
        amount: '',
        address: '',
        phoneNumber: '',
        email: '',
      });
      setTimeout(() => navigate('/orders'), 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = `
    .add-order-container {
      margin-top: 80px;
      padding: 20px;
      min-height: 100vh;
      background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
      font-family: 'Segoe UI', Arial, sans-serif;
    }

    .add-order-form {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      position: relative;
      overflow: hidden;
    }

    .add-order-form h1 {
      text-align: center;
      color: #00695c;
      margin-bottom: 25px;
      font-size: 24px;
      font-weight: 600;
    }

    .form-group {
      margin-bottom: 20px;
      position: relative;
    }

    .form-group label {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      color: #004d40;
      font-weight: 500;
    }

    .form-group label svg {
      margin-right: 8px;
      color: #26a69a;
    }

    .form-group input {
      width: 100%;
      padding: 10px 12px;
      border: 2px solid #b0bec5;
      border-radius: 6px;
      font-size: 14px;
      transition: all 0.3s ease;
      background: #f5f5f5;
    }

    .form-group input:focus {
      border-color: #26a69a;
      background: white;
      box-shadow: 0 0 8px rgba(38, 166, 154, 0.2);
      transform: scale(1.01);
    }

    .form-error {
      color: #d32f2f;
      font-size: 12px;
      margin-top: 5px;
      display: block;
    }

    .submit-btn, .cancel-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      margin: 5px;
    }

    .submit-btn {
      background: #00796b;
      color: white;
    }

    .cancel-btn {
      background: #d32f2f;
      color: white;
    }

    .submit-btn:hover, .cancel-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 150, 136, 0.3);
    }

    .submit-btn:disabled {
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

    .error {
      color: #d32f2f;
      text-align: center;
      margin-bottom: 15px;
      background: #ffebee;
      padding: 10px;
      border-radius: 4px;
    }

    .success {
      color: #2e7d32;
      text-align: center;
      margin-bottom: 15px;
      background: #e8f5e9;
      padding: 10px;
      border-radius: 4px;
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background: #eceff1;
      border-radius: 3px;
      margin-bottom: 20px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #26a69a;
      transition: width 0.3s ease;
    }

    .tooltip {
      position: relative;
      display: inline-block;
      margin-left: 8px;
    }

    .tooltip .tooltip-text {
      visibility: hidden;
      width: 200px;
      background: #37474f;
      color: white;
      text-align: center;
      padding: 8px;
      border-radius: 4px;
      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .tooltip:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }

    .button-group {
      display: flex;
      justify-content: center;
      gap: 10px;
    }

    @media (max-width: 768px) {
      .add-order-form {
        padding: 20px;
      }

      .add-order-container {
        margin-top: 120px;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <MainNavbar />
      <div className="add-order-container">
        <form className="add-order-form" onSubmit={handleOrderSubmit}>
          <h1>Add New Order</h1>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${formProgress}%` }}></div>
          </div>

          {errors.submit && <div className="error">{errors.submit}</div>}
          {success && <div className="success">{success}</div>}

          <div className="form-group">
            <label htmlFor="productName">
              <FontAwesomeIcon icon={faBox} /> Product Name
              <div className="tooltip">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="tooltip-text">Enter the name of the product being ordered.</span>
              </div>
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              required
            />
            {errors.productName && <span className="form-error">{errors.productName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="quantity">
              <FontAwesomeIcon icon={faShoppingCart} /> Quantity
              <div className="tooltip">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="tooltip-text">Enter the number of items ordered (positive number).</span>
              </div>
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              min="1"
            />
            {errors.quantity && <span className="form-error">{errors.quantity}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="amount">
              <FontAwesomeIcon icon={faMoneyBillWave} /> Amount (Rs.)
              <div className="tooltip">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="tooltip-text">Enter the total amount in Rupees (positive number).</span>
              </div>
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
            {errors.amount && <span className="form-error">{errors.amount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Address
              <div className="tooltip">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="tooltip-text">Enter the delivery address for the order.</span>
              </div>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            {errors.address && <span className="form-error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">
              <FontAwesomeIcon icon={faPhone} /> Phone Number
              <div className="tooltip">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="tooltip-text">Enter a 10-digit phone number.</span>
              </div>
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
            {errors.phoneNumber && <span className="form-error">{errors.phoneNumber}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FontAwesomeIcon icon={faEnvelope} /> Email
              <div className="tooltip">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="tooltip-text">Enter a valid email address for order confirmation.</span>
              </div>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="button-group">
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading-spinner"></span>
              ) : (
                'Place Order'
              )}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/orders')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddOrder;