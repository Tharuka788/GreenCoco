import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainNavbar from '../Home/MainNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faExclamationTriangle, faChartBar, faRecycle, faWeight } from '@fortawesome/free-solid-svg-icons';

const InventoryDashboard = () => {
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    totalWeight: 0,
    lowStockItems: 0,
    wasteTypeBreakdown: {}
  });
  const [error, setError] = useState('');
  const LOW_STOCK_THRESHOLD = 10;

  useEffect(() => {
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

        setInventoryStats({
          totalItems,
          totalWeight,
          lowStockItems,
          wasteTypeBreakdown
        });
      } catch (err) {
        setError(`Error: ${err.message}. Please try again later.`);
      }
    };

    fetchInventoryStats();
  }, []);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .inventory-dashboard-container {
      margin-top: 80px;
      padding: 20px;
      min-height: 100vh;
      background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
      font-family: 'Poppins', sans-serif;
    }

    .inventory-dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }

    .inventory-dashboard h1 {
      text-align: center;
      color: #00695c;
      margin-bottom: 30px;
      font-size: 2.2rem;
      font-weight: 600;
    }

    .error {
      color: #d32f2f;
      text-align: center;
      margin-bottom: 15px;
      background: #ffebee;
      padding: 10px;
      border-radius: 4px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      text-align: center;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }

    .stat-card svg {
      font-size: 2rem;
      color: #26a69a;
      margin-bottom: 10px;
    }

    .stat-card h3 {
      color: #004d40;
      margin: 10px 0;
      font-size: 1.2rem;
    }

    .stat-card p {
      color: #37474f;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .breakdown-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .breakdown-section h2 {
      color: #00695c;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .breakdown-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
    }

    .breakdown-item {
      text-align: center;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 6px;
    }

    .breakdown-item h4 {
      color: #004d40;
      margin-bottom: 5px;
      font-size: 1rem;
    }

    .breakdown-item p {
      color: #37474f;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .quick-links {
      display: flex;
      justify-content: center;
      gap: 15px;
      flex-wrap: wrap;
    }

    .quick-link {
      display: inline-block;
      padding: 12px 24px;
      background: #00796b;
      color: #e6f0ea;
      text-decoration: none;
      border-radius: 6px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .quick-link:hover {
      background: #009688;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }

    @media (max-width: 768px) {
      .inventory-dashboard-container {
        margin-top: 120px;
        padding: 10px;
      }

      .inventory-dashboard h1 {
        font-size: 1.8rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .breakdown-grid {
        grid-template-columns: 1fr;
      }

      .quick-links {
        flex-direction: column;
        align-items: center;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <MainNavbar />
      <div className="inventory dashboard-container">
        <div className="inventory-dashboard">
          <h1>Inventory Dashboard</h1>

          {error && <div className="error">{error}</div>}

          <div className="stats-grid">
            <div className="stat-card">
              <FontAwesomeIcon icon={faBox} />
              <h3>Total Items</h3>
              <p>{inventoryStats.totalItems}</p>
            </div>
            <div className="stat-card">
              <FontAwesomeIcon icon={faWeight} />
              <h3>Total Weight</h3>
              <p>{inventoryStats.totalWeight.toFixed(2)} kg</p>
            </div>
            <div className="stat-card">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <h3>Low Stock Items</h3>
              <p>{inventoryStats.lowStockItems}</p>
            </div>
          </div>

          <div className="breakdown-section">
            <h2>Waste Type Breakdown</h2>
            <div className="breakdown-grid">
              {Object.entries(inventoryStats.wasteTypeBreakdown).map(([type, weight]) => (
                <div key={type} className="breakdown-item">
                  <h4>{type}</h4>
                  <p>{weight.toFixed(2)} kg</p>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-links">
            <Link to="/inventory" className="quick-link">
              Manage Inventory
            </Link>
            <Link to="/inventory/add" className="quick-link">
              Add New Inventory
            </Link>
            <Link to="/inventory/low-stock" className="quick-link">
              View Low Stock Report
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryDashboard;