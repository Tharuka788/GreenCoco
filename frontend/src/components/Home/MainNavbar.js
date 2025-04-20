import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MainNavbar = () => {
  const location = useLocation();

  const navStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .main-navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background: #2a7458;
      color: white;
      padding: 15px 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: 'Poppins', sans-serif;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 2000;
    }

    .main-navbar-logo {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    .main-navbar-logo img {
      height: 80px; /* Adjust the height of the logo */
      width: auto;
    }

    .logo-fallback {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ffffff;
    }

    .main-nav-links {
      display: flex;
      align-items: center;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .main-nav-links li {
      position: relative;
      margin-left: 20px;
    }

    .main-nav-links a,
    .dropdown-toggle {
      color: #e6f0ea;
      text-decoration: none;
      font-size: 1rem;
      font-weight: 400;
      padding: 10px 15px;
      border-radius: 5px;
      transition: background 0.3s ease, color 0.3s ease;
    }

    .main-nav-links a:hover,
    .dropdown-toggle:hover {
      background: #46b38a;
      color: #ffffff;
    }

    .main-nav-links a.active {
      background: #ffffff;
      color: #2a7458;
      font-weight: 600;
    }

    .dropdown {
      position: relative;
    }

    .dropdown-toggle {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .dropdown-toggle::after {
      content: '▼';
      margin-left: 5px;
      font-size: 0.8rem;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background: #328e6e;
      min-width: 200px;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-in-out;
    }

    .dropdown:hover .dropdown-menu {
      max-height: 300px;
    }

    .dropdown-menu a {
      display: block;
      padding: 10px 15px;
      color: #e6f0ea;
      text-decoration: none;
      font-size: 0.95rem;
      transition: background 0.3s ease, color 0.3s ease;
    }

    .dropdown-menu a:hover {
      background: #46b38a;
      color: #ffffff;
    }

    .dropdown-menu a.active {
      background: #ffffff;
      color: #2a7458;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .main-navbar {
        flex-direction: column;
        padding: 10px;
      }

      .main-navbar-logo {
        margin-bottom: 10px;
      }

      .main-navbar-logo img {
        height: 30px; /* Smaller logo on mobile */
      }

      .logo-fallback {
        font-size: 1.2rem;
      }

      .main-nav-links {
        flex-direction: column;
        width: 100%;
      }

      .main-nav-links li {
        margin: 5px 0;
        width: 100%;
        text-align: center;
      }

      .main-nav-links a,
      .dropdown-toggle {
        padding: 8px 10px;
        font-size: 0.9rem;
      }

      .dropdown-menu {
        position: static;
        width: 100%;
        background: #328e6e;
      }

      .dropdown-menu a {
        padding: 8px 10px;
        font-size: 0.9rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: navStyles }} />
      <nav className="main-navbar">
        <Link to="/" className="main-navbar-logo">
          <img
            src="/logo.png"
            alt="Green Coco Logo"
            onError={(e) => {
              e.target.style.display = 'none'; // Hide the image if it fails to load
              e.target.nextSibling.style.display = 'block'; // Show the fallback text
            }}
          />
          <span className="logo-fallback" style={{ display: 'none' }}>
            GreenCoco
          </span>
        </Link>
        <ul className="main-nav-links">
          <li className="dropdown">
            <div className="dropdown-toggle">
              Financial Management
            </div>
            <div className="dropdown-menu">
              <Link
                to="/finance"
                className={location.pathname === '/finance' ? 'active' : ''}
              >
                Dashboard
              </Link>
              <Link
                to="/finance/income"
                className={location.pathname === '/finance/income' ? 'active' : ''}
              >
                Income
              </Link>
              <Link
                to="/finance/expense"
                className={location.pathname === '/finance/expense' ? 'active' : ''}
              >
                Expenses
              </Link>
              <Link
                to="/finance/salary"
                className={location.pathname === '/finance/salary' ? 'active' : ''}
              >
                Salaries
              </Link>
              <Link
                to="/finance/transactions"
                className={location.pathname === '/finance/transactions' ? 'active' : ''}
              >
                View Transactions
              </Link>
            </div>
          </li>
          <li>
            <Link
              to="/inventory"
              className={location.pathname === '/inventory' ? 'active' : ''}
            >
              Inventory Management
            </Link>
          </li>
          <li>
            <Link
              to="/delivery"
              className={location.pathname === '/delivery' ? 'active' : ''}
            >
              Delivery
            </Link>
          </li>
          <li>
            <Link
              to="/order-supplier"
              className={location.pathname === '/order-supplier' ? 'active' : ''}
            >
              Order & Supplier
            </Link>
          </li>
          <li>
            <Link
              to="/employee"
              className={location.pathname === '/employee' ? 'active' : ''}
            >
              Employee Management
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default MainNavbar;