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
  faUserPlus,
  faUserClock,
} from '@fortawesome/free-solid-svg-icons';

const MainNavbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isFinanceDropdownOpen, setIsFinanceDropdownOpen] = useState(false);
  const [isInventoryDropdownOpen, setIsInventoryDropdownOpen] = useState(false);
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
  const [isOrdersDropdownOpen, setIsOrdersDropdownOpen] = useState(false);
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isFinanceDropdownOpen) setIsFinanceDropdownOpen(false);
    if (isInventoryDropdownOpen) setIsInventoryDropdownOpen(false);
    if (isSupplierDropdownOpen) setIsSupplierDropdownOpen(false);
    if (isOrdersDropdownOpen) setIsOrdersDropdownOpen(false);
    if (isEmployeeDropdownOpen) setIsEmployeeDropdownOpen(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsFinanceDropdownOpen(false);
    setIsInventoryDropdownOpen(false);
    setIsSupplierDropdownOpen(false);
    setIsOrdersDropdownOpen(false);
    setIsEmployeeDropdownOpen(false);
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

  const toggleEmployeeDropdown = () => {
    setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen);
    setIsFinanceDropdownOpen(false);
    setIsInventoryDropdownOpen(false);
    setIsSupplierDropdownOpen(false);
    setIsOrdersDropdownOpen(false);
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

  const isEmployeeActive = [
    '/employee',
    '/attendance'
  ].includes(location.pathname);

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
      transition: all 0.3s ease;
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
      backdrop-filter: blur(10px);
      list-style: none;
      padding: 8px 0;
      margin: 0;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      min-width: 200px;
      z-index: 1001;
    }

    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-menu li {
      margin: 0;
      padding: 0;
    }

    .dropdown-menu a {
      padding: 10px 20px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background 0.3s ease;
    }

    .dropdown-menu a:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .dropdown-arrow {
      font-size: 0.8em;
      transition: transform 0.3s ease;
    }

    .dropdown-arrow.open {
      transform: rotate(180deg);
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
        padding: 0 15px;
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
        position: absolute;
        top: 80px;
        left: 0;
        right: 0;
        background: rgba(42, 116, 88, 0.95);
        backdrop-filter: blur(10px);
        padding: 20px;
        flex-direction: column;
        gap: 10px;
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .navbar-menu.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }

      .navbar-menu li {
        margin: 0;
        width: 100%;
      }

      .dropdown-menu {
        position: static;
        background: rgba(59, 156, 115, 0.5);
        margin-top: 5px;
        transform: none;
        box-shadow: none;
        width: 100%;
        padding: 0;
      }

      .dropdown-menu.show {
        opacity: 1;
        visibility: visible;
        transform: none;
      }

      .dropdown-toggle {
        width: 100%;
        justify-content: space-between;
        padding: 15px 20px;
        font-size: 1.1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .dropdown-menu a {
        padding: 12px 30px;
        font-size: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .dropdown-menu a:last-child {
        border-bottom: none;
      }

      .dropdown-menu li {
        margin: 0;
      }

      .dropdown-arrow {
        margin-left: auto;
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
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`dropdown-arrow ${isFinanceDropdownOpen ? 'open' : ''}`}
                />
              </div>
              <ul
                className={`dropdown-menu ${isFinanceDropdownOpen ? 'show' : ''}`}
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
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`dropdown-arrow ${isInventoryDropdownOpen ? 'open' : ''}`}
                />
              </div>
              <ul
                className={`dropdown-menu ${isInventoryDropdownOpen ? 'show' : ''}`}
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
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`dropdown-arrow ${isSupplierDropdownOpen ? 'open' : ''}`}
                />
              </div>
              <ul
                className={`dropdown-menu ${isSupplierDropdownOpen ? 'show' : ''}`}
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
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`dropdown-arrow ${isOrdersDropdownOpen ? 'open' : ''}`}
                />
              </div>
              <ul
                className={`dropdown-menu ${isOrdersDropdownOpen ? 'show' : ''}`}
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
              <div
                className={`dropdown-toggle ${isEmployeeActive ? 'active' : ''}`}
                onClick={toggleEmployeeDropdown}
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={isEmployeeDropdownOpen}
              >
                <FontAwesomeIcon icon={faUsers} /> Employees
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`dropdown-arrow ${isEmployeeDropdownOpen ? 'open' : ''}`}
                />
              </div>
              <ul className={`dropdown-menu ${isEmployeeDropdownOpen ? 'show' : ''}`}>
                <li>
                  <Link to="/employee" onClick={closeMenu}>
                    <FontAwesomeIcon icon={faChartBar} /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/employee" onClick={() => { closeMenu(); /* Add any additional logic to show the form */ }}>
                    <FontAwesomeIcon icon={faUserPlus} /> Add Employee
                  </Link>
                </li>
                <li>
                  <Link to="/attendance" onClick={closeMenu}>
                    <FontAwesomeIcon icon={faUserClock} /> Attendance
                  </Link>
                </li>
              </ul>
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
          </ul>
        </div>
      </nav>
    </>
  );
};

export default MainNavbar;