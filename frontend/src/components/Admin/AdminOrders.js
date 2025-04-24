import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faCheckCircle,
  faClock,
  faSearch,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [ordersData, setOrdersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrdersData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const response = await axios.get('http://localhost:5000/api/admins/orders', config);
      setOrdersData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders data:', error);
      toast.error('Failed to fetch orders data');
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      await axios.put(
        `http://localhost:5000/api/admins/orders/${orderId}`,
        { status: newStatus },
        config
      );
      toast.success('Order status updated successfully');
      fetchOrdersData();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        };
        await axios.delete(`http://localhost:5000/api/admins/orders/${orderId}`, config);
        toast.success('Order deleted successfully');
        fetchOrdersData();
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('Failed to delete order');
      }
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  if (loading || !ordersData) {
    return <div>Loading...</div>;
  }

  const { stats, orders } = ordersData;

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>${order.totalAmount.toLocaleString()}</td>
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

      <style jsx>{`
        .admin-orders {
          padding: 2rem;
        }

        h1 {
          margin-bottom: 2rem;
          color: #2c3e50;
        }

        .order-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
        }

        .icon {
          font-size: 2rem;
          margin-right: 1rem;
          color: #3498db;
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
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
          border-radius: 5px;
          font-size: 1rem;
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        th {
          background-color: #f8f9fa;
          color: #2c3e50;
        }

        .status-select {
          padding: 0.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .status-select.pending {
          background-color: #fff3e0;
          color: #ef6c00;
        }

        .status-select.processing {
          background-color: #e3f2fd;
          color: #1976d2;
        }

        .status-select.completed {
          background-color: #e8f5e9;
          color: #2e7d32;
        }

        .status-select.cancelled {
          background-color: #ffebee;
          color: #c62828;
        }

        .action-btn {
          padding: 0.5rem;
          margin: 0 0.25rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .action-btn.delete {
          background-color: #ffebee;
          color: #c62828;
        }

        .action-btn:hover {
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .admin-orders {
            padding: 1rem;
          }

          .order-stats {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 1rem;
          }

          th, td {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOrders; 