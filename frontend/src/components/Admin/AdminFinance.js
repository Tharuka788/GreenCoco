import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillWave,
  faChartLine,
  faExchangeAlt,
  faHandHoldingUsd,
  faFileInvoiceDollar
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

const AdminFinance = () => {
  const [financeData, setFinanceData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    totalSalaries: 0,
    recentTransactions: [],
    monthlyRevenue: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get('http://localhost:5000/api/admin/finance', config);
        setFinanceData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching finance data:', error);
        toast.error('Failed to fetch finance data');
        setIsLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  const styles = `
    .admin-finance {
      padding: 2rem;
      margin-left: 280px;
    }

    .finance-header {
      margin-bottom: 2rem;
    }

    .finance-title {
      font-size: 2rem;
      color: #2a7458;
      margin-bottom: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .stat-icon {
      font-size: 1.5rem;
      color: #2a7458;
    }

    .stat-title {
      font-size: 1.1rem;
      color: #666;
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: 600;
      color: #2a7458;
    }

    .transactions-section {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .section-title {
      font-size: 1.5rem;
      color: #2a7458;
      margin-bottom: 1rem;
    }

    .transactions-table {
      width: 100%;
      border-collapse: collapse;
    }

    .transactions-table th,
    .transactions-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .transactions-table th {
      background: #f8f9fa;
      color: #2a7458;
      font-weight: 600;
    }

    .transactions-table tr:hover {
      background: #f8f9fa;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
      font-size: 1.2rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .admin-finance {
        margin-left: 0;
        padding: 1rem;
      }

      .finance-title {
        font-size: 1.5rem;
      }

      .stat-card {
        padding: 1rem;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .transactions-table {
        font-size: 0.9rem;
      }
    }
  `;

  if (isLoading) {
    return (
      <>
        <style>{styles}</style>
        <AdminNavbar />
        <div className="admin-finance">
          <div className="loading">Loading finance data...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <AdminNavbar />
      <div className="admin-finance">
        <div className="finance-header">
          <h1 className="finance-title">Finance Management</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faMoneyBillWave} className="stat-icon" />
              <h3 className="stat-title">Total Revenue</h3>
            </div>
            <p className="stat-value">${financeData.totalRevenue.toLocaleString()}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="stat-icon" />
              <h3 className="stat-title">Total Expenses</h3>
            </div>
            <p className="stat-value">${financeData.totalExpenses.toLocaleString()}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faHandHoldingUsd} className="stat-icon" />
              <h3 className="stat-title">Total Salaries</h3>
            </div>
            <p className="stat-value">${financeData.totalSalaries.toLocaleString()}</p>
          </div>
        </div>

        <div className="transactions-section">
          <h2 className="section-title">Recent Transactions</h2>
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {financeData.recentTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.type}</td>
                  <td style={{ color: transaction.type === 'income' ? '#2a7458' : '#dc3545' }}>
                    ${transaction.amount.toLocaleString()}
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

export default AdminFinance; 