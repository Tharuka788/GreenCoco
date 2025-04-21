import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddOrder = () => {
  const navigate = useNavigate();
  const [newOrder, setNewOrder] = useState({
    productName: '',
    quantity: '',
    amount: '',
    address: '',
    phoneNumber: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!newOrder.productName) {
      newErrors.productName = 'Product Name is required';
    }

    if (!newOrder.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (newOrder.quantity <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }

    if (!newOrder.amount) {
      newErrors.amount = 'Amount is required';
    } else if (newOrder.amount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!newOrder.address) {
      newErrors.address = 'Address is required';
    }

    if (!newOrder.phoneNumber) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(newOrder.phoneNumber)) {
      newErrors.phoneNumber = 'Phone Number must be 10 digits';
    }

    if (!newOrder.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newOrder.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/orders', newOrder);
      alert('Order placed successfully!');
      navigate('/orders'); // Navigate back to Orders Dashboard
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });

    // Clear error for the field being edited
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const addOrderStyles = `
    .add-order-page {
      font-family: 'Poppins', sans-serif;
      padding: 80px 20px 20px;
      background: #F5F7FA;
      min-height: 100vh;
      display: flex;
      justify-content: center;
    }

    .add-order-section {
      background: #ffffff;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      width: 100%;
    }

    .add-order-section h2 {
      font-size: 1.8rem;
      color: #1A2526;
      margin-bottom: 25px;
      text-align: center;
      font-weight: 600;
    }

    .order-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      color: #1A2526;
      font-size: 0.95rem;
      margin-bottom: 5px;
      font-weight: 500;
    }

    .form-group input {
      padding: 12px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: #007AFF;
      box-shadow: 0 0 5px rgba(0, 122, 255, 0.3);
    }

    .form-group input.invalid {
      border-color: #FF3B30;
    }

    .error-message {
      color: #FF3B30;
      font-size: 0.85rem;
      margin-top: 5px;
      min-height: 20px;
    }

    .button-group {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 20px;
    }

    .order-form button {
      padding: 12px 25px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: background 0.3s ease, transform 0.1s ease;
    }

    .order-form button.submit {
      background: #007AFF;
      color: #ffffff;
    }

    .order-form button.cancel {
      background: #FF3B30;
      color: #ffffff;
    }

    .order-form button:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }

    .order-form button:active {
      transform: translateY(0);
    }

    @media (max-width: 768px) {
      .add-order-page {
        padding: 60px 15px 15px;
      }

      .add-order-section {
        padding: 20px;
      }

      .add-order-section h2 {
        font-size: 1.5rem;
      }

      .form-group label {
        font-size: 0.9rem;
      }

      .form-group input {
        font-size: 0.9rem;
        padding: 10px;
      }

      .error-message {
        font-size: 0.8rem;
      }

      .order-form button {
        font-size: 0.9rem;
        padding: 10px 20px;
      }
    }

    @media (max-width: 480px) {
      .add-order-section {
        padding: 15px;
      }

      .add-order-section h2 {
        font-size: 1.3rem;
      }

      .form-group input {
        font-size: 0.85rem;
      }

      .button-group {
        flex-direction: column;
      }

      .order-form button {
        width: 100%;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: addOrderStyles }} />
      <div className="add-order-page">
        <div className="add-order-section">
          <h2>Add New Order</h2>
          <form className="order-form" onSubmit={handleOrderSubmit}>
            <div className="form-group">
              <label>Product Name:</label>
              <input
                type="text"
                name="productName"
                value={newOrder.productName}
                onChange={handleInputChange}
                className={errors.productName ? 'invalid' : ''}
                required
              />
              <div className="error-message">{errors.productName || ''}</div>
            </div>
            <div className="form-group">
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={newOrder.quantity}
                onChange={handleInputChange}
                className={errors.quantity ? 'invalid' : ''}
                required
              />
              <div className="error-message">{errors.quantity || ''}</div>
            </div>
            <div className="form-group">
              <label>Amount (Rs.):</label>
              <input
                type="number"
                name="amount"
                value={newOrder.amount}
                onChange={handleInputChange}
                className={errors.amount ? 'invalid' : ''}
                required
              />
              <div className="error-message">{errors.amount || ''}</div>
            </div>
            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={newOrder.address}
                onChange={handleInputChange}
                className={errors.address ? 'invalid' : ''}
                required
              />
              <div className="error-message">{errors.address || ''}</div>
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={newOrder.phoneNumber}
                onChange={handleInputChange}
                className={errors.phoneNumber ? 'invalid' : ''}
                required
              />
              <div className="error-message">{errors.phoneNumber || ''}</div>
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={newOrder.email}
                onChange={handleInputChange}
                className={errors.email ? 'invalid' : ''}
                required
              />
              <div className="error-message">{errors.email || ''}</div>
            </div>
            <div className="button-group">
              <button type="submit" className="submit">Place Order</button>
              <button
                type="button"
                className="cancel"
                onClick={() => navigate('/orders')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddOrder;