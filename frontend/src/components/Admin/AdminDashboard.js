import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillWave,
  faBoxes,
  faShoppingCart,
  faTruck,
  faUsers,
  faShippingFast
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

const AdminDashboard = () => {
  const [overviewData, setOverviewData] = useState({
    totalRevenue: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    activeSuppliers: 0,
    employeeCount: 0,
    pendingDeliveries: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get('http://localhost:5000/api/admins/overview', config);
        setOverviewData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching overview data:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/admin/login');
        }
        toast.error('Failed to fetch dashboard data');
        setIsLoading(false);
      }
    };

    fetchOverviewData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const styles = `
    .admin-layout {
      display: flex;
      min-height: 100vh;
    }

    .admin-content {
      flex: 1;
      margin-left: 280px;
      padding: 2rem;
      background: #f5f5f5;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-title {
      font-size: 2rem;
      color: #333;
      margin: 0;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .dashboard-card {
      background: white;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .dashboard-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .card-icon {
      font-size: 1.5rem;
      padding: 0.8rem;
      border-radius: 50%;
      color: white;
    }

    .card-title {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
    }

    .card-value {
      font-size: 1.8rem;
      font-weight: 600;
      color: #333;
      margin: 0;
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
      .admin-content {
        margin-left: 0;
        padding: 1rem;
      }

      .dashboard-title {
        font-size: 1.5rem;
      }

      .cards-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  const cards = [
    {
      title: 'Total Revenue',
      value: `$${overviewData.totalRevenue.toLocaleString()}`,
      icon: faMoneyBillWave,
      color: '#4CAF50'
    },
    {
      title: 'Low Stock Items',
      value: overviewData.lowStockItems,
      icon: faBoxes,
      color: '#FF9800'
    },
    {
      title: 'Pending Orders',
      value: overviewData.pendingOrders,
      icon: faShoppingCart,
      color: '#2196F3'
    },
    {
      title: 'Active Suppliers',
      value: overviewData.activeSuppliers,
      icon: faTruck,
      color: '#9C27B0'
    },
    {
      title: 'Total Employees',
      value: overviewData.employeeCount,
      icon: faUsers,
      color: '#E91E63'
    },
    {
      title: 'Pending Deliveries',
      value: overviewData.pendingDeliveries,
      icon: faShippingFast,
      color: '#00BCD4'
    }
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="admin-layout">
        <AdminNavbar onLogout={handleLogout} />
        <main className="admin-content">
          {isLoading ? (
            <div className="loading">Loading dashboard data...</div>
          ) : (
            <>
              <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard Overview</h1>
              </div>
              <div className="cards-grid">
                {cards.map((card, index) => (
                  <div key={index} className="dashboard-card">
                    <div className="card-header">
                      <FontAwesomeIcon
                        icon={card.icon}
                        className="card-icon"
                        style={{ backgroundColor: card.color }}
                      />
                      <h3 className="card-title">{card.title}</h3>
                    </div>
                    <p className="card-value">{card.value}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminDashboard; 