import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faWallet,
  faBox,
  faTruck,
  faUsers,
  faBars,
  faTimes,
  faChevronDown,
  faChartBar,
  faPlus,
  faExclamationTriangle,
  faChartLine,
  faMoneyBillWave,
  faCreditCard,
  faHandHoldingUsd,
  faExchangeAlt,
  faPeopleCarry,
  faSignInAlt,
  faUserPlus, // Added for Admin Register
} from '@fortawesome/free-solid-svg-icons';

const MainNavbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isFinanceDropdownOpen, setIsFinanceDropdownOpen] = useState(false);
  const [isInventoryDropdownOpen, setIsInventoryDropdownOpen] = useState(false);
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
  const [isOrdersDropdownOpen, setIsOrdersDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isFinanceDropdownOpen) setIsFinanceDropdownOpen(false);
    if (isInventoryDropdownOpen) setIsInventoryDropdownOpen(false);
    if (isSupplierDropdownOpen) setIsSupplierDropdownOpen(false);
    if (isOrdersDropdownOpen) setIsOrdersDropdownOpen(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsFinanceDropdownOpen(false);
    setIsInventoryDropdownOpen(false);
    setIsSupplierDropdownOpen(false);
    setIsOrdersDropdownOpen(false);
  };

  const toggleFinanceDropdown = () => {
    setIsFinanceDropdownOpen(!isFinanceDropdownOpen);
    setIsInventoryDropdownOpen(false);
    setIsSupplierDropdownOpen(false);
    setIsOrdersDropdownOpen(false);
  };

  const toggleInventoryDropdown = () => {
    setIsInventoryDropdownOpen(!isInventoryDropdownOpen);
    setIsFinanceDropdownOpen(false);
    setIsSupplierDropdownOpen(false);
    setIsOrdersDropdownOpen(false);
  };

  const toggleSupplierDropdown = () => {
    setIsSupplierDropdownOpen(!isSupplierDropdownOpen);
    setIsFinanceDropdownOpen(false);
    setIsInventoryDropdownOpen(false);
    setIsOrdersDropdownOpen(false);
  };

  const toggleOrdersDropdown = () => {
    setIsOrdersDropdownOpen(!isOrdersDropdownOpen);
    setIsFinanceDropdownOpen(false);
    setIsInventoryDropdownOpen(false);
    setIsSupplierDropdownOpen(false);
  };

  const isFinanceActive = [
    '/finance',
    '/finance/income',
    '/finance/expense',
    '/finance/salary',
    '/finance/transactions',
  ].includes(location.pathname);

  const isInventoryActive = [
    '/inventory',
    '/inventory/add',
    '/inventory/details',
    '/inventory/edit',
    '/inventory/low-stock',
    '/inventory/dashboard',
  ].some((path) => location.pathname.startsWith(path));

  const isSupplierActive = ['/suppliers'].includes(location.pathname);

  const isOrdersActive = ['/orders', '/orders/add'].includes(location.pathname);

  const isAdminLoginActive = location.pathname === '/admin/login';
  const isAdminRegisterActive = location.pathname === '/admin/register';

  const navbarStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background: linear-gradient(90deg, #2a7458 0%, #3b9c73 100%);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      font-family: 'Poppins', sans-serif;
    }

    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      height: 80px;
    }

    .navbar-logo {
      font-size: 1.8rem;
      font-weight: 600;
      color: #ffffff;
      text-decoration: none;
      letter-spacing: 1px;
    }

    .navbar-menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .navbar-menu li {
      margin-left: 20px;
      position: relative;
    }

    .navbar-menu a {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 15px;
      color: #e6f0ea;
      text-decoration: none;
      font-size: 1rem;
      border-radius: 5px;
      transition: background 0.3s ease, color 0.3s ease;
    }

    .navbar-menu a:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }

    .navbar-menu a.active {
      background: #ffffff;
      color: #2a7458;
      font-weight: 600;
    }

    .dropdown-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 10px 15px;
      color: #e6f0ea;
      border-radius: 5px;
      transition: background 0.3s ease, color 0.3s ease;
    }

    .dropdown-toggle:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }

    .dropdown-toggle.active {
      background: #ffffff;
      color: #2a7458;
      font-weight: 600;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background: rgba(59, 156, 115, 0.9);
      list-style: none;
      padding: 0;
      margin: 0;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      display: none;
      min-width: 200px;
      z-index: 1001;
    }

    .navbar-menu li:hover .dropdown-menu {
      display: block;
    }

    .dropdown-menu.active {
      display: block;
    }

    .dropdown-menu li {
      margin: 0;
    }

    .dropdown-menu a {
      padding: 10px 15px;
      color: #e6f0ea;
      display: block;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .dropdown-menu a:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    .dropdown-menu a.active {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      font-weight: 600;
    }

    .navbar-toggle {
      display: none;
      background: none;
      border: none;
      color: #ffffff;
      font-size: 1.5rem;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .navbar-container {
        height: auto;
        flex-direction: column;
        align-items: flex-start;
        padding: 10px 20px;
      }

      .navbar-logo {
        font-size: 1.5rem;
        padding: 10px 0;
      }

      .navbar-toggle {
        display: block;
        position: absolute;
        top: 20px;
        right: 20px;
      }

      .navbar-menu {
        display: ${isOpen ? 'flex' : 'none'};
        flex-direction: column;
        width: 100%;
        background: #2a7458;
        padding: 10px 0;
      }

      .navbar-menu li {
        margin: 0;
      }

      .navbar-menu a {
        padding: 15px 20px;
        font-size: 1.1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .navbar-menu a.active {
        background: rgba(255, 255, 255, 0.3);
        color: #ffffff;
      }

      .dropdown-toggle {
        padding: 15px 20px;
        font-size: 1.1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .dropdown-toggle.active {
        background: rgba(255, 255, 255, 0.3);
        color: #ffffff;
      }

      .navbar-menu li:hover .dropdown-menu {
        display: none;
      }

      .dropdown-menu {
        position: static;
        box-shadow: none;
        background: rgba(50, 142, 110, 0.9);
        width: 100%;
      }

      .dropdown-menu a {
        padding-left: 30px;
        font-size: 1rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: navbarStyles }} />
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            GreenCoco
          </Link>
          <button className="navbar-toggle" onClick={toggleMenu} aria-label={isOpen ? 'Close menu' : 'Open menu'}>
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </button>
          <ul className={`navbar-menu ${isOpen ? 'active' : ''}`} role="menubar">
            <li role="none">
              <Link
                to="/"
                className={location.pathname === '/' ? 'active' : ''}
                role="menuitem"
                onClick={closeMenu}
              >
                <FontAwesomeIcon icon={faHome} /> Home
              </Link>
            </li>
            <li role="none">
              <div
                className={`dropdown-toggle ${isFinanceActive ? 'active' : ''}`}
                onClick={toggleFinanceDropdown}
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={isFinanceDropdownOpen}
              >
                <FontAwesomeIcon icon={faWallet} /> Finance
                <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '5px' }} />
              </div>
              <ul
                className={`dropdown-menu ${isFinanceDropdownOpen ? 'active' : ''}`}
                role="menu"
              >
                <li role="none">
                  <Link
                    to="/finance"
                    className={location.pathname === '/finance' ? 'active' : ''}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faChartLine} /> Dashboard
                  </Link>
                </li>
                <li role="none">
                  <Link
                    to="/finance/income"
                    className={location.pathname === '/finance/income' ? 'active' : ''}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faMoneyBillWave} /> Income Page
                  </Link>
                </li>
                <li role="none">
                  <Link
                    to="/finance/expense"
                    className={location.pathname === '/finance/expense' ? 'active' : ''}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faCreditCard} /> Expense Page
                  </Link>
                </li>
                <li role="none">
                  <Link
                    to="/finance/salary"
                    className={location.pathname === '/finance/salary' ? 'active' : ''}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faHandHoldingUsd} /> Salary Page
                  </Link>
                </li>
                <li role="none">
                  <Link
                    to="/finance/transactions"
                    className={location.pathname === '/finance/transactions' ? 'active' : ''}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faExchangeAlt} /> View Transactions
                  </Link>
                </li>
              </ul>
            </li>
            <li role="none">
              <div
                className={`dropdown-toggle ${isInventoryActive ? 'active' : ''}`}
                onClick={toggleInventoryDropdown}
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={isInventoryDropdownOpen}
              >
                <FontAwesomeIcon icon={faBox} /> Inventory
                <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '5px' }} />
              </div>
              <ul
                className={`dropdown-menu ${isInventoryDropdownOpen ? 'active' : ''}`}
                role="menu"
              >
                <li role="none">
                  <Link
                    to="/inventory"
                    className={location.pathname === '/inventory' ? 'active' : ''}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    Manage Inventory
                  </Link>
                </li>
                <li role="none">
                  <Link
                    to="/inventory/add"
                    className={location.pathname === '/inventory/add' ? 'active' : ''}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Inventory
                  </Link>
                </li>
                <li role="none">
                  <Link
                    to="/inventory/low-stock"
                    className={location.pathname === '/inventory/low-stock' ? 'active' : ''}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faExclamationTriangle} /> Low Stock Report
                  </Link>
                </li>
                <li role="none">
                  <Link
                    to="/inventory/dashboard"
                    className={location.pathname === '/inventory/dashboard' ? 'active' : ''}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faChartBar} /> Dashboard
                  </Link>
                </li>
              </ul>
            </li>
            <li role="none">
              <div
                className={`dropdown-toggle ${isSupplierActive ? 'active' : ''}`}
                onClick={toggleSupplierDropdown}
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={isSupplierDropdownOpen}
              >
                <FontAwesomeIcon icon={faPeopleCarry} /> Supplier
                <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '5px' }} />
              </div>
              <ul
                className={`dropdown-menu ${isSupplierDropdownOpen ? 'active' : ''}`}
                role="menu"
              >
                <li role="none">
                  <Link
                    to="/suppliers"
                    className={location.pathname === '/suppliers' ? 'active' : ''}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faChartBar} /> Supplier Dashboard
                  </Link>
                </li>
              </ul>
            </li>
            <li role="none">
              <div
                className={`dropdown-toggle ${isOrdersActive ? 'active' : ''}`}
                onClick={toggleOrdersDropdown}
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={isOrdersDropdownOpen}
              >
                <FontAwesomeIcon icon={faTruck} /> Orders
                <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '5px' }} />
              </div>
              <ul
                className={`dropdown-menu ${isOrdersDropdownOpen ? 'active' : ''}`}
                role="menu"
              >
                <li role="none">
                  <Link
                    to="/orders"
                    className={location.pathname === '/orders' ? 'active' : ''}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faTruck} /> Orders Dashboard
                  </Link>
                </li>
                <li role="none">
                  <Link
                    to="/orders/add"
                    className={location.pathname === '/orders/add' ? 'active' : ''}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Order
                  </Link>
                </li>
              </ul>
            </li>
            <li role="none">
              <Link
                to="/employee"
                className={location.pathname === '/employee' ? 'active' : ''}
                role="menuitem"
                onClick={closeMenu}
              >
                <FontAwesomeIcon icon={faUsers} /> Employee Management
              </Link>
            </li>
            <li role="none">
              <Link
                to="/login"
                className={location.pathname === '/login' ? 'active' : ''}
                role="menuitem"
                onClick={closeMenu}
              >
                <FontAwesomeIcon icon={faSignInAlt} /> Login
              </Link>
            </li>
            <li role="none">
              <Link
                to="/admin/login"
                className={isAdminLoginActive ? 'active' : ''}
                role="menuitem"
                onClick={closeMenu}
              >
                <FontAwesomeIcon icon={faSignInAlt} /> Admin Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default MainNavbar;