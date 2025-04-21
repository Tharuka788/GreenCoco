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

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/orders', newOrder);
      alert('Order placed successfully!');
      navigate('/orders'); // Navigate back to Orders Dashboard
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order.');
    }
  };

  const handleInputChange = (e, setState, state) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const addOrderStyles = `
    .add-order-page {
      font-family: 'Poppins', sans-serif;
      padding: 80px 20px 20px;
      background: #F5F7FA;
      min-height: 100vh;
    }

    .add-order-section {
      background: #ffffff;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      max-width: 600px;
      margin: 0 auto;
    }

    .add-order-section h2 {
      font-size: 1.5rem;
      color: #1A2526;
      margin-bottom: 20px;
      text-align: center;
    }

    .order-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .order-form label {
      display: flex;
      flex-direction: column;
      color: #1A2526;
      font-size: 0.95rem;
    }

    .order-form input {
      padding: 10px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      font-size: 1rem;
      margin-top: 5px;
    }

    .order-form input:focus {
      outline: none;
      border-color: #007AFF;
      box-shadow: 0 0 5px rgba(0, 122, 255, 0.3);
    }

    .order-form button {
      padding: 10px;
      background: #007AFF;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s ease;
    }

    .order-form button:hover {
      background: #0066CC;
    }

    @media (max-width: 768px) {
      .add-order-section {
        padding: 15px;
      }

      .add-order-section h2 {
        font-size: 1.3rem;
      }

      .order-form input {
        font-size: 0.9rem;
      }

      .order-form button {
        font-size: 0.9rem;
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
            <label>
              Product Name:
              <input
                type="text"
                name="productName"
                value={newOrder.productName}
                onChange={(e) => handleInputChange(e, setNewOrder, newOrder)}
                required
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                value={newOrder.quantity}
                onChange={(e) => handleInputChange(e, setNewOrder, newOrder)}
                required
              />
            </label>
            <label>
              Amount (Rs.):
              <input
                type="number"
                name="amount"
                value={newOrder.amount}
                onChange={(e) => handleInputChange(e, setNewOrder, newOrder)}
                required
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={newOrder.address}
                onChange={(e) => handleInputChange(e, setNewOrder, newOrder)}
                required
              />
            </label>
            <label>
              Phone Number:
              <input
                type="text"
                name="phoneNumber"
                value={newOrder.phoneNumber}
                onChange={(e) => handleInputChange(e, setNewOrder, newOrder)}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={newOrder.email}
                onChange={(e) => handleInputChange(e, setNewOrder, newOrder)}
                required
              />
            </label>
            <button type="submit">Place Order</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddOrder;