import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faChartPie } from '@fortawesome/free-solid-svg-icons';
import MainNavbar from '../Home/MainNavbar';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const OrdersDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders');
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderUpdate = async (id) => {
    const updatedStatus = prompt('Enter new status for the order (e.g., Delivered, Pending, Cancelled, On Delivery):');
    if (updatedStatus) {
      try {
        await axios.put(`http://localhost:5000/api/orders/${id}`, { status: updatedStatus });
        setOrders(
          orders.map((order) =>
            order._id === id ? { ...order, status: updatedStatus } : order
          )
        );
        alert('Order status updated successfully!');
      } catch (error) {
        console.error('Error updating order:', error);
        alert('Failed to update order.');
      }
    }
  };

  const handleOrderDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`http://localhost:5000/api/orders/${id}`);
        setOrders(orders.filter((order) => order._id !== id));
        alert('Order deleted successfully!');
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order.');
      }
    }
  };

  // Calculate data for the pie chart
  const statusCounts = orders.reduce(
    (acc, order) => {
      if (order.status === 'Pending') acc.new += 1;
      else if (order.status === 'Delivered') acc.delivered += 1;
      else if (order.status === 'Cancelled') acc.cancelled += 1;
      else if (order.status === 'On Delivery') acc.onDelivery += 1;
      return acc;
    },
    { new: 0, delivered: 0, cancelled: 0, onDelivery: 0 }
  );

  const pieChartData = {
    labels: ['New Orders', 'On Delivery', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: [statusCounts.new, statusCounts.onDelivery, statusCounts.delivered, statusCounts.cancelled],
        backgroundColor: ['#34C759', '#FF9500', '#007AFF', '#FF3B30'],
        hoverBackgroundColor: ['#2DB44A', '#E68600', '#0066CC', '#E62E26'],
      },
    ],
  };

  const handleNavigateToAddOrder = () => {
    console.log('New Order button clicked, navigating to /orders/add');
    try {
      navigate('/orders/add');
    } catch (err) {
      console.error('Navigation error:', err);
      alert('Failed to navigate to the order form. Please check the console for errors.');
    }
  };

  const styles = `
    .orders-dashboard-container {
      margin-top: 80px;
      padding: 20px;
      min-height: 100vh;
      background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
      font-family: 'Segoe UI', Arial, sans-serif;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      max-width: 1200px;
      margin: 0 auto 20px;
    }

    .dashboard-header h1 {
      color: #00695c;
      font-size: 24px;
      font-weight: 600;
    }

    .dashboard-section {
      max-width: 1200px;
      margin: 0 auto 20px;
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }

    .dashboard-section h2 {
      color: #004d40;
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }

    .dashboard-section h2 svg {
      margin-right: 8px;
      color: #26a69a;
    }

    .new-order-button {
      background: #00796b;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .new-order-button:hover {
      background: #009688;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 150, 136, 0.3);
    }

    .orders-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .orders-table th, .orders-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #b0bec5;
    }

    .orders-table th {
      background: #f5f5f5;
      color: #004d40;
      font-size: 14px;
      text-transform: uppercase;
    }

    .orders-table td {
      color: #37474f;
    }

    .orders-table button {
      padding: 8px 12px;
      margin-right: 5px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .orders-table button.update {
      background: #00796b;
      color: white;
    }

    .orders-table button.delete {
      background: #d32f2f;
      color: white;
    }

    .orders-table button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .orders-summary {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .pie-chart-container {
      width: 200px;
      height: 200px;
    }

    .status-legend {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #37474f;
    }

    .status-color {
      width: 20px;
      height: 10px;
      border-radius: 2px;
    }

    .status-color.new {
      background: #34C759;
    }

    .status-color.on-delivery {
      background: #FF9500;
    }

    .status-color.delivered {
      background: #007AFF;
    }

    .status-color.cancelled {
      background: #FF3B30;
    }

    .error-message {
      color: #d32f2f;
      text-align: center;
      margin: 20px 0;
      background: #ffebee;
      padding: 10px;
      border-radius: 4px;
    }

    .loading-message {
      text-align: center;
      color: #004d40;
      font-size: 16px;
      margin: 20px 0;
    }

    @media (max-width: 768px) {
      .orders-dashboard-container {
        margin-top: 120px;
        padding: 15px;
      }

      .dashboard-header h1 {
        font-size: 20px;
      }

      .dashboard-section {
        padding: 20px;
      }

      .dashboard-section h2 {
        font-size: 18px;
      }

      .new-order-button {
        font-size: 14px;
        padding: 8px 15px;
      }

      .orders-table {
        font-size: 12px;
      }

      .orders-table th, .orders-table td {
        padding: 8px;
      }

      .orders-table button {
        padding: 6px 10px;
        font-size: 12px;
      }

      .orders-summary {
        flex-direction: column;
        align-items: flex-start;
      }

      .pie-chart-container {
        width: 150px;
        height: 150px;
      }
    }
  `;

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <MainNavbar />
      <div className="orders-dashboard-container">
        <div className="dashboard-header">
          <h1>Orders Dashboard</h1>
          <button
            className="new-order-button"
            onClick={handleNavigateToAddOrder}
          >
            <FontAwesomeIcon icon={faPlus} /> New Order
          </button>
        </div>

        {/* Orders Summary with Pie Chart */}
        <div className="dashboard-section">
          <h2><FontAwesomeIcon icon={faChartPie} /> Orders Summary</h2>
          <div className="orders-summary">
            <div className="pie-chart-container">
              <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
            </div>
            <div className="status-legend">
              <div className="status-item">
                <span className="status-color new"></span>
                New Orders: {statusCounts.new}
              </div>
              <div className="status-item">
                <span className="status-color on-delivery"></span>
                On Delivery: {statusCounts.onDelivery}
              </div>
              <div className="status-item">
                <span className="status-color delivered"></span>
                Delivered: {statusCounts.delivered}
              </div>
              <div className="status-item">
                <span className="status-color cancelled"></span>
                Cancelled: {statusCounts.cancelled}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="dashboard-section">
          <h2>Recent Orders</h2>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Amount (Rs.)</th>
                <th>Address</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Status</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.productName}</td>
                  <td>{order.quantity}</td>
                  <td>{order.amount}</td>
                  <td>{order.address}</td>
                  <td>{order.phoneNumber}</td>
                  <td>{order.email}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="update"
                      onClick={() => handleOrderUpdate(order._id)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Update
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleOrderDelete(order._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
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

export default OrdersDashboard;