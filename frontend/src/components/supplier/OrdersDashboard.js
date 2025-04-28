import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faChartPie, faSearch, faCalendar, faMoneyBill, faBoxes } from '@fortawesome/free-solid-svg-icons';
import MainNavbar from '../Home/MainNavbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const OrdersDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
    averageOrderValue: 0,
    totalQuantity: 0
  });
  const ordersPerPage = 10;

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders');
        const ordersData = response.data;
        setOrders(ordersData);
        
        // Calculate order statistics
        const stats = ordersData.reduce((acc, order) => {
          acc.totalOrders++;
          acc.totalAmount += order.amount;
          acc.totalQuantity += order.quantity;
          return acc;
        }, { totalOrders: 0, totalAmount: 0, totalQuantity: 0 });
        
        stats.averageOrderValue = stats.totalAmount / stats.totalOrders;
        setOrderStats(stats);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search term and date range
  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.wasteType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phoneNumber?.includes(searchTerm) ||
        order.status?.toLowerCase().includes(searchTerm.toLowerCase());

      const orderDate = new Date(order.createdAt);
      const matchesDateRange = 
        (!dateRange.start || orderDate >= new Date(dateRange.start)) &&
        (!dateRange.end || orderDate <= new Date(dateRange.end));

      return matchesSearch && matchesDateRange;
    });
  }, [orders, searchTerm, dateRange]);

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortedOrders = React.useMemo(() => {
    const sortedData = [...filteredOrders];
    if (sortConfig.key) {
      sortedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedData;
  }, [filteredOrders, sortConfig]);

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateRange]);

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-badge delivered';
      case 'pending':
        return 'status-badge pending';
      case 'cancelled':
        return 'status-badge cancelled';
      case 'on delivery':
        return 'status-badge on-delivery';
      default:
        return 'status-badge';
    }
  };

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

  // Minimal working PDF generator for each order
  const generateOrderPDF = () => {
    const doc = new jsPDF();
    doc.text('Test PDF', 10, 10);
    doc.autoTable({
      head: [['Col1', 'Col2']],
      body: [['A', 'B']],
    });
    doc.save('test.pdf');
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
      cursor: pointer;
      user-select: none;
      position: relative;
    }

    .orders-table th:hover {
      background: #e0e0e0;
    }

    .orders-table th::after {
      content: '';
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
    }

    .orders-table th[data-sort='asc']::after {
      content: '▲';
      font-size: 12px;
    }

    .orders-table th[data-sort='desc']::after {
      content: '▼';
      font-size: 12px;
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
      flex-direction: column;
      align-items: center;
      gap: 30px;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .chart-container {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
      position: relative;
    }

    .status-legend {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 10px;
      width: 100%;
      max-width: 400px;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #37474f;
      padding: 8px;
      background: white;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.2s ease;
    }

    .status-item:hover {
      transform: translateY(-2px);
    }

    .status-color {
      width: 24px;
      height: 12px;
      border-radius: 3px;
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

    .status-badge {
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.delivered {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .status-badge.pending {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    .status-badge.cancelled {
      background-color: #ffebee;
      color: #c62828;
    }

    .status-badge.on-delivery {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      gap: 10px;
    }

    .pagination button {
      padding: 8px 12px;
      border: 1px solid #00796b;
      background: white;
      color: #00796b;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .pagination button:disabled {
      border-color: #ccc;
      color: #ccc;
      cursor: not-allowed;
    }

    .pagination button.active {
      background: #00796b;
      color: white;
    }

    .pagination button:hover:not(:disabled) {
      background: #00796b;
      color: white;
    }

    .dashboard-filters {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 200px;
      position: relative;
    }

    .search-box input {
      width: 100%;
      padding: 10px 15px 10px 35px;
      border: 1px solid #b0bec5;
      border-radius: 6px;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .search-box input:focus {
      border-color: #00796b;
      box-shadow: 0 0 0 2px rgba(0, 121, 107, 0.2);
      outline: none;
    }

    .search-box .icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #78909c;
    }

    .date-filters {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .date-input {
      padding: 8px 12px;
      border: 1px solid #b0bec5;
      border-radius: 6px;
      font-size: 14px;
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-title {
      color: #546e7a;
      font-size: 0.9rem;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      color: #00796b;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .stat-icon {
      font-size: 1.2rem;
      color: #26a69a;
      margin-bottom: 10px;
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
        padding: 10px;
      }

      .status-legend {
        grid-template-columns: 1fr;
        max-width: 300px;
      }

      .chart-container {
        max-width: 300px;
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

        {/* Order Statistics */}
        <div className="stats-cards">
          <div className="stat-card">
            <FontAwesomeIcon icon={faBoxes} className="stat-icon" />
            <div className="stat-title">Total Orders</div>
            <div className="stat-value">{orderStats.totalOrders}</div>
          </div>
          <div className="stat-card">
            <FontAwesomeIcon icon={faMoneyBill} className="stat-icon" />
            <div className="stat-title">Total Amount</div>
            <div className="stat-value">Rs. {orderStats.totalAmount.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <FontAwesomeIcon icon={faChartPie} className="stat-icon" />
            <div className="stat-title">Average Order Value</div>
            <div className="stat-value">Rs. {orderStats.averageOrderValue.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <FontAwesomeIcon icon={faBoxes} className="stat-icon" />
            <div className="stat-title">Total Quantity</div>
            <div className="stat-value">{orderStats.totalQuantity}</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="dashboard-filters">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="icon" />
            <input
              type="text"
              placeholder="Search by waste type, email, phone, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="date-filters">
            <FontAwesomeIcon icon={faCalendar} className="icon" />
            <input
              type="date"
              className="date-input"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
            <span>to</span>
            <input
              type="date"
              className="date-input"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>

        {/* Orders Summary with Pie Chart */}
        <div className="dashboard-section">
          <h2><FontAwesomeIcon icon={faChartPie} /> Orders Summary</h2>
          <div className="orders-summary">
            <div className="chart-container">
              <Pie 
                data={pieChartData} 
                options={{ 
                  maintainAspectRatio: true,
                  aspectRatio: 1,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      backgroundColor: '#00796b',
                      titleFont: {
                        size: 14,
                        family: "'Segoe UI', Arial, sans-serif",
                        weight: 'bold'
                      },
                      bodyFont: {
                        size: 13,
                        family: "'Segoe UI', Arial, sans-serif"
                      },
                      padding: 12,
                      cornerRadius: 8,
                      displayColors: true,
                      boxWidth: 10,
                      boxHeight: 10,
                      usePointStyle: true
                    }
                  }
                }} 
              />
            </div>
            <div className="status-legend">
              <div className="status-item">
                <span className="status-color new"></span>
                <span>New Orders: {statusCounts.new}</span>
              </div>
              <div className="status-item">
                <span className="status-color on-delivery"></span>
                <span>On Delivery: {statusCounts.onDelivery}</span>
              </div>
              <div className="status-item">
                <span className="status-color delivered"></span>
                <span>Delivered: {statusCounts.delivered}</span>
              </div>
              <div className="status-item">
                <span className="status-color cancelled"></span>
                <span>Cancelled: {statusCounts.cancelled}</span>
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
                <th onClick={() => handleSort('wasteType')} data-sort={sortConfig.key === 'wasteType' ? sortConfig.direction : ''}>
                  Waste Type
                </th>
                <th onClick={() => handleSort('quantity')} data-sort={sortConfig.key === 'quantity' ? sortConfig.direction : ''}>
                  Quantity
                </th>
                <th onClick={() => handleSort('amount')} data-sort={sortConfig.key === 'amount' ? sortConfig.direction : ''}>
                  Amount (Rs.)
                </th>
                <th onClick={() => handleSort('address')} data-sort={sortConfig.key === 'address' ? sortConfig.direction : ''}>
                  Address
                </th>
                <th onClick={() => handleSort('phoneNumber')} data-sort={sortConfig.key === 'phoneNumber' ? sortConfig.direction : ''}>
                  Phone Number
                </th>
                <th onClick={() => handleSort('email')} data-sort={sortConfig.key === 'email' ? sortConfig.direction : ''}>
                  Email
                </th>
                <th onClick={() => handleSort('status')} data-sort={sortConfig.key === 'status' ? sortConfig.direction : ''}>
                  Status
                </th>
                <th onClick={() => handleSort('createdAt')} data-sort={sortConfig.key === 'createdAt' ? sortConfig.direction : ''}>
                  Order Date
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.wasteType}</td>
                  <td>{order.quantity}</td>
                  <td>{order.amount.toLocaleString()}</td>
                  <td>{order.address}</td>
                  <td>{order.phoneNumber}</td>
                  <td>{order.email}</td>
                  <td>
                    <span className={getStatusBadgeClass(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</td>
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
                    <button
                      className="update"
                      onClick={() => generateOrderPDF()}
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersDashboard;