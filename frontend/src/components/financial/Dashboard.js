import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import IncomeCard from './IncomeCard';
import ExpenseCard from './ExpenseCard';
import ProfitCard from './ProfitCard';
import SalaryCard from './SalaryCard';
import PaymentsCard from './PaymentsCard';
import Transactions from './Transactions';
import { useFinance } from '../../FinanceContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

// Register Chart.js components for a line chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [financeData, setFinanceData] = useState({
    income: [],
    expenses: [],
    salaries: [],
    transactions: [],
    profitLoss: {},
  });
  const [scheduledPayments, setScheduledPayments] = useState([]);
  const [upcomingIncome, setUpcomingIncome] = useState([]);
  const [upcomingExpenses, setUpcomingExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const { refreshTrigger } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [newPayment, setNewPayment] = useState({
    utilityType: '',
    amount: '',
    dueDate: '',
    frequency: 'monthly',
    status: 'pending',
  });

  const fetchData = async () => {
    try {
      setError(null);
      const [incomeRes, expenseRes, salaryRes, profitRes, transRes, scheduledPaymentsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/finance/income'),
        axios.get('http://localhost:5000/api/finance/expense'),
        axios.get('http://localhost:5000/api/finance/salary'),
        axios.get('http://localhost:5000/api/finance/profit-loss'),
        axios.get('http://localhost:5000/api/finance/transactions'),
        axios.get('http://localhost:5000/api/finance/scheduled-payments'),
      ]);

      const newFinanceData = {
        income: incomeRes.data,
        expenses: expenseRes.data,
        salaries: salaryRes.data,
        profitLoss: profitRes.data,
        transactions: transRes.data,
      };

      setFinanceData(newFinanceData);
      setScheduledPayments(scheduledPaymentsRes.data);

      // Filter for current and past entries (up to today) for financial calculations
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const currentIncome = newFinanceData.income.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate <= today;
      });
      const currentExpenses = newFinanceData.expenses.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate <= today;
      });

      // Filter for future entries (after today) for upcoming payments
      const futureIncome = newFinanceData.income.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate > today;
      });
      const futureExpenses = newFinanceData.expenses.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate > today;
      });

      setUpcomingIncome(futureIncome);
      setUpcomingExpenses(futureExpenses);

      // Calculate total income and expenses for current and past entries only
      const totalIncome = currentIncome.reduce((sum, item) => sum + item.amount, 0);
      const totalExpenses = currentExpenses.reduce((sum, item) => sum + item.amount, 0);
      const difference = totalIncome - totalExpenses;

      // Thresholds for notifications
      const warningThreshold = 10000; // LKR 10,000 as a warning threshold
      const criticalThreshold = 0; // LKR 0 as a critical threshold

      // Check if browser notifications are supported and request permission
      if ('Notification' in window) {
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
      }

      // Trigger notifications based on thresholds
      if (difference <= criticalThreshold) {
        const message = `Critical Alert: Your expenses (LKR ${totalExpenses.toFixed(2)}) have exceeded or matched your income (LKR ${totalIncome.toFixed(2)}). Net balance: LKR ${difference.toFixed(2)}. Immediate action is recommended!`;
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Financial Alert', { body: message });
        } else {
          setNotification({ type: 'critical', message });
        }
      } else if (difference <= warningThreshold) {
        const message = `Warning: Your net balance is low (LKR ${difference.toFixed(2)}). Income: LKR ${totalIncome.toFixed(2)}, Expenses: LKR ${totalExpenses.toFixed(2)}. Consider reviewing your finances.`;
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Financial Warning', { body: message });
        } else {
          setNotification({ type: 'warning', message });
        }
      } else {
        setNotification(null);
      }
    } catch (error) {
      console.error('Error fetching finance data:', error);
      setError('Failed to fetch financial data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment({ ...newPayment, [name]: value });
  };

  // Handle adding or updating a payment
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!newPayment.utilityType || !newPayment.amount || !newPayment.dueDate) {
      alert('Please fill in all required fields.');
      return;
    }
    if (newPayment.amount <= 0) {
      alert('Amount must be a positive number.');
      return;
    }

    try {
      if (editingPayment) {
        // Update existing payment
        const response = await axios.put(
          `http://localhost:5000/api/finance/scheduled-payments/${editingPayment._id}`,
          newPayment
        );
        setScheduledPayments(
          scheduledPayments.map((payment) =>
            payment._id === editingPayment._id ? response.data.scheduledPayments.find(p => p._id === editingPayment._id) : payment
          )
        );
      } else {
        // Add new payment
        const response = await axios.post('http://localhost:5000/api/finance/scheduled-payments', newPayment);
        setScheduledPayments(response.data.scheduledPayments);
      }
      setNewPayment({ utilityType: '', amount: '', dueDate: '', frequency: 'monthly', status: 'pending' });
      setEditingPayment(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Failed to save payment.');
    }
  };

  // Handle editing a payment
  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setNewPayment(payment);
    setIsModalOpen(true);
  };

  // Handle deleting a payment
  const handleDeletePayment = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this scheduled payment?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/finance/scheduled-payments/${paymentId}`);
        setScheduledPayments(response.data.scheduledPayments);
      } catch (error) {
        console.error('Error deleting payment:', error);
        alert('Failed to delete payment.');
      }
    }
  };

  // Function to get the last 6 months' labels (e.g., "Jan 2025", "Feb 2025", etc.)
  const getLastSixMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }));
    }
    return months;
  };

  // Aggregate income and expenses by month for current and past entries only
  const aggregateByMonth = (data) => {
    const monthlyData = Array(6).fill(0);
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    data.forEach((item) => {
      const itemDate = new Date(item.date);
      if (itemDate >= sixMonthsAgo && itemDate <= today) {
        const monthDiff = (today.getFullYear() - itemDate.getFullYear()) * 12 + (today.getMonth() - itemDate.getMonth());
        if (monthDiff >= 0 && monthDiff < 6) {
          const index = 5 - monthDiff;
          monthlyData[index] += item.amount;
        }
      }
    });

    return monthlyData;
  };

  // Filter income and expenses up to today for the chart
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentIncome = financeData.income.filter((item) => new Date(item.date) <= today);
  const currentExpenses = financeData.expenses.filter((item) => new Date(item.date) <= today);

  const monthlyIncome = aggregateByMonth(currentIncome);
  const monthlyExpenses = aggregateByMonth(currentExpenses);
  const monthLabels = getLastSixMonths();

  // Create datasets for the line chart
  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Income',
        data: monthlyIncome,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(70, 179, 138, 0.3)');
          gradient.addColorStop(1, 'rgba(70, 179, 138, 0)');
          return gradient;
        },
        borderColor: '#328e6e',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: '#328e6e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Expenses',
        data: monthlyExpenses,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(231, 76, 60, 0.3)');
          gradient.addColorStop(1, 'rgba(231, 76, 60, 0)');
          return gradient;
        },
        borderColor: '#e74c3c',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: '#e74c3c',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 14,
          },
          color: '#2a7458',
          padding: 15,
          boxWidth: 20,
          boxHeight: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: true,
        text: 'Income vs Expenses Over Time',
        font: {
          family: "'Poppins', sans-serif",
          size: 20,
          weight: '600',
        },
        color: '#2a7458',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: "'Poppins', sans-serif",
          size: 14,
        },
        bodyFont: {
          family: "'Poppins', sans-serif",
          size: 12,
        },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `LKR ${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
          },
          color: '#2a7458',
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
          },
          color: '#2a7458',
          callback: (value) => `LKR ${value}`,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart',
    },
  };

  const dashboardStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .dashboard {
      margin-top: 80px;
      padding: 30px;
      flex-grow: 1;
      background: #ffffff;
      min-height: 100vh;
      font-family: 'Poppins', sans-serif;
      box-sizing: border-box;
      overflow-x: hidden;
    }

    .dashboard h1 {
      margin-bottom: 20px;
      color: #2a7458;
      font-weight: 600;
      font-size: clamp(1.8rem, 5vw, 2.5rem);
      text-align: center;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }

    .schedule-button {
      display: block;
      margin: 0 auto 20px;
      background: #46b38a;
      color: #ffffff;
      padding: 12px 25px;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: background 0.3s ease, transform 0.1s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      max-width: 200px;
    }

    .schedule-button:hover {
      background: #328e6e;
      transform: scale(1.02);
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: #ffffff;
      padding: 25px;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      position: relative;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-content h3 {
      margin-top: 0;
      margin-bottom: 20px;
      color: #2a7458;
      font-weight: 600;
      font-size: 1.5rem;
    }

    .modal-content form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      color: #2a7458;
      font-size: 0.95rem;
      margin-bottom: 5px;
    }

    .form-group input,
    .form-group select {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      font-family: 'Poppins', sans-serif;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #46b38a;
      box-shadow: 0 0 5px rgba(70, 179, 138, 0.3);
    }

    .modal-buttons {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .modal-buttons button {
      padding: 10px 20px;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-size: 1rem;
      font-family: 'Poppins', sans-serif;
      transition: background 0.3s ease, transform 0.1s ease;
    }

    .modal-buttons button.save {
      background: #46b38a;
      color: #ffffff;
    }

    .modal-buttons button.cancel {
      background: #e74c3c;
      color: #ffffff;
    }

    .modal-buttons button:hover {
      opacity: 0.9;
      transform: scale(1.02);
    }

    .chart-container {
      margin-bottom: 30px;
      padding: 25px;
      background: #f5f7fa;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      max-width: 800px;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
      height: auto;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      animation: fadeIn 0.5s ease-in-out;
    }

    .notification {
      margin-bottom: 20px;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      font-weight: 500;
      font-size: 1rem;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    .notification.warning {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    }

    .notification.critical {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .card {
      background: #ffffff;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .card:hover,
    .card:active {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .card h3 {
      margin-top: 0;
      margin-bottom: 15px;
      color: #2a7458;
      font-weight: 600;
      font-size: clamp(1.1rem, 2vw, 1.3rem);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card h4 {
      margin-top: 20px;
      margin-bottom: 10px;
      color: #2a7458;
      font-weight: 500;
      font-size: 1.1rem;
    }

    .card p {
      color: #5e6d55;
      font-size: clamp(0.9rem, 1.5vw, 1.1rem);
    }

    .card ul {
      list-style: none;
      padding: 0;
      margin: 0;
      max-height: 150px;
      overflow-y: auto;
    }

    .card ul li {
      margin: 8px 0;
      padding: 8px;
      background: #f5f7fa;
      border-radius: 6px;
      font-size: clamp(0.85rem, 1.2vw, 0.95rem);
      color: #5e6d55;
      transition: background 0.3s ease;
    }

    .card ul li:hover {
      background: #e6f0ea;
    }

    .card.income {
      border-left: 5px solid #328e6e;
    }

    .card.expense {
      border-left: 5px solid #e74c3c;
    }

    .card.profit {
      border-left: 5px solid #46b38a;
    }

    .card.salary {
      border-left: 5px solid #6bc4a1;
    }

    .card.payments {
      border-left: 5px solid #92b9a5;
    }

    .card.scheduled-payments {
      border-left: 5px solid #92b9a5;
    }

    .scheduled-payments-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: clamp(0.85rem, 1.2vw, 0.95rem);
    }

    .scheduled-payments-table th,
    .scheduled-payments-table td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      color: #5e6d55;
    }

    .scheduled-payments-table th {
      background: #f5f7fa;
      color: #2a7458;
      font-weight: 600;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .action-buttons button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      transition: color 0.3s ease;
    }

    .action-buttons button.edit {
      color: #46b38a;
    }

    .action-buttons button.delete {
      color: #e74c3c;
    }

    .action-buttons button:hover {
      opacity: 0.8;
    }

    .transactions {
      grid-column: span 2;
      background: #ffffff;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .transactions:hover,
    .transactions:active {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .transactions h3 {
      margin-top: 0;
      margin-bottom: 15px;
      color: #2a7458;
      font-weight: 600;
      font-size: clamp(1.1rem, 2vw, 1.3rem);
    }

    .transactions ul {
      list-style: none;
      padding: 0;
      margin: 0;
      max-height: 300px;
      overflow-y: auto;
    }

    .transactions ul li {
      margin: 12px 0;
      padding: 10px;
      background: #f5f7fa;
      border-radius: 6px;
      font-size: clamp(0.85rem, 1.2vw, 0.95rem);
      color: #5e6d55;
      transition: background 0.3s ease;
    }

    .transactions ul li:hover {
      background: #e6f0ea;
    }

    .error-message {
      text-align: center;
      color: #e74c3c;
      font-size: 1rem;
      margin-top: 20px;
    }

    @media (max-width: 768px) {
      .dashboard {
        margin-top: 120px;
        padding: 20px;
      }

      .dashboard-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
      }

      .transactions {
        grid-column: span 1;
      }

      .chart-container {
        max-width: 100%;
        padding: 15px;
      }

      .schedule-button {
        font-size: 0.9rem;
        padding: 10px 20px;
        max-width: 180px;
      }

      .modal-content {
        padding: 15px;
        width: 95%;
      }

      .modal-content h3 {
        font-size: 1.3rem;
      }

      .modal-buttons button {
        font-size: 0.9rem;
        padding: 8px 15px;
      }

      .scheduled-payments-table th,
      .scheduled-payments-table td {
        font-size: 0.85rem;
        padding: 6px;
      }
    }

    @media (max-width: 480px) {
      .dashboard {
        padding: 15px;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .card {
        padding: 15px;
      }

      .transactions {
        padding: 15px;
      }

      .schedule-button {
        font-size: 0.85rem;
        padding: 8px 15px;
        max-width: 160px;
      }

      .modal-content form {
        gap: 10px;
      }

      .modal-buttons {
        flex-direction: column;
      }

      .modal-buttons button {
        width: 100%;
      }

      .scheduled-payments-table {
        display: block;
        overflow-x: auto;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: dashboardStyles }} />
      <div className="dashboard">
        <h1>Finance Overview</h1>
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {notification && (
              <div className={`notification ${notification.type}`}>
                {notification.message}
              </div>
            )}
            <button className="schedule-button" onClick={() => setIsModalOpen(true)}>
              <FontAwesomeIcon icon={faPlus} />
              Schedule Payment
            </button>
            {isModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <h3>{editingPayment ? 'Edit Scheduled Payment' : 'Schedule a Payment'}</h3>
                  <form onSubmit={handlePaymentSubmit}>
                    <div className="form-group">
                      <label>Utility Type:</label>
                      <select
                        name="utilityType"
                        value={newPayment.utilityType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Utility</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Water">Water</option>
                        <option value="Internet">Internet</option>
                        <option value="Gas">Gas</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Amount (LKR):</label>
                      <input
                        type="number"
                        name="amount"
                        value={newPayment.amount}
                        onChange={handleInputChange}
                        required
                        min="1"
                      />
                    </div>
                    <div className="form-group">
                      <label>Due Date:</label>
                      <input
                        type="date"
                        name="dueDate"
                        value={newPayment.dueDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Frequency:</label>
                      <select
                        name="frequency"
                        value={newPayment.frequency}
                        onChange={handleInputChange}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                        <option value="one-time">One-Time</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Status:</label>
                      <select
                        name="status"
                        value={newPayment.status}
                        onChange={handleInputChange}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>
                    <div className="modal-buttons">
                      <button type="submit" className="save">
                        {editingPayment ? 'Update' : 'Save'}
                      </button>
                      <button
                        type="button"
                        className="cancel"
                        onClick={() => {
                          setIsModalOpen(false);
                          setEditingPayment(null);
                          setNewPayment({
                            utilityType: '',
                            amount: '',
                            dueDate: '',
                            frequency: 'monthly',
                            status: 'pending',
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>
            <div className="dashboard-grid">
              <div className="card income">
                <IncomeCard income={financeData.income} />
              </div>
              <div className="card expense">
                <ExpenseCard expenses={financeData.expenses} />
              </div>
              <div className="card profit">
                <ProfitCard profitLoss={financeData.profitLoss} />
              </div>
              <div className="card salary">
                <SalaryCard salaries={financeData.salaries} />
              </div>
              <div className="card payments">
                <PaymentsCard upcomingIncome={upcomingIncome} upcomingExpenses={upcomingExpenses} />
              </div>
              <div className="card scheduled-payments">
                <h3>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  Scheduled Payments
                </h3>
                {scheduledPayments.length > 0 ? (
                  <table className="scheduled-payments-table">
                    <thead>
                      <tr>
                        <th>Utility</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Frequency</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduledPayments.map((payment) => (
                        <tr key={payment._id}>
                          <td>{payment.utilityType}</td>
                          <td>LKR {payment.amount.toFixed(2)}</td>
                          <td>{payment.dueDate}</td>
                          <td>{payment.frequency}</td>
                          <td>{payment.status}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="edit"
                                onClick={() => handleEditPayment(payment)}
                                aria-label="Edit payment"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                className="delete"
                                onClick={() => handleDeletePayment(payment._id)}
                                aria-label="Delete payment"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No scheduled payments yet.</p>
                )}
              </div>
              <div className="transactions">
                <Transactions transactions={financeData.transactions} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;