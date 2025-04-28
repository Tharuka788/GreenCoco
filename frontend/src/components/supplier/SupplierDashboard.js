import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faTruck,
  faCheckCircle,
  faExclamationCircle,
  faChartLine,
  faFileInvoice
} from '@fortawesome/free-solid-svg-icons';
import InvoicePaymentTracking from './InvoicePaymentTracking';
import SupplierManagement from './SupplierManagement';
import MainNavbar from '../Home/MainNavbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SupplierDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSupplierStats();
  }, []);

  const fetchSupplierStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers/stats');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching supplier stats:', error);
      setError('Failed to load supplier statistics');
      setLoading(false);
    }
  };

  const styles = `
    .supplier-dashboard {
      padding: 20px;
      max-width: 1200px;
      margin: 80px auto 0;
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
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .stat-icon {
      font-size: 24px;
      padding: 15px;
      border-radius: 50%;
      background: #e3f2fd;
      color: #1976d2;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .stat-info p {
      margin: 5px 0 0;
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .loading {
      text-align: center;
      padding: 20px;
      color: #666;
    }

    .dashboard-title {
      color: #333;
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 600;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <MainNavbar />
      <div className="supplier-dashboard">
        <h1 className="dashboard-title">Supplier Dashboard</h1>
        
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading dashboard...</div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faBox} />
                </div>
                <div className="stat-info">
                  <h3>Total Orders</h3>
                  <p>{stats.totalOrders}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faTruck} />
                </div>
                <div className="stat-info">
                  <h3>Pending Orders</h3>
                  <p>{stats.pendingOrders}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div className="stat-info">
                  <h3>Completed Orders</h3>
                  <p>{stats.completedOrders}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faChartLine} />
                </div>
                <div className="stat-info">
                  <h3>Total Revenue</h3>
                  <p>Rs. {stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <InvoicePaymentTracking />

            <SupplierManagement onUpdate={fetchSupplierStats} />
          </>
        )}
      </div>
    </>
  );
};

export default SupplierDashboard;