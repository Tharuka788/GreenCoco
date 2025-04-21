import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const OrdersDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders');
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderUpdate = async (id) => {
    const updatedStatus = prompt('Enter new status for the order (e.g., Delivered, Pending, Cancelled):');
    if (updatedStatus) {
      try {
        const response = await axios.put(`http://localhost:5000/api/orders/${id}`, { status: updatedStatus });
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
      return acc;
    },
    { new: 0, delivered: 0, cancelled: 0 }
  );

  // Include "On Delivery" as a category (mocking it for now since it's not in the backend schema)
  const onDeliveryCount = orders.filter((order) => order.status === 'On Delivery').length || 0;

  const pieChartData = {
    labels: ['New Orders', 'On Delivery', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: [statusCounts.new, onDeliveryCount, statusCounts.delivered, statusCounts.cancelled],
        backgroundColor: ['#34C759', '#FF9500', '#007AFF', '#FF3B30'],
        hoverBackgroundColor: ['#2DB44A', '#E68600', '#0066CC', '#E62E26'],
      },
    ],
  };

  const dashboardStyles = `
    .orders-dashboard {
      font-family: 'Poppins', sans-serif;
      padding: 80px 20px 20px;
      background: #F5F7FA;
      min-height: 100vh;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .dashboard-header h1 {
      font-size: 2rem;
      color: #1A2526;
    }

    .dashboard-section {
      background: #ffffff;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .dashboard-section h2 {
      font-size: 1.3rem;
      color: #1A2526;
      margin-bottom: 15px;
    }

    .new-order-button {
      padding: 10px 20px;
      background: #007AFF;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s ease;
    }

    .new-order-button:hover {
      background: #0066CC;
    }

    .orders-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .orders-table th, .orders-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #E5E7EB;
    }

    .orders-table th {
      background: #F9FAFB;
      color: #6B7280;
      font-size: 0.9rem;
      text-transform: uppercase;
    }

    .orders-table td {
      color: #1A2526;
    }

    .orders-table button {
      padding: 5px 10px;
      margin-right: 5px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background 0.3s ease;
    }

    .orders-table button.update {
      background: #34C759;
      color: #ffffff;
    }

    .orders-table button.delete {
      background: #FF3B30;
      color: #ffffff;
    }

    .orders-table button:hover {
      opacity: 0.9;
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

    @media (max-width: 768px) {
      .dashboard-header h1 {
        font-size: 1.5rem;
      }

      .dashboard-section {
        padding: 15px;
      }

      .dashboard-section h2 {
        font-size: 1.2rem;
      }

      .new-order-button {
        font-size: 0.9rem;
        padding: 8px 15px;
      }

      .orders-table {
        font-size: 0.85rem;
      }

      .orders-table th, .orders-table td {
        padding: 8px;
      }

      .orders-table button {
        padding: 4px 8px;
        font-size: 0.8rem;
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

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: dashboardStyles }} />
      <div className="orders-dashboard">
        <div className="dashboard-header">
          <h1>Orders Dashboard</h1>
          <button
            className="new-order-button"
            onClick={() => navigate('/orders/add')}
          >
            New Order
          </button>
        </div>

        {/* Orders Summary with Pie Chart */}
        <div className="dashboard-section">
          <h2>Orders Summary</h2>
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
                On Delivery: {onDeliveryCount}
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
                      Update
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleOrderDelete(order._id)}
                    >
                      Delete
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