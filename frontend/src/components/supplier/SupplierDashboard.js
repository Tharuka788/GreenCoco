import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faBoxes,
  faMoneyBillWave,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import SupplierManagement from './SupplierManagement';
import MainNavbar from '../Home/MainNavbar';

const SupplierDashboard = () => {
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    totalProducts: 0,
    totalAmount: 0,
    activeSuppliers: 0
  });

  useEffect(() => {
    fetchSupplierStats();
  }, []);

  const fetchSupplierStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers');
      const suppliers = response.data;

      const statistics = {
        totalSuppliers: suppliers.length,
        totalProducts: suppliers.reduce((acc, curr) => acc + (curr.quantity || 0), 0),
        totalAmount: suppliers.reduce((acc, curr) => acc + (curr.amount || 0), 0),
        activeSuppliers: suppliers.filter(s => s.isActive).length
      };

      setStats(statistics);
    } catch (error) {
      console.error('Error fetching supplier statistics:', error);
    }
  };

  const styles = `
    .supplier-dashboard {
      padding: 20px;
      max-width: 1200px;
      margin: 80px auto 0;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      font-size: 24px;
    }

    .suppliers-icon {
      background: #e3f2fd;
      color: #1976d2;
    }

    .products-icon {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .amount-icon {
      background: #e8f5e9;
      color: #388e3c;
    }

    .active-icon {
      background: #fff3e0;
      color: #f57c00;
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
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon suppliers-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="stat-info">
              <h3>Total Suppliers</h3>
              <p>{stats.totalSuppliers}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon products-icon">
              <FontAwesomeIcon icon={faBoxes} />
            </div>
            <div className="stat-info">
              <h3>Total Products</h3>
              <p>{stats.totalProducts}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon amount-icon">
              <FontAwesomeIcon icon={faMoneyBillWave} />
            </div>
            <div className="stat-info">
              <h3>Total Amount</h3>
              <p>Rs. {stats.totalAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon active-icon">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <div className="stat-info">
              <h3>Active Suppliers</h3>
              <p>{stats.activeSuppliers}</p>
            </div>
          </div>
        </div>

        <SupplierManagement onUpdate={fetchSupplierStats} />
      </div>
    </>
  );
};

export default SupplierDashboard;