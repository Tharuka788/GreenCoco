import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faCheckCircle,
  faClock,
  faSearch,
  faEdit,
  faTrash,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

const AdminOrders = () => {
  const [ordersData, setOrdersData] = useState({
    stats: {
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0
    },
    orders: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      // Try all possible endpoints
      const endpoints = [
        'http://localhost:5000/api/admin/orders',
        'http://localhost:5000/api/orders',
        'http://localhost:5000/api/order'  // Some APIs might use singular form
      ];

      let lastError = null;
      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(endpoint, config);
          if (response.data) {
            // Transform data to expected format if needed
            const orders = Array.isArray(response.data) ? response.data : 
                          Array.isArray(response.data.orders) ? response.data.orders : [];
            
            const stats = response.data.stats || {
              totalOrders: orders.length,
              completedOrders: orders.filter(order => order.status === 'completed').length,
              pendingOrders: orders.filter(order => order.status === 'pending').length
            };

            setOrdersData({
              stats,
              orders
            });
            setLoading(false);
            return;
          }
        } catch (error) {
          console.log(`Failed to fetch from ${endpoint}:`, error.message);
          lastError = error;
          continue;
        }
      }

      // If we get here, all endpoints failed
      throw lastError || new Error('Failed to fetch orders data from all endpoints');

    } catch (error) {
      console.error('Error fetching orders data:', error);
      setError(error.response?.data?.message || 'Failed to fetch orders data');
      toast.error('Failed to fetch orders data. Please try again later.');
      setOrdersData({
        stats: {
          totalOrders: 0,
          completedOrders: 0,
          pendingOrders: 0
        },
        orders: []
      });
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const endpoints = [
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        `http://localhost:5000/api/orders/${orderId}`,
        `http://localhost:5000/api/order/${orderId}`
      ];

      let lastError = null;
      for (const endpoint of endpoints) {
        try {
          await axios.put(endpoint, { status: newStatus }, config);
          toast.success('Order status updated successfully');
          fetchOrdersData();
          return;
        } catch (error) {
          console.log(`Failed to update status using ${endpoint}:`, error.message);
          lastError = error;
          continue;
        }
      }

      throw lastError || new Error('Failed to update order status using all endpoints');

    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status. Please try again.');
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        };

        // Try primary endpoint first
        try {
          await axios.delete(`http://localhost:5000/api/admin/orders/${orderId}`, config);
        } catch (primaryError) {
          // If primary fails, try fallback
          await axios.delete(`http://localhost:5000/api/orders/${orderId}`, config);
        }

        toast.success('Order deleted successfully');
        fetchOrdersData();
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error(error.response?.data?.message || 'Failed to delete order. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-orders">
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
            <p>Loading orders data...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-orders">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={fetchOrdersData}>
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  const { stats, orders } = ordersData;

  const filteredOrders = orders.filter(order =>
    (String(order.orderNumber || '').toLowerCase()).includes(searchTerm.toLowerCase()) ||
    (String(order.customerName || '').toLowerCase()).includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminNavbar />
      <div className="admin-orders">
        <h1>Orders Management</h1>

        <div className="order-stats">
          <div className="stat-card">
            <FontAwesomeIcon icon={faShoppingCart} className="icon" />
            <div className="stat-content">
              <h3>Total Orders</h3>
              <p>{stats.totalOrders.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card">
            <FontAwesomeIcon icon={faCheckCircle} className="icon success" />
            <div className="stat-content">
              <h3>Completed Orders</h3>
              <p>{stats.completedOrders.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card">
            <FontAwesomeIcon icon={faClock} className="icon warning" />
            <div className="stat-content">
              <h3>Pending Orders</h3>
              <p>{stats.pendingOrders.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="orders-content">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search by order number or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td>{order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</td>
                    <td>${(order.totalAmount || 0).toLocaleString()}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`status-select ${order.status}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(order._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-orders {
          padding: 2rem;
          margin-left: 250px; /* Space for sidebar */
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        h1 {
          margin-bottom: 2rem;
          color: #2c3e50;
          font-size: 2rem;
          font-weight: 600;
        }

        .order-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .icon {
          font-size: 2rem;
          margin-right: 1rem;
          color: #3498db;
          width: 40px;
        }

        .icon.success {
          color: #2ecc71;
        }

        .icon.warning {
          color: #f1c40f;
        }

        .stat-content h3 {
          margin: 0;
          font-size: 1rem;
          color: #7f8c8d;
          font-weight: 500;
        }

        .stat-content p {
          margin: 0.5rem 0 0;
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
        }

        .orders-content {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .search-bar {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #7f8c8d;
        }

        input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52,152,219,0.1);
        }

        .table-container {
          overflow-x: auto;
          margin: 0 -1.5rem;
          padding: 0 1.5rem;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-bottom: 1rem;
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
          white-space: nowrap;
        }

        th {
          background-color: #f8f9fa;
          color: #2c3e50;
          font-weight: 600;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        tbody tr:hover {
          background-color: #f8f9fa;
        }

        .status-select {
          padding: 0.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          background-color: white;
          min-width: 120px;
        }

        .status-select.pending {
          background-color: #fff3e0;
          color: #ef6c00;
          border-color: #ef6c00;
        }

        .status-select.processing {
          background-color: #e3f2fd;
          color: #1976d2;
          border-color: #1976d2;
        }

        .status-select.completed {
          background-color: #e8f5e9;
          color: #2e7d32;
          border-color: #2e7d32;
        }

        .status-select.cancelled {
          background-color: #ffebee;
          color: #c62828;
          border-color: #c62828;
        }

        .action-btn {
          padding: 0.5rem;
          margin: 0 0.25rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
        }

        .action-btn.delete {
          color: #e74c3c;
        }

        .action-btn.delete:hover {
          background-color: #ffebee;
        }

        @media (max-width: 1024px) {
          .admin-orders {
            margin-left: 0;
            padding: 1rem;
          }

          .order-stats {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .stat-card {
            padding: 1rem;
          }

          .table-container {
            margin: 0 -1rem;
            padding: 0 1rem;
          }

          th, td {
            padding: 0.75rem 0.5rem;
            font-size: 0.875rem;
          }

          .status-select {
            min-width: 100px;
            padding: 0.4rem;
          }
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #2c3e50;
        }

        .loading-icon {
          font-size: 3rem;
          color: #3498db;
          margin-bottom: 1rem;
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          padding: 2rem;
          text-align: center;
        }

        .error-message {
          color: #e74c3c;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .retry-button {
          padding: 0.75rem 1.5rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s ease;
        }

        .retry-button:hover {
          background-color: #2980b9;
        }
      `}</style>
    </>
  );
};

export default AdminOrders; 