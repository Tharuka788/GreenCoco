import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faCheckCircle,
  faSpinner,
  faMoneyBillWave,
  faSearch,
  faEdit,
  faTrash,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

const AdminOrders = () => {
  const [orderData, setOrderData] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    orders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get('http://localhost:5000/api/admin/orders', config);
      setOrderData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching order data:', error);
      toast.error('Failed to fetch order data');
      setIsLoading(false);
    }
  };

  const handleEdit = (orderId) => {
    // Implement edit functionality
    console.log('Edit order:', orderId);
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        await axios.delete(`http://localhost:5000/api/admin/orders/${orderId}`, config);
        toast.success('Order deleted successfully');
        fetchOrderData();
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('Failed to delete order');
      }
    }
  };

  const filteredOrders = orderData.orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      default:
        return 'status-default';
    }
  };

  const styles = `
    .admin-orders {
      padding: 2rem;
      margin-left: 280px;
    }

    .orders-header {
      margin-bottom: 2rem;
    }

    .orders-title {
      font-size: 2rem;
      color: #2a7458;
      margin-bottom: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .stat-icon {
      font-size: 1.5rem;
      color: #2a7458;
    }

    .stat-title {
      font-size: 1.1rem;
      color: #666;
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: 600;
      color: #2a7458;
    }

    .orders-content {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .search-bar {
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #f8f9fa;
      padding: 0.5rem 1rem;
      border-radius: 8px;
    }

    .search-bar input {
      flex: 1;
      border: none;
      background: none;
      padding: 0.5rem;
      font-size: 1rem;
      color: #333;
      outline: none;
    }

    .search-icon {
      color: #666;
    }

    .add-button {
      background: #2a7458;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.3s ease;
      font-size: 1rem;
    }

    .add-button:hover {
      background: #1e5c41;
    }

    .orders-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .orders-table th,
    .orders-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .orders-table th {
      background: #f8f9fa;
      color: #2a7458;
      font-weight: 600;
    }

    .orders-table tr:hover {
      background: #f8f9fa;
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .status-completed {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status-pending {
      background: #fff3e0;
      color: #f57c00;
    }

    .status-processing {
      background: #e3f2fd;
      color: #1976d2;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .action-button {
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .edit-button {
      color: #2196f3;
    }

    .edit-button:hover {
      color: #1976d2;
    }

    .delete-button {
      color: #f44336;
    }

    .delete-button:hover {
      color: #d32f2f;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
      font-size: 1.2rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .admin-orders {
        margin-left: 0;
        padding: 1rem;
      }

      .orders-title {
        font-size: 1.5rem;
      }

      .stat-card {
        padding: 1rem;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .orders-table {
        font-size: 0.9rem;
      }

      .orders-table th,
      .orders-table td {
        padding: 0.75rem 0.5rem;
      }

      .add-button {
        padding: 0.5rem 1rem;
      }
    }
  `;

  if (isLoading) {
    return (
      <>
        <style>{styles}</style>
        <AdminNavbar />
        <div className="admin-orders">
          <div className="loading">Loading order data...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <AdminNavbar />
      <div className="admin-orders">
        <div className="orders-header">
          <h1 className="orders-title">Order Management</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faShoppingCart} className="stat-icon" />
              <h3 className="stat-title">Total Orders</h3>
            </div>
            <p className="stat-value">{orderData.totalOrders}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faCheckCircle} className="stat-icon" />
              <h3 className="stat-title">Completed Orders</h3>
            </div>
            <p className="stat-value">{orderData.completedOrders}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faSpinner} className="stat-icon" />
              <h3 className="stat-title">Pending Orders</h3>
            </div>
            <p className="stat-value">{orderData.pendingOrders}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faMoneyBillWave} className="stat-icon" />
              <h3 className="stat-title">Total Revenue</h3>
            </div>
            <p className="stat-value">${orderData.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="orders-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search by order number, customer name, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-button">
              <FontAwesomeIcon icon={faPlus} />
              Add Order
            </button>
          </div>

          <table className="orders-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.customerName}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>${order.totalAmount.toLocaleString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-button edit-button"
                        onClick={() => handleEdit(order._id)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDelete(order._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminOrders; 