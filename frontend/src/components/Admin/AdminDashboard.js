import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt,
  faBell,
  faWallet,
  faBox,
  faTruck,
  faPeopleCarry,
  faUsers,
  faCalendarAlt,
  faSearch,
  faFileExport,
} from '@fortawesome/free-solid-svg-icons';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSuppliers: 0,
    deliveriesScheduled: 0,
    totalEmployees: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Fetch summary data and notifications on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch admin name from token (assuming the backend includes it in the token payload)
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setAdminName(decoded.email.split('@')[0] || 'Admin');
        }

        // Mock API calls (replace with actual API endpoints)
        const financeRes = await axios.get('http://localhost:5000/api/finance/summary');
        const inventoryRes = await axios.get('http://localhost:5000/api/inventory/summary');
        const ordersRes = await axios.get('http://localhost:5000/api/orders/summary');
        const suppliersRes = await axios.get('http://localhost:5000/api/suppliers/summary');
        const deliveriesRes = await axios.get('http://localhost:5000/api/deliveries/summary');
        const employeesRes = await axios.get('http://localhost:5000/api/employees/summary');
        const notificationsRes = await axios.get('http://localhost:5000/api/notifications');

        // Mock data (remove this when backend APIs are ready)
        const mockData = {
          finance: { totalIncome: 50000, totalExpenses: 30000 },
          inventory: { totalProducts: 120, lowStock: 15 },
          orders: {
            totalOrders: 45,
            recentOrders: [
              { id: 1, orderNumber: 'ORD001', customer: 'John Doe', date: '2025-04-20', amount: 1500, status: 'Pending' },
              { id: 2, orderNumber: 'ORD002', customer: 'Jane Smith', date: '2025-04-19', amount: 2200, status: 'Shipped' },
              { id: 3, orderNumber: 'ORD003', customer: 'Mike Johnson', date: '2025-04-18', amount: 1800, status: 'Delivered' },
            ],
          },
          suppliers: { totalSuppliers: 10 },
          deliveries: { deliveriesScheduled: 5 },
          employees: { totalEmployees: 25 },
          notifications: [
            { id: 1, message: 'Low stock alert: 15 products below threshold', date: '2025-04-22' },
            { id: 2, message: 'Pending supplier approval: Supplier XYZ', date: '2025-04-21' },
          ],
        };

        setSummaryData({
          totalIncome: mockData.finance.totalIncome,
          totalExpenses: mockData.finance.totalExpenses,
          totalProducts: mockData.inventory.totalProducts,
          totalOrders: mockData.orders.totalOrders,
          totalSuppliers: mockData.suppliers.totalSuppliers,
          deliveriesScheduled: mockData.deliveries.deliveriesScheduled,
          totalEmployees: mockData.employees.totalEmployees,
        });

        setRecentOrders(mockData.orders.recentOrders);
        setNotifications(mockData.notifications);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  // Toggle notification panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Filter orders based on search term
  const filteredOrders = recentOrders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Chart data
  const incomeExpenseChartData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [summaryData.totalIncome, summaryData.totalExpenses],
        backgroundColor: ['#2a7458', '#ff4f5d'],
      },
    ],
  };

  const inventoryChartData = {
    labels: ['In Stock', 'Low Stock'],
    datasets: [
      {
        data: [summaryData.totalProducts - 15, 15], // Mock low stock count
        backgroundColor: ['#3b9c73', '#ff4f5d'],
      },
    ],
  };

  const ordersChartData = {
    labels: ['Apr 18', 'Apr 19', 'Apr 20', 'Apr 21', 'Apr 22'],
    datasets: [
      {
        label: 'Orders',
        data: [10, 15, 8, 12, 45], // Mock data
        fill: false,
        borderColor: '#2a7458',
        tension: 0.1,
      },
    ],
  };

  // Export data handler (placeholder)
  const handleExport = () => {
    alert('Exporting data as PDF/Excel... (Feature coming soon)');
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .admin-panel {
      display: flex;
      min-height: 100vh;
      font-family: 'Poppins', sans-serif;
      background: #f5f7fa;
    }

    .sidebar {
      width: 250px;
      background: linear-gradient(180deg, #2a7458 0%, #3b9c73 100%);
      color: #ffffff;
      padding: 20px;
      position: fixed;
      top: 0;
      bottom: 0;
    }

    .sidebar h2 {
      font-size: 1.5rem;
      margin-bottom: 30px;
      text-align: center;
    }

    .sidebar ul {
      list-style: none;
      padding: 0;
    }

    .sidebar li {
      margin-bottom: 10px;
    }

    .sidebar a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 15px;
      color: #e6f0ea;
      text-decoration: none;
      border-radius: 5px;
      transition: background 0.3s;
    }

    .sidebar a:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .sidebar a.active {
      background: #ffffff;
      color: #2a7458;
      font-weight: 600;
    }

    .main-content {
      margin-left: 250px;
      flex: 1;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
      padding: 15px 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }

    .header h2 {
      font-size: 1.2rem;
      color: #333333;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .notification-icon {
      position: relative;
      cursor: pointer;
      color: #333333;
    }

    .notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #ff4f5d;
      color: #ffffff;
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 50%;
    }

    .notification-panel {
      position: absolute;
      top: 60px;
      right: 20px;
      background: #ffffff;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      width: 300px;
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
    }

    .notification-panel h4 {
      padding: 10px;
      margin: 0;
      border-bottom: 1px solid #ddd;
      font-size: 1rem;
    }

    .notification-item {
      padding: 10px;
      border-bottom: 1px solid #ddd;
      font-size: 0.9rem;
      color: #666666;
    }

    .notification-item:last-child {
      border-bottom: none;
    }

    .logout-btn {
      background: #ff4f5d;
      color: #ffffff;
      border: none;
      padding: 8px 15px;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .logout-btn:hover {
      background: #e64550;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .card {
      background: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .card h3 {
      font-size: 1rem;
      color: #666666;
      margin-bottom: 10px;
    }

    .card p {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2a7458;
    }

    .charts {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .chart-container {
      background: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .table-section {
      background: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .search-bar {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .search-bar input {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 5px;
      outline: none;
      font-family: 'Poppins', sans-serif;
    }

    .date-filter {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .export-btn {
      background: #2a7458;
      color: #ffffff;
      border: none;
      padding: 8px 15px;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .export-btn:hover {
      background: #3b9c73;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background: #f5f7fa;
      font-weight: 600;
      color: #333333;
    }

    td {
      color: #666666;
    }

    @media (max-width: 768px) {
      .admin-panel {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        position: static;
        padding: 10px;
      }

      .main-content {
        margin-left: 0;
        padding: 10px;
      }

      .summary-cards {
        grid-template-columns: 1fr;
      }

      .charts {
        grid-template-columns: 1fr;
      }

      .table-header {
        flex-direction: column;
        gap: 10px;
      }

      .date-filter {
        flex-direction: column;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="admin-panel">
        <div className="sidebar">
          <h2>Admin Panel</h2>
          <ul>
            <li>
              <a href="/admin" className="active">
                <FontAwesomeIcon icon={faWallet} /> Dashboard
              </a>
            </li>
            <li>
              <a href="/admin/finance">
                <FontAwesomeIcon icon={faWallet} /> Finance
              </a>
            </li>
            <li>
              <a href="/admin/inventory">
                <FontAwesomeIcon icon={faBox} /> Inventory
              </a>
            </li>
            <li>
              <a href="/admin/orders">
                <FontAwesomeIcon icon={faTruck} /> Orders
              </a>
            </li>
            <li>
              <a href="/admin/suppliers">
                <FontAwesomeIcon icon={faPeopleCarry} /> Suppliers
              </a>
            </li>
            <li>
              <a href="/admin/employees">
                <FontAwesomeIcon icon={faUsers} /> Employees
              </a>
            </li>
            <li>
              <a href="/admin/deliveries">
                <FontAwesomeIcon icon={faCalendarAlt} /> Deliveries
              </a>
            </li>
          </ul>
        </div>
        <div className="main-content">
          <div className="header">
            <h2>Welcome, {adminName}</h2>
            <div className="header-actions">
              <div className="notification-icon" onClick={toggleNotifications}>
                <FontAwesomeIcon icon={faBell} />
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
              </div>
              {showNotifications && (
                <div className="notification-panel">
                  <h4>Notifications</h4>
                  {notifications.map((notif) => (
                    <div key={notif.id} className="notification-item">
                      <p>{notif.message}</p>
                      <small>{notif.date}</small>
                    </div>
                  ))}
                </div>
              )}
              <button className="logout-btn" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </button>
            </div>
          </div>
          <div className="summary-cards">
            <div className="card">
              <h3>Total Income</h3>
              <p>${summaryData.totalIncome.toLocaleString()}</p>
            </div>
            <div className="card">
              <h3>Total Expenses</h3>
              <p>${summaryData.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="card">
              <h3>Total Products</h3>
              <p>{summaryData.totalProducts}</p>
            </div>
            <div className="card">
              <h3>Total Orders</h3>
              <p>{summaryData.totalOrders}</p>
            </div>
            <div className="card">
              <h3>Total Suppliers</h3>
              <p>{summaryData.totalSuppliers}</p>
            </div>
            <div className="card">
              <h3>Deliveries Scheduled</h3>
              <p>{summaryData.deliveriesScheduled}</p>
            </div>
            <div className="card">
              <h3>Total Employees</h3>
              <p>{summaryData.totalEmployees}</p>
            </div>
          </div>
          <div className="charts">
            <div className="chart-container">
              <h3>Income vs Expenses</h3>
              <Bar data={incomeExpenseChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            </div>
            <div className="chart-container">
              <h3>Inventory Status</h3>
              <Pie data={inventoryChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            </div>
            <div className="chart-container">
              <h3>Orders Over Time</h3>
              <Line data={ordersChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            </div>
          </div>
          <div className="table-section">
            <div className="table-header">
              <div className="search-bar">
                <FontAwesomeIcon icon={faSearch} />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="date-filter">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="End Date"
                />
              </div>
              <button className="export-btn" onClick={handleExport}>
                <FontAwesomeIcon icon={faFileExport} /> Export
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customer}</td>
                    <td>{order.date}</td>
                    <td>${order.amount.toLocaleString()}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;