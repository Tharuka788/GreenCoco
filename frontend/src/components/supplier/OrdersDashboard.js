import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faChartPie, faSearch, faCalendar, faMoneyBill, faBoxes } from '@fortawesome/free-solid-svg-icons';
import MainNavbar from '../Home/MainNavbar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    totalQuantity: 0,
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
        const stats = ordersData.reduce(
          (acc, order) => {
            acc.totalOrders++;
            acc.totalAmount += order.amount;
            acc.totalQuantity += order.quantity;
            return acc;
          },
          { totalOrders: 0, totalAmount: 0, totalQuantity: 0 }
        );

        stats.averageOrderValue = stats.totalOrders ? stats.totalAmount / stats.totalOrders : 0;
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
    return orders.filter((order) => {
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

  // Generate PDF for a specific order
  const generateOrderPDF = (order) => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text(`Order Details - ${order._id}`, 10, 10);

      // Add order summary
      doc.setFontSize(12);
      doc.text(`Waste Type: ${order.wasteType}`, 10, 20);
      doc.text(`Quantity: ${order.quantity}`, 10, 30);
      doc.text(`Amount: Rs. ${order.amount.toLocaleString()}`, 10, 40);
      doc.text(`Status: ${order.status}`, 10, 50);
      doc.text(`Order Date: ${new Date(order.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}`, 10, 60);
      doc.text(`Customer Email: ${order.email}`, 10, 70);
      doc.text(`Phone Number: ${order.phoneNumber}`, 10, 80);
      doc.text(`Address: ${order.address}`, 10, 90);

      // Add a table for order details
      autoTable(doc, {
        startY: 100,
        head: [['Field', 'Value']],
        body: [
          ['Waste Type', order.wasteType],
          ['Quantity', order.quantity.toString()],
          ['Amount', `Rs. ${order.amount.toLocaleString()}`],
          ['Status', order.status],
          ['Order Date', new Date(order.createdAt).toLocaleString('en-US')],
          ['Email', order.email],
          ['Phone Number', order.phoneNumber],
          ['Address', order.address],
        ],
        theme: 'striped',
        headStyles: { fillColor: [0, 121, 107] }, // Teal color for header
        styles: { fontSize: 10 },
      });

      // Save the PDF
      doc.save(`order_${order._id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Updated CSS for a modern, responsive dashboard
  const styles = `
    /* Root container for the dashboard */
    .orders-dashboard-container {
      margin-top: 80px;
      padding: 20px;
      min-height: 100vh;
      background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      color: #1e3a8a;
    }

    /* Dashboard header with title and new order button */
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1280px;
      margin: 0 auto 30px;
      padding: 15px 0;
    }

    .dashboard-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #005b4f;
      letter-spacing: -0.025em;
      margin: 0;
    }

    /* New order button with modern hover effect */
    .new-order-button {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #00796b;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 121, 107, 0.2);
    }

    .new-order-button:hover {
      background: #00695c;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 121, 107, 0.3);
    }

    .new-order-button:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 121, 107, 0.3);
    }

    /* Stats cards grid */
    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      max-width: 1280px;
      margin: 0 auto 30px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
      font-size: 1.5rem;
      color: #26a69a;
      margin-bottom: 12px;
    }

    .stat-title {
      font-size: 0.9rem;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #005b4f;
    }

    /* Filters section */
    .dashboard-filters {
      display: flex;
      gap: 20px;
      max-width: 1280px;
      margin: 0 auto 30px;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 250px;
      position: relative;
    }

    .search-box input {
      width: 100%;
      padding: 12px 16px 12px 40px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .search-box input:focus {
      border-color: #00796b;
      box-shadow: 0 0 0 3px rgba(0, 121, 107, 0.2);
      outline: none;
    }

    .search-box .icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
      font-size: 1.1rem;
    }

    .date-filters {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .date-input {
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }

    .date-input:focus {
      border-color: #00796b;
      box-shadow: 0 0 0 3px rgba(0, 121, 107, 0.2);
      outline: none;
    }

    /* Dashboard section for chart and table */
    .dashboard-section {
      max-width: 1280px;
      margin: 0 auto 30px;
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .dashboard-section h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #005b4f;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dashboard-section h2 svg {
      color: #26a69a;
      font-size: 1.25rem;
    }

    /* Orders summary with pie chart */
    .orders-summary {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      padding: 20px 0;
    }

    .chart-container {
      width: 100%;
      max-width: 360px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .status-legend {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
      width: 100%;
      max-width: 400px;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s ease;
      font-size: 0.9rem;
      font-weight: 500;
      color: #1e3a8a;
    }

    .status-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .status-color {
      width: 16px;
      height: 16px;
      border-radius: 4px;
    }

    .status-color.new {
      background: #34c759;
    }

    .status-color.on-delivery {
      background: #ff9500;
    }

    .status-color.delivered {
      background: #007aff;
    }

    .status-color.cancelled {
      background: #ff3b30;
    }

    /* Orders table */
    .orders-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin-top: 16px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .orders-table th,
    .orders-table td {
      padding: 14px 16px;
      text-align: left;
      font-size: 0.9rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .orders-table th {
      background: #f1f5f9;
      color: #005b4f;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .orders-table th:hover {
      background: #e2e8f0;
    }

    .orders-table th[data-sort='asc']::after {
      content: '↑';
      margin-left: 8px;
      font-size: 0.75rem;
    }

    .orders-table th[data-sort='desc']::after {
      content: '↓';
      margin-left: 8px;
      font-size: 0.75rem;
    }

    .orders-table td {
      color: #1e3a8a;
    }

    /* Status badges */
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-badge.delivered {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status-badge.pending {
      background: #fff3e0;
      color: #ef6c00;
    }

    .status-badge.cancelled {
      background: #ffebee;
      color: #c62828;
    }

    .status-badge.on-delivery {
      background: #e3f2fd;
      color: #1565c0;
    }

    /* Action buttons */
    .orders-table button {
      padding: 8px 12px;
      margin-right: 8px;
      border: none;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .orders-table button.update {
      background: #00796b;
      color: white;
    }

    .orders-table button.delete {
      background: #dc2626;
      color: white;
    }

    .orders-table button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .orders-table button:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 121, 107, 0.3);
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 24px;
    }

    .pagination button {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      background: white;
      color: #005b4f;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .pagination button:hover:not(:disabled) {
      background: #00796b;
      color: white;
      border-color: #00796b;
    }

    .pagination button.active {
      background: #00796b;
      color: white;
      border-color: #00796b;
      font-weight: 600;
    }

    .pagination button:disabled {
      color: #9ca3af;
      border-color: #d1d5db;
      cursor: not-allowed;
    }

    /* Loading and error messages */
    .loading-message {
      text-align: center;
      font-size: 1.1rem;
      color: #005b4f;
      padding: 20px;
      background: #f8fafc;
      border-radius: 8px;
      margin: 20px auto;
      max-width: 400px;
    }

    .error-message {
      text-align: center;
      font-size: 1.1rem;
      color: #dc2626;
      padding: 20px;
      background: #fef2f2;
      border-radius: 8px;
      margin: 20px auto;
      max-width: 400px;
    }

    /* Responsive adjustments */
    @media (max-width: 1024px) {
      .dashboard-header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .stats-cards {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }

      .dashboard-filters {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        min-width: auto;
      }
    }

    @media (max-width: 768px) {
      .orders-dashboard-container {
        margin-top: 100px;
        padding: 16px;
      }

      .dashboard-header h1 {
        font-size: 1.75rem;
      }

      .new-order-button {
        padding: 10px 20px;
        font-size: 0.9rem;
      }

      .dashboard-section {
        padding: 16px;
      }

      .dashboard-section h2 {
        font-size: 1.25rem;
      }

      .orders-table {
        font-size: 0.85rem;
      }

      .orders-table th,
      .orders-table td {
        padding: 10px;
      }

      .orders-table button {
        padding: 6px 10px;
        font-size: 0.8rem;
      }

      .chart-container {
        max-width: 300px;
      }

      .status-legend {
        grid-template-columns: 1fr;
        max-width: 300px;
      }
    }

    @media (max-width: 480px) {
      .orders-table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
      }

      .orders-table th,
      .orders-table td {
        min-width: 120px;
      }

      .pagination {
        flex-wrap: wrap;
        gap: 6px;
      }

      .pagination button {
        padding: 6px 10px;
        font-size: 0.8rem;
      }
    }
  `;

  if (loading) return (
    <div className="loading-message">
      <svg className="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
      </svg>
      Loading...
    </div>
  );
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <MainNavbar />
      <div className="orders-dashboard-container">
        <div className="dashboard-header">
          <h1>Orders Dashboard</h1>
          <button className="new-order-button" onClick={handleNavigateToAddOrder}>
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
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
            />
            <span>to</span>
            <input
              type="date"
              className="date-input"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>

        {/* Orders Summary with Pie Chart */}
        <div className="dashboard-section">
          <h2>
            <FontAwesomeIcon icon={faChartPie} /> Orders Summary
          </h2>
          <div className="orders-summary">
            <div className="chart-container">
              <Pie
                data={pieChartData}
                options={{
                  maintainAspectRatio: true,
                  aspectRatio: 1,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: '#00796b',
                      titleFont: {
                        size: 14,
                        family: "'Inter', 'Segoe UI', Arial, sans-serif",
                        weight: 'bold',
                      },
                      bodyFont: {
                        size: 13,
                        family: "'Inter', 'Segoe UI', Arial, sans-serif",
                      },
                      padding: 12,
                      cornerRadius: 8,
                      displayColors: true,
                      boxWidth: 10,
                      boxHeight: 10,
                      usePointStyle: true,
                    },
                  },
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
                    <span className={getStatusBadgeClass(order.status)}>{order.status}</span>
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td>
                    <button className="update" onClick={() => handleOrderUpdate(order._id)}>
                      <FontAwesomeIcon icon={faEdit} /> Update
                    </button>
                    <button className="delete" onClick={() => handleOrderDelete(order._id)}>
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                    <button className="update" onClick={() => generateOrderPDF(order)}>
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              First
            </button>
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
              Last
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersDashboard;