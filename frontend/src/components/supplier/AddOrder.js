import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faInfoCircle, faShoppingCart, faMapMarkerAlt, faPhone, faEnvelope, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import MainNavbar from '../Home/MainNavbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Create a custom event for order updates
export const ORDER_PLACED_EVENT = 'orderPlaced';

const AddOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    wasteType: '',
    quantity: '',
    amount: '',
    address: '',
    phoneNumber: '',
    email: ''
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

    if (!formData.wasteType) {
      newErrors.wasteType = 'Waste Type is required';
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
    let newValue = value;
    if (name === 'quantity' || name === 'amount') {
      // Only allow numbers and a single decimal point
      newValue = value.replace(/[^0-9.]/g, '');
      newValue = newValue.replace(/(\..*)\./g, '$1');
    } else if (name === 'phoneNumber') {
      // Only allow numbers, max 10 digits
      newValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    }
    setFormData({ ...formData, [name]: newValue });
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
      
      // Dispatch custom event when order is placed successfully
      const orderPlacedEvent = new CustomEvent(ORDER_PLACED_EVENT, {
        detail: response.data
      });
      window.dispatchEvent(orderPlacedEvent);

      setFormData({
        wasteType: '',
        quantity: '',
        amount: '',
        address: '',
        phoneNumber: '',
        email: ''
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

  const generateOrderPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Order Confirmation', 14, 20);

    doc.setFontSize(12);
    doc.text(`Waste Type: ${formData.wasteType}`, 14, 40);
    doc.text(`Quantity: ${formData.quantity}`, 14, 50);
    doc.text(`Amount: Rs. ${formData.amount}`, 14, 60);
    doc.text(`Address: ${formData.address}`, 14, 70);
    doc.text(`Phone Number: ${formData.phoneNumber}`, 14, 80);
    doc.text(`Email: ${formData.email}`, 14, 90);

    doc.save('order-confirmation.pdf');
  };

  const styles = `
    .add-order-container {
      margin-top: 80px;
      padding: 20px;
      min-height: 100vh;
      background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
      font-family: 'Segoe UI', Arial, sans-serif;
      animation: fadeIn 1s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .add-order-form {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 18px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      position: relative;
      overflow: hidden;
      border: 3px solid;
      border-image: linear-gradient(135deg, #26a69a 0%, #b2ebf2 100%) 1;
      animation: formPop 0.8s cubic-bezier(.68,-0.55,.27,1.55);
    }

    @keyframes formPop {
      0% { transform: scale(0.95); }
      100% { transform: scale(1); }
    }

    .add-order-form h1 {
      text-align: center;
      color: #00695c;
      margin-bottom: 25px;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .section-divider {
      border: none;
      border-top: 2px dashed #b2ebf2;
      margin: 24px 0 18px 0;
    }

    .form-section-title {
      color: #009688;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
      margin-top: 10px;
      letter-spacing: 0.5px;
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
      font-size: 15px;
    }

    .form-group label svg {
      margin-right: 8px;
      color: #26a69a;
    }

    .form-description {
      font-size: 12px;
      color: #78909c;
      margin-bottom: 4px;
      margin-left: 2px;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 10px 40px 10px 12px;
      border: 2px solid #b0bec5;
      border-radius: 6px;
      font-size: 15px;
      background: #f5f5f5;
      transition: all 0.3s cubic-bezier(.68,-0.55,.27,1.55);
      box-shadow: 0 1px 2px rgba(38,166,154,0.04);
      outline: none;
    }

    .form-group input:focus,
    .form-group select:focus {
      border-color: #26a69a;
      background: #e0f7fa;
      box-shadow: 0 0 8px rgba(38, 166, 154, 0.18);
      transform: scale(1.01);
    }

    .form-group select {
      background: #f5f5f5 url('data:image/svg+xml;utf8,<svg fill="%2326a69a" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat right 12px center/20px 20px;
      appearance: none;
      cursor: pointer;
    }

    .form-group option {
      background: #fff;
      color: #004d40;
      font-size: 15px;
    }

    .form-error {
      color: #d32f2f;
      font-size: 13px;
      margin-top: 5px;
      display: block;
      background: #ffebee;
      padding: 4px 8px;
      border-radius: 4px;
      margin-left: 2px;
      animation: fadeIn 0.5s;
    }

    .submit-btn, .cancel-btn {
      padding: 12px 28px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 17px;
      font-weight: 600;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(.68,-0.55,.27,1.55);
      margin: 5px;
      box-shadow: 0 2px 8px rgba(38,166,154,0.08);
    }

    .submit-btn {
      background: linear-gradient(90deg, #26a69a 0%, #00796b 100%);
      color: white;
    }

    .cancel-btn {
      background: linear-gradient(90deg, #d32f2f 0%, #ff5252 100%);
      color: white;
    }

    .submit-btn:hover, .cancel-btn:hover {
      transform: translateY(-2px) scale(1.04);
      box-shadow: 0 6px 18px rgba(38, 166, 154, 0.18);
      filter: brightness(1.08);
    }

    .submit-btn:disabled {
      background: #b0bec5;
      cursor: not-allowed;
      filter: grayscale(0.5);
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
      font-size: 15px;
      animation: fadeIn 0.5s;
    }

    .success {
      color: #2e7d32;
      text-align: center;
      margin-bottom: 15px;
      background: #e8f5e9;
      padding: 10px;
      border-radius: 4px;
      font-size: 15px;
      animation: fadeIn 0.5s;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #eceff1;
      border-radius: 4px;
      margin-bottom: 20px;
      overflow: hidden;
      position: relative;
    }

    .progress-label {
      position: absolute;
      right: 10px;
      top: -22px;
      font-size: 12px;
      color: #009688;
      font-weight: 600;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #26a69a 0%, #b2ebf2 100%);
      transition: width 0.3s cubic-bezier(.68,-0.55,.27,1.55);
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
      margin-top: 10px;
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
            <span className="progress-label">{Math.round(formProgress)}%</span>
          </div>

          {errors.submit && <div className="error">{errors.submit}</div>}
          {success && <div className="success">{success}</div>}
          {success && (
            <button
              type="button"
              className="submit-btn"
              onClick={generateOrderPDF}
              style={{ marginTop: '10px' }}
            >
              Download Order Confirmation PDF
            </button>
          )}

          <div className="form-section-title">Order Details</div>
          <div className="form-group">
            <label htmlFor="wasteType">
              <FontAwesomeIcon icon={faRecycle} /> Waste Type
              <div className="tooltip">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="tooltip-text">Select the type of coconut waste product to order.</span>
              </div>
            </label>
            <div className="form-description">Choose the coconut waste category for your order.</div>
            <select
              id="wasteType"
              name="wasteType"
              value={formData.wasteType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Waste Type</option>
              <option value="CoconutHusk">Coconut Husk</option>
              <option value="CoconutShell">Coconut Shell</option>
              <option value="CoconutFiber">Coconut Fiber</option>
              <option value="CoconutPith">Coconut Pith</option>
              <option value="CoconutLeaves">Coconut Leaves</option>
              <option value="CoconutTrunk">Coconut Trunk</option>
            </select>
            {errors.wasteType && <span className="form-error">{errors.wasteType}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="quantity">
              <FontAwesomeIcon icon={faShoppingCart} /> Quantity
              <div className="tooltip">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="tooltip-text">Enter the number of items ordered (positive number).</span>
              </div>
            </label>
            <div className="form-description">How many units do you want to order?</div>
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

          <hr className="section-divider" />

          <div className="form-section-title">Payment & Contact</div>
          <div className="form-group">
            <label htmlFor="amount">
              <FontAwesomeIcon icon={faMoneyBillWave} /> Amount (Rs.)
              <div className="tooltip">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="tooltip-text">Enter the total amount in Rupees (positive number).</span>
              </div>
            </label>
            <div className="form-description">Total price for your order.</div>
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
            <div className="form-description">Where should we deliver your order?</div>
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
            <div className="form-description">Your contact number for delivery updates.</div>
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
            <div className="form-description">We'll send your order confirmation here.</div>
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