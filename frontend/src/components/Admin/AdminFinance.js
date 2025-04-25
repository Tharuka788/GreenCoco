import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillWave,
  faChartLine,
  faExchangeAlt,
  faHandHoldingUsd,
  faFileInvoiceDollar,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

const AdminFinance = () => {
  const [financeData, setFinanceData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    totalSalaries: 0,
    netIncome: 0,
    recentTransactions: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFinanceData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      // Fetch all financial data in parallel
      const [incomeResponse, expenseResponse, salaryResponse, transactionsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/finance/income', config),
        axios.get('http://localhost:5000/api/finance/expense', config),
        axios.get('http://localhost:5000/api/finance/salary', config),
        axios.get('http://localhost:5000/api/finance/transactions', config)
      ]);

      // Calculate totals
      const totalRevenue = incomeResponse.data.reduce((sum, income) => 
        sum + (Number(income.amount) || 0), 0);

      const totalExpenses = expenseResponse.data.reduce((sum, expense) => 
        sum + (Number(expense.amount) || 0), 0);

      const totalSalaries = salaryResponse.data.reduce((sum, salary) => 
        sum + (Number(salary.amount) || 0), 0);

      // Combine all transactions
      const allTransactions = [
        ...incomeResponse.data.map(income => ({
          ...income,
          type: 'income'
        })),
        ...expenseResponse.data.map(expense => ({
          ...expense,
          type: 'expense'
        })),
        ...salaryResponse.data.map(salary => ({
          ...salary,
          type: 'salary'
        }))
      ];

      // Sort transactions by date and get recent ones
      const recentTransactions = allTransactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      const netIncome = totalRevenue - totalExpenses - totalSalaries;

      setFinanceData({
        totalRevenue,
        totalExpenses,
        totalSalaries,
        netIncome,
        recentTransactions
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching finance data:', error);
      setError('Failed to fetch finance data. Please try again later.');
      toast.error('Failed to fetch finance data');
      setIsLoading(false);
    }
  };

  // Fetch data initially and set up interval for real-time updates
  useEffect(() => {
    fetchFinanceData();
    
    // Set up interval for real-time updates (every 30 seconds)
    const interval = setInterval(fetchFinanceData, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleAddTransaction = async (transactionData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const endpoints = [
        'http://localhost:5000/api/admin/finance/transaction',
        'http://localhost:5000/api/finance/transaction',
        'http://localhost:5000/api/finances',
        'http://localhost:5000/api/transactions'
      ];

      let lastError = null;
      for (const endpoint of endpoints) {
        try {
          await axios.post(endpoint, transactionData, config);
          toast.success('Transaction added successfully');
          fetchFinanceData();
          return;
        } catch (error) {
          console.log(`Failed to add transaction using ${endpoint}:`, error.message);
          lastError = error;
          continue;
        }
      }

      throw lastError || new Error('Failed to add transaction using all endpoints');

    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-finance">
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
            <p>Loading finance data...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-finance">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={fetchFinanceData}>
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="admin-finance">
        <div className="finance-header">
          <h1 className="finance-title">Finance Dashboard</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faMoneyBillWave} className="stat-icon" />
              <h3 className="stat-title">Total Revenue</h3>
            </div>
            <p className="stat-value positive">
              ${financeData.totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="stat-icon" />
              <h3 className="stat-title">Total Expenses</h3>
            </div>
            <p className="stat-value negative">
              ${financeData.totalExpenses.toLocaleString()}
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faHandHoldingUsd} className="stat-icon" />
              <h3 className="stat-title">Total Salaries</h3>
            </div>
            <p className="stat-value">
              ${financeData.totalSalaries.toLocaleString()}
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faChartLine} className="stat-icon" />
              <h3 className="stat-title">Net Income</h3>
            </div>
            <p className={`stat-value ${financeData.netIncome >= 0 ? 'positive' : 'negative'}`}>
              ${Math.abs(financeData.netIncome).toLocaleString()}
              {financeData.netIncome < 0 ? ' (Loss)' : ''}
            </p>
          </div>
        </div>

        <div className="transactions-section">
          <h2 className="section-title">Recent Transactions</h2>
          {financeData.recentTransactions.length > 0 ? (
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
                  <tr key={transaction._id || index}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.description}</td>
                    <td className={`transaction-type ${transaction.type}`}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </td>
                    <td className={`amount ${transaction.type === 'income' ? 'positive' : 'negative'}`}>
                      ${Number(transaction.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-transactions">No recent transactions found</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-finance {
          padding: 2rem;
          margin-left: 250px;
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .loading-icon {
          font-size: 2rem;
          color: #3498db;
          margin-bottom: 1rem;
        }

        .error-message {
          color: #e74c3c;
          margin-bottom: 1rem;
        }

        .retry-button {
          padding: 0.5rem 1rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .retry-button:hover {
          background-color: #2980b9;
        }

        .finance-header {
          margin-bottom: 2rem;
        }

        .finance-title {
          font-size: 2rem;
          color: #2c3e50;
          margin: 0;
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
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .stat-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
          color: #3498db;
        }

        .stat-title {
          margin: 0;
          color: #7f8c8d;
          font-size: 1rem;
        }

        .stat-value {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .positive {
          color: #27ae60;
        }

        .negative {
          color: #e74c3c;
        }

        .transactions-section {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .section-title {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 1.5rem;
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
          background-color: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
        }

        .transaction-type {
          text-transform: capitalize;
        }

        .transaction-type.income {
          color: #27ae60;
        }

        .transaction-type.expense,
        .transaction-type.salary {
          color: #e74c3c;
        }

        .amount {
          font-weight: 600;
        }

        .no-transactions {
          text-align: center;
          color: #7f8c8d;
          padding: 2rem;
        }

        @media (max-width: 1024px) {
          .admin-finance {
            margin-left: 0;
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }

          .stat-card {
            padding: 1rem;
          }

          .stat-value {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default AdminFinance; 