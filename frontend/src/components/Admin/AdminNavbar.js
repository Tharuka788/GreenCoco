import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faTachometerAlt,
  faChartLine,
  faBoxes,
  faShoppingCart,
  faTruck,
  faUsers,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

const AdminNavbar = ({ onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: faHome, label: 'Home' },
    { path: '/admin', icon: faTachometerAlt, label: 'Dashboard' },
    { path: '/admin/finance', icon: faChartLine, label: 'Finance Management' },
    { path: '/admin/inventory', icon: faBoxes, label: 'Inventory Management' },
    { path: '/admin/orders', icon: faShoppingCart, label: 'Order Management' },
    { path: '/admin/suppliers', icon: faTruck, label: 'Supplier Management' },
    { path: '/admin/employees', icon: faUsers, label: 'Employee Management' },
  ];

  const styles = `
    .admin-navbar {
      width: 280px;
      height: 100vh;
      background: #2a7458;
      position: fixed;
      left: 0;
      top: 0;
      color: white;
      padding: 2rem 0;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    }

    .nav-brand {
      padding: 0 1.5rem;
      margin-bottom: 2rem;
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-item {
      padding: 0.5rem 1.5rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-link.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .nav-icon {
      width: 20px;
      text-align: center;
    }

    .logout-button {
      position: absolute;
      bottom: 2rem;
      left: 1.5rem;
      right: 1.5rem;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 8px;
      color: white;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .logout-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .main-content {
      margin-left: 280px;
      padding: 2rem;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <nav className="admin-navbar">
        <Link to="/" className="nav-brand">
          <FontAwesomeIcon icon={faTachometerAlt} />
          GreenCoco Admin
        </Link>
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <button className="logout-button" onClick={onLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
          Logout
        </button>
      </nav>
    </>
  );
};

export default AdminNavbar; 