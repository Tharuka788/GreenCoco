// src/components/Employee/EmployeeManagement.js
import React from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import AddEmployee from './AddEmployee'; // Corrected import
import EmployeeList from './EmployeeList';

const EmployeeManagement = () => {
  const location = useLocation(); // Added to access location.pathname

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .employee-management {
      margin-top: 80px; /* Space for fixed MainNavbar */
      padding: 40px;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e6f0ea 100%);
      font-family: 'Poppins', sans-serif;
      text-align: center;
    }

    .employee-management h1 {
      font-size: 2.5rem;
      font-weight: 600;
      color: #2a7458;
      margin-bottom: 20px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }

    .employee-nav {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 30px;
    }

    .employee-nav a {
      text-decoration: none;
      font-size: 1.1rem;
      font-weight: 500;
      color: #328e6e;
      padding: 10px 20px;
      border-radius: 8px;
      transition: background 0.3s ease, color 0.3s ease;
    }

    .employee-nav a:hover {
      background: #46b38a;
      color: #ffffff;
    }

    .employee-nav a.active {
      background: #ffffff;
      color: #2a7458;
      font-weight: 600;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
      .employee-management {
        padding: 20px;
        margin-top: 120px; /* Adjust for taller navbar */
      }

      .employee-management h1 {
        font-size: 2rem;
      }

      .employee-nav {
        flex-direction: column;
        gap: 10px;
      }

      .employee-nav a {
        font-size: 1rem;
        padding: 8px 16px;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="employee-management">
        <h1>Employee Management</h1>
        <nav className="employee-nav">
          <Link
            to="/employee/add"
            className={location.pathname === '/employee/add' ? 'active' : ''}
          >
            Add Employee
          </Link>
          <Link
            to="/employee/list"
            className={location.pathname === '/employee/list' ? 'active' : ''}
          >
            Employee List
          </Link>
        </nav>
        <Routes>
          <Route path="add" element={<AddEmployee />} />
          <Route path="list" element={<EmployeeList />} />
        </Routes>
      </div>
    </>
  );
};

export default EmployeeManagement;