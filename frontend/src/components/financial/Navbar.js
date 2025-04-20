import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../logo.png';

const Navbar = () => {
  const location = useLocation();

  const navStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .navbar {
      width: 220px;
      background: linear-gradient(180deg, #2a7458 0%, #328e6e 100%);
      color: white;
      padding: 20px;
      position: fixed;
      top: 80px; /* Below the MainNavbar */
      height: calc(100vh - 80px);
      font-family: 'Poppins', sans-serif;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: width 0.3s ease;
      z-index: 1000;
    }

    .navbar-logo {
      width: 160px;
      margin-bottom: 5px;
      transition: transform 0.3s ease;
    }

    .navbar-logo:hover {
      transform: scale(1.1);
    }

    .navbar h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 30px;
      text-align: center;
      color: #ffffff;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    }

    .dropdown {
      position: relative;
      width: 100%;
    }

    .dropdown-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      font-size: 1rem;
      font-weight: 400;
      color: #e6f0ea;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .dropdown-toggle:hover {
      background: #46b38a;
      color: #ffffff;
    }

    .dropdown-menu {
      background: linear-gradient(180deg, #328e6e 0%, #46b38a 100%);
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-in-out;
      width: 100%;
      border-radius: 8px;
    }

    .dropdown:hover .dropdown-menu {
      max-height: 300px; /* Adjust based on content */
    }

    .dropdown-menu a {
      display: flex;
      align-items: center;
      padding: 12px 40px;
      color: #e6f0ea;
      text-decoration: none;
      font-size: 1rem;
      font-weight: 400;
      transition: background 0.3s ease, color 0.3s ease, transform 0.1s ease;
    }

    .dropdown-menu a:hover {
      background: #46b38a;
      color: #ffffff;
      transform: translateX(5px);
    }

    .dropdown-menu a.active {
      background: #ffffff;
      color: #2a7458;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .dropdown-menu a.active:hover {
      background: #e6f0ea;
      color: #2a7458;
    }

    @media (max-width: 768px) {
      .navbar {
        width: 100%;
        height: auto;
        position: relative;
        top: 0;
        padding: 15px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
      }

      .navbar-logo {
        width: 50px;
        margin-bottom: 0;
      }

      .navbar h2 {
        font-size: 1.2rem;
        margin-bottom: 0;
      }

      .dropdown {
        width: auto;
      }

      .dropdown-toggle {
        padding: 8px 15px;
        font-size: 0.9rem;
      }

      .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        width: 200px;
        background: linear-gradient(180deg, #328e6e 0%, #46b38a 100%);
        z-index: 1000;
      }

      .dropdown:hover .dropdown-menu {
        max-height: 300px;
      }

      .dropdown-menu a {
        padding: 8px 15px;
        font-size: 0.9rem;
      }
    }

    @media (max-width: 480px) {
      .navbar {
        padding: 10px;
      }

      .navbar-logo {
        width: 40px;
      }

      .navbar h2 {
        font-size: 1rem;
      }

      .dropdown-toggle {
        padding: 6px 10px;
        font-size: 0.85rem;
      }

      .dropdown-menu {
        width: 150px;
      }

      .dropdown-menu a {
        padding: 6px 10px;
        font-size: 0.85rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: navStyles }} />
      <nav className="navbar">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <h2>GreenCoco</h2>
        <div className="dropdown">
          <div className="dropdown-toggle">
            Finance
            <span>▼</span>
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
        </div>
      </nav>
    </>
  );
};

export default Navbar;