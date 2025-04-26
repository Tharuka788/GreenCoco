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
  faUserClock,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';

const MainNavbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isFinanceDropdownOpen, setIsFinanceDropdownOpen] = useState(false);
  const [isInventoryDropdownOpen, setIsInventoryDropdownOpen] = useState(false);
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
  const [isOrdersDropdownOpen, setIsOrdersDropdownOpen] = useState(false);
  const [isTransportDropdownOpen, setIsTransportDropdownOpen] = useState(false);
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isFinanceDropdownOpen) setIsFinanceDropdownOpen(false);
    if (isInventoryDropdownOpen) setIsInventoryDropdownOpen(false);
    if (isSupplierDropdownOpen) setIsSupplierDropdownOpen(false);
    if (isOrdersDropdownOpen) setIsOrdersDropdownOpen(false);
    if (isTransportDropdownOpen) setIsTransportDropdownOpen(false);
    if (isEmployeeDropdownOpen) setIsEmployeeDropdownOpen(false);
    if (isAdminDropdownOpen) setIsAdminDropdownOpen(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsFinanceDropdownOpen(false);
    setIsInventoryDropdownOpen(false);
    setIsSupplierDropdownOpen(false);
    setIsOrdersDropdownOpen(false);
    setIsTransportDropdownOpen(false);
    setIsEmployeeDropdownOpen(false);
    setIsAdminDropdownOpen(false);
  };

  const toggleFinanceDropdown = () => {
    setIsFinanceDropdownOpen(!isFinanceDropdownOpen);
    setIsInventoryDropdownOpen(false);
    setIsSupplierDropdownOpen(false);
    setIsOrdersDropdownOpen(false);
    setIsTransportDropdownOpen(false);
    setIsEmployeeDropdownOpen(false);
  };

  const toggleInventoryDropdown = () => {
    setIsInventoryDropdownOpen(!isInventoryDropdownOpen);
    setIsFinanceDropdownOpen(false);
    setIsSupplierDropdownOpen(false);
    setIsOrdersDropdownOpen(false);
    setIsTransportDropdownOpen(false);
    setIsEmployeeDropdownOpen(false);
  };

  const toggleSupplierDropdown = () => {
    setIsSupplierDropdownOpen(!isSupplierDropdownOpen);
    setIsFinanceDropdownOpen(false);
    setIsInventoryDropdownOpen(false);
    setIsOrdersDropdownOpen(false);
    setIsTransportDropdownOpen(false);
    setIsEmployeeDropdownOpen(false);
  };

  const toggleOrdersDropdown = () => {
    setIsOrdersDropdownOpen(!isOrdersDropdownOpen);
    setIsFinanceDropdownOpen(false);
    setIsInventoryDropdownOpen(false);
    setIsSupplierDropdownOpen(false);
    setIsTransportDropdownOpen(false);
    setIsEmployeeDropdownOpen(false);
  };

  const toggleTransportDropdown = () => {
    setIsTransportDropdownOpen(!isTransportDropdownOpen);
    setIsFinanceDropdownOpen(false);
    setIsInventoryDropdownOpen(false);
    setIsSupplierDropdownOpen(false);
    setIsEmployeeDropdownOpen(false);
    setIsOrdersDropdownOpen(false);
  };

  const toggleEmployeeDropdown = () => {
    setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen);
    setIsFinanceDropdownOpen(false);
    setIsInventoryDropdownOpen(false);
    setIsSupplierDropdownOpen(false);
    setIsOrdersDropdownOpen(false);
    setIsTransportDropdownOpen(false);
  };

  const toggleAdminDropdown = () => {
    setIsAdminDropdownOpen(!isAdminDropdownOpen);
    setIsFinanceDropdownOpen(false);
    setIsInventoryDropdownOpen(false);
    setIsSupplierDropdownOpen(false);
    setIsOrdersDropdownOpen(false);
    setIsTransportDropdownOpen(false);
    setIsEmployeeDropdownOpen(false);
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

  const isTransportActive = ['/transport', '/transpory'].includes(location.pathname);

  const isEmployeeActive = ['/employee', '/attendance'].includes(location.pathname);

  const isAdminLoginActive = ['/admin/login'].includes(location.pathname);

  const isAdminActive = ['/admin', '/admin/login', '/admin/register'].includes(location.pathname);

  const navbarStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background: linear-gradient(135deg, #2a7458 0%, #3b9c73 100%);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      font-family: 'Poppins', sans-serif;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      height: 70px;
    }

    .navbar-logo {
      font-size: 1.8rem;
      font-weight: 600;
      color: #ffffff;
      text-decoration: none;
      letter-spacing: 0.5px;
      transition: transform 0.3s ease;
    }

    .navbar-logo:hover {
      transform: translateY(-1px);
    }

    .navbar-menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 8px;
    }

    .navbar-menu li {
      position: relative;
    }

    .navbar-menu a {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .navbar-menu a:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      transform: translateY(-1px);
    }

    .navbar-menu a.active {
      background: #ffffff;
      color: #2a7458;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .dropdown-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 8px 16px;
      color: rgba(255, 255, 255, 0.9);
      border-radius: 6px;
      transition: all 0.2s ease;
      font-weight: 500;
      font-size: 0.95rem;
    }

    .dropdown-toggle:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      transform: translateY(-1px);
    }

    .dropdown-toggle.active {
      background: #ffffff;
      color: #2a7458;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      list-style: none;
      padding: 8px;
      margin: 0;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 220px;
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
      padding: 10px 16px;
      color: #2a7458;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.2s ease;
      border-radius: 6px;
      font-weight: 500;
    }

    .dropdown-menu a:hover {
      background: rgba(42, 116, 88, 0.1);
      color: #2a7458;
      transform: translateX(4px);
    }

    .dropdown-menu a.active {
      background: #2a7458;
      color: #ffffff;
      font-weight: 600;
    }

    .dropdown-arrow {
      font-size: 0.8em;
      transition: transform 0.2s ease;
      opacity: 0.8;
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
      padding: 8px;
      border-radius: 6px;
      transition: background 0.2s ease;
    }

    .navbar-toggle:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    @media (max-width: 1024px) {
      .navbar-container {
        padding: 0 16px;
      }

      .navbar-menu a,
      .dropdown-toggle {
        padding: 8px 12px;
        font-size: 0.9rem;
      }
    }

    @media (max-width: 768px) {
      .navbar-container {
        height: auto;
        padding: 16px;
        flex-direction: column;
        align-items: flex-start;
      }

      .navbar-logo {
        font-size: 1.6rem;
        margin-bottom: 4px;
      }

      .navbar-toggle {
        display: block;
        position: absolute;
        top: 16px;
        right: 16px;
      }

      .navbar-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #2a7458;
        padding: 16px;
        flex-direction: column;
        gap: 8px;
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }

      .navbar-menu.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }

      .navbar-menu li {
        width: 100%;
      }

      .dropdown-menu {
        position: static;
        background: rgba(255, 255, 255, 0.05);
        margin-top: 8px;
        transform: none;
        box-shadow: none;
        padding: 4px;
      }

      .dropdown-menu.show {
        transform: none;
      }

      .dropdown-toggle {
        width: 100%;
        justify-content: space-between;
      }

      .dropdown-menu a {
        padding: 12px 16px;
        color: rgba(255, 255, 255, 0.9);
      }

      .dropdown-menu a:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }

      .dropdown-menu a.active {
        background: rgba(255, 255, 255, 0.15);
        color: #ffffff;
      }
    }

    @media (max-width: 480px) {
      .navbar-container {
        padding: 12px;
      }

      .navbar-logo {
        font-size: 1.4rem;
      }

      .navbar-toggle {
        top: 12px;
        right: 12px;
      }

      .navbar-menu {
        padding: 12px;
      }

      .dropdown-menu a {
        padding: 10px 12px;
        font-size: 0.9rem;
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
                className={`dropdown-toggle ${isTransportActive ? 'active' : ''}`}
                onClick={toggleTransportDropdown}
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={isTransportDropdownOpen}
              >
                <FontAwesomeIcon icon={faTruck} /> Transport
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`dropdown-arrow ${isTransportDropdownOpen ? 'open' : ''}`}
                />
              </div>
              <ul
                className={`dropdown-menu ${isTransportDropdownOpen ? 'show' : ''}`}
                role="menu"
              >
                <li role="none">
                  <Link
                    to="/tr"
                    className={location.pathname === '/tr' ? 'active' : ''}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faTruck} /> Transport Dashboard
                  </Link>
                </li>
                <li role="none">
                  <Link
                    to="/transport/add"
                    className={location.pathname === '/transport/add' ? 'active' : ''}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    
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
                    <FontAwesomeIcon icon={faPlus} /> Add Employee
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
            <li role="none">
              <div
                className={`dropdown-toggle ${isAdminActive ? 'active' : ''}`}
                onClick={toggleAdminDropdown}
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={isAdminDropdownOpen}
              >
                <FontAwesomeIcon icon={faUserShield} /> Admin
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`dropdown-arrow ${isAdminDropdownOpen ? 'open' : ''}`}
                />
              </div>
              <ul
                className={`dropdown-menu ${isAdminDropdownOpen ? 'show' : ''}`}
                role="menu"
              >
                <li role="none">
                  <Link
                    to="/admin"
                    className={location.pathname === '/admin' ? 'active' : ''}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faChartBar} /> Dashboard
                  </Link>
                </li>
                <li role="none">
                  <Link
                    to="/admin/login"
                    className={location.pathname === '/admin/login' ? 'active' : ''}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faSignInAlt} /> Login
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default MainNavbar;