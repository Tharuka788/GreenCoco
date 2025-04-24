import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainNavbar from '../Home/MainNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faWeight, faExclamationTriangle, faRecycle, faHistory, faDownload, faPlus, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'chart.js/auto';
import { ORDER_PLACED_EVENT } from '../supplier/AddOrder';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const InventoryDashboard = () => {
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    totalWeight: 0,
    lowStockItems: 0,
    wasteTypeBreakdown: {},
    recentActivities: []
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState('');
  const LOW_STOCK_THRESHOLD = 10;

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders/');
      const orders = response.data;
      setRecentOrders(orders.slice(0, 5)); // Get last 5 orders
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchInventoryStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/inventory/', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch inventory data');
      }

      const data = await response.json();
      
      // Calculate statistics
      const totalItems = data.length;
      const totalWeight = data.reduce((sum, item) => sum + item.totalWeight, 0);
      const lowStockItems = data.filter(item => item.totalWeight < LOW_STOCK_THRESHOLD).length;
      
      // Calculate waste type breakdown
      const wasteTypeBreakdown = data.reduce((acc, item) => {
        acc[item.wasteType] = (acc[item.wasteType] || 0) + item.totalWeight;
        return acc;
      }, {});

      // Mock recent activities (replace with actual API data if available)
      const recentActivities = data.slice(0, 5).map(item => ({
        id: item._id,
        action: Math.random() > 0.5 ? 'Added' : 'Updated',
        batchId: item.batchId,
        timestamp: new Date(item.collectionDate).toLocaleString()
      }));

      setInventoryStats({
        totalItems,
        totalWeight,
        lowStockItems,
        wasteTypeBreakdown,
        recentActivities
      });
    } catch (err) {
      setError(`Error: ${err.message}. Please try again later.`);
    }
  };

  useEffect(() => {
    fetchInventoryStats();
    fetchOrders();

    // Add event listener for order updates
    const handleOrderPlaced = (event) => {
      console.log('Order placed event received, refreshing data...', event.detail);
      fetchInventoryStats();
      fetchOrders();
    };

    window.addEventListener(ORDER_PLACED_EVENT, handleOrderPlaced);

    // Cleanup event listener
    return () => {
      window.removeEventListener(ORDER_PLACED_EVENT, handleOrderPlaced);
    };
  }, []);

  // Pie chart data
  const pieChartData = {
    labels: Object.keys(inventoryStats.wasteTypeBreakdown),
    datasets: [{
      data: Object.values(inventoryStats.wasteTypeBreakdown),
      backgroundColor: [
        '#26a69a',
        '#00796b',
        '#009688',
        '#4db6ac',
      ],
      hoverOffset: 20,
      borderColor: '#ffffff',
      borderWidth: 2
    }]
  };

  // Export dashboard data as CSV
  const exportToCSV = () => {
    const headers = ['Metric,Value'];
    const statsData = [
      `Total Items,${inventoryStats.totalItems}`,
      `Total Weight (kg),${inventoryStats.totalWeight.toFixed(2)}`,
      `Low Stock Items,${inventoryStats.lowStockItems}`,
      ...Object.entries(inventoryStats.wasteTypeBreakdown).map(([type, weight]) => 
        `${type} Weight (kg),${weight.toFixed(2)}`
      )
    ];

    const csvContent = headers.concat(statsData).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'inventory_dashboard_export.csv';
    link.click();
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

    .inventory-dashboard-container {
      margin-top: 80px;
      padding: 30px;
      min-height: 100vh;
      background: linear-gradient(165deg, #d4f4f2 0%, #a8e6e0 100%);
      font-family: 'Poppins', sans-serif;
      overflow: hidden;
    }

    .inventory-dashboard {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
    }

    .dashboard-title {
      text-align: center;
      color: #004d40;
      margin-bottom: 40px;
      font-size: 2.5rem;
      font-weight: 700;
      letter-spacing: 1px;
      background: linear-gradient(to right, #00796b, #26a69a);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      animation: fadeIn 1s ease-out;
    }

    .error {
      color: #d32f2f;
      text-align: center;
      margin-bottom: 20px;
      background: #ffebee;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
      font-weight: 500;
      animation: slideIn 0.5s ease;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%);
      padding: 25px;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 5px;
      background: linear-gradient(to right, #00796b, #26a69a);
      transition: width 0.3s ease;
    }

    .stat-card:hover::before {
      width: 100%;
    }

    .stat-title {
      color: #004d40;
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .stat-value {
      color: #00796b;
      font-size: 2.2rem;
      font-weight: 700;
      animation: countUp 1.5s ease-out;
    }

    .chart-section {
      background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%);
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      margin-bottom: 40px;
      animation: fadeInUp 0.8s ease-out;
    }

    .chart-title {
      color: #004d40;
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 20px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .chart-container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      background: #e6f0ea;
      border-radius: 10px;
    }

    .activity-section {
      background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%);
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      margin-bottom: 40px;
      animation: fadeInUp 1s ease-out;
    }

    .activity-title {
      color: #004d40;
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 20px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .activity-list {
      max-height: 220px;
      overflow-y: auto;
      padding-right: 15px;
    }

    .activity-item {
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background 0.2s ease;
    }

    .activity-item:hover {
      background: #e6f0ea;
      border-radius: 8px;
    }

    .activity-text {
      color: #37474f;
      font-size: 0.95rem;
    }

    .activity-action {
      color: #00796b;
      font-weight: 600;
    }

    .activity-timestamp {
      color: #78909c;
      font-size: 0.9rem;
    }

    .export-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 0 auto 30px;
      padding: 12px 30px;
      background: linear-gradient(145deg, #00796b, #26a69a);
      color: #ffffff;
      border: none;
      border-radius: 25px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    }

    .export-button:hover {
      background: linear-gradient(145deg, #009688, #4db6ac);
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.15);
    }

    .quick-links {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
      margin-top: 30px;
    }

    .quick-link {
      padding: 12px 25px;
      background: linear-gradient(145deg, #00796b, #26a69a);
      color: #ffffff;
      text-decoration: none;
      border-radius: 25px;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .quick-link:hover {
      background: linear-gradient(145deg, #009688, #4db6ac);
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.15);
    }

    .quick-link::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: rgba(255,255,255,0.15);
      transition: left 0.3s ease;
    }

    .quick-link:hover::after {
      left: 100%;
    }

    .icon {
      font-size: 1.2rem;
      color: #ffffff;
      transition: transform 0.3s ease;
    }

    .quick-link:hover .icon {
      transform: scale(1.1);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideIn {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes countUp {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @media (max-width: 768px) {
      .inventory-dashboard-container {
        margin-top: 120px;
        padding: 15px;
      }

      .dashboard-title {
        font-size: 2rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .chart-container {
        max-width: 300px;
      }

      .quick-links {
        flex-direction: column;
        align-items: center;
      }

      .quick-link {
        width: 100%;
        text-align: center;
        justify-content: center;
      }

      .export-button {
        width: 100%;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <MainNavbar />
      <div className="inventory-dashboard-container">
        <div className="inventory-dashboard">
          <h1 className="dashboard-title">
            <FontAwesomeIcon icon={faBox} className="icon" /> Inventory Dashboard
          </h1>

          {error && <div className="error">{error}</div>}

          <button className="export-button" onClick={exportToCSV}>
            <FontAwesomeIcon icon={faDownload} className="icon" /> Export Dashboard Data
          </button>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-title">
                <FontAwesomeIcon icon={faBox} className="icon" /> Total Items
              </div>
              <div className="stat-value">{inventoryStats.totalItems}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">
                <FontAwesomeIcon icon={faWeight} className="icon" /> Total Weight
              </div>
              <div className="stat-value">{inventoryStats.totalWeight.toFixed(2)} kg</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">
                <FontAwesomeIcon icon={faExclamationTriangle} className="icon" /> Low Stock Items
              </div>
              <div className="stat-value">{inventoryStats.lowStockItems}</div>
            </div>
          </div>

          <div className="activity-section">
            <h2 className="activity-title">
              <FontAwesomeIcon icon={faShoppingCart} className="icon" /> Recent Orders
            </h2>
            <div className="activity-list">
              {recentOrders.map(order => (
                <div key={order._id} className="activity-item">
                  <div className="order-details">
                    <div className="order-header">
                      <span className="waste-type">{order.wasteType}</span>
                      <span className={`order-status ${order.status?.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="order-info">
                      Quantity: {order.quantity} | Amount: Rs.{order.amount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="order-contact">
                    <span className="order-email">{order.email}</span>
                    <span className="order-phone">{order.phoneNumber}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-section">
            <h2 className="chart-title">
              <FontAwesomeIcon icon={faRecycle} className="icon" /> Waste Type Breakdown
            </h2>
            <div className="chart-container">
              <Pie data={pieChartData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      font: {
                        size: 12,
                        family: 'Poppins'
                      },
                      color: '#004d40'
                    }
                  },
                  tooltip: {
                    backgroundColor: '#00796b',
                    titleFont: { family: 'Poppins' },
                    bodyFont: { family: 'Poppins' },
                    callbacks: {
                      label: (context) => `${context.label}: ${context.parsed.toFixed(2)} kg`
                    }
                  }
                }
              }} />
            </div>
          </div>

          <div className="activity-section">
            <h2 className="activity-title">
              <FontAwesomeIcon icon={faHistory} className="icon" /> Recent Activities
            </h2>
            <div className="activity-list">
              {inventoryStats.recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <span className="activity-text">
                    <span className="activity-action">{activity.action}</span> batch {activity.batchId}
                  </span>
                  <span className="activity-timestamp">{activity.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          <style>
            {`
              .order-details {
                display: flex;
                flex-direction: column;
                gap: 8px;
              }
              
              .order-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
              }

              .waste-type {
                font-weight: 600;
                color: #00796b;
                font-size: 1.1rem;
                padding: 4px 8px;
                background-color: #e0f2f1;
                border-radius: 4px;
              }
              
              .order-status {
                font-size: 0.8rem;
                font-weight: 600;
                padding: 4px 8px;
                border-radius: 12px;
                text-transform: uppercase;
              }

              .order-status.pending {
                background-color: #fff3e0;
                color: #ef6c00;
              }

              .order-status.delivered {
                background-color: #e8f5e9;
                color: #2e7d32;
              }

              .order-status.cancelled {
                background-color: #ffebee;
                color: #c62828;
              }

              .order-status.on.delivery {
                background-color: #e3f2fd;
                color: #1565c0;
              }
              
              .order-info {
                color: #37474f;
                font-size: 0.9rem;
              }
              
              .order-contact {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 4px;
              }
              
              .order-email, .order-phone, .order-date {
                color: #78909c;
                font-size: 0.85rem;
              }
              
              .activity-item {
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 10px;
                background: #f5f5f5;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
              }
              
              .activity-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }

              .activity-list {
                max-height: 400px;
                overflow-y: auto;
                padding-right: 10px;
              }

              .activity-list::-webkit-scrollbar {
                width: 6px;
              }

              .activity-list::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
              }

              .activity-list::-webkit-scrollbar-thumb {
                background: #00796b;
                border-radius: 3px;
              }

              .activity-list::-webkit-scrollbar-thumb:hover {
                background: #00695c;
              }
            `}
          </style>

          <div className="quick-links">
            <Link to="/inventory" className="quick-link">
              <FontAwesomeIcon icon={faBox} className="icon" /> Manage Inventory
            </Link>
            <Link to="/inventory/add" className="quick-link">
              <FontAwesomeIcon icon={faPlus} className="icon" /> Add New Inventory
            </Link>
            <Link to="/inventory/low-stock" className="quick-link">
              <FontAwesomeIcon icon={faExclamationTriangle} className="icon" /> View Low Stock Report
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryDashboard;