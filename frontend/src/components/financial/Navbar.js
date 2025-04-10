import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../logo.svg';

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
      height: 100vh;
      font-family: 'Poppins', sans-serif;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: width 0.3s ease;
      z-index: 1000;
    }

    .navbar-logo {
      width: 60px;
      margin-bottom: 20px;
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

    .nav-links {
      list-style: none;
      padding: 0;
      width: 100%;
      flex-grow: 1;
    }

    .nav-links li {
      margin: 10px 0;
    }

    .nav-links a {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      color: #e6f0ea;
      text-decoration: none;
      font-size: 1rem;
      font-weight: 400;
      border-radius: 8px;
      transition: background 0.3s ease, color 0.3s ease, transform 0.1s ease;
    }

    .nav-links a:hover {
      background: #46b38a;
      color: #ffffff;
      transform: translateX(5px);
    }

    .nav-links a.active {
      background: #ffffff;
      color: #2a7458;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .nav-links a.active:hover {
      background: #e6f0ea;
      color: #2a7458;
    }

    @media (max-width: 768px) {
      .navbar {
        width: 100%;
        height: auto;
        position: relative;
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

      .nav-links {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 10px;
      }

      .nav-links li {
        margin: 5px;
      }

      .nav-links a {
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

      .nav-links a {
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
        <ul className="nav-links">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/income" className={location.pathname === '/income' ? 'active' : ''}>
              Income
            </Link>
          </li>
          <li>
            <Link to="/expense" className={location.pathname === '/expense' ? 'active' : ''}>
              Expenses
            </Link>
          </li>
          <li>
            <Link to="/salary" className={location.pathname === '/salary' ? 'active' : ''}>
              Salaries
            </Link>
          </li>
          <li>
            <Link to="/transactions" className={location.pathname === '/transactions' ? 'active' : ''}>
              View Transactions
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;