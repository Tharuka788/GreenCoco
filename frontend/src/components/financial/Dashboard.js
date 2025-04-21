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
  const [upcomingIncome, setUpcomingIncome] = useState([]);
  const [upcomingExpenses, setUpcomingExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const { refreshTrigger } = useFinance();

  const fetchData = async () => {
    try {
      setError(null);
      const [incomeRes, expenseRes, salaryRes, profitRes, transRes] = await Promise.all([
        axios.get('http://localhost:5000/api/finance/income'),
        axios.get('http://localhost:5000/api/finance/expense'),
        axios.get('http://localhost:5000/api/finance/salary'),
        axios.get('http://localhost:5000/api/finance/profit-loss'),
        axios.get('http://localhost:5000/api/finance/transactions'),
      ]);

      const newFinanceData = {
        income: incomeRes.data,
        expenses: expenseRes.data,
        salaries: salaryRes.data,
        profitLoss: profitRes.data,
        transactions: transRes.data,
      };

      setFinanceData(newFinanceData);

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
      margin-bottom: 30px;
      color: #2a7458;
      font-weight: 600;
      font-size: clamp(1.8rem, 5vw, 2.5rem);
      text-align: center;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
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