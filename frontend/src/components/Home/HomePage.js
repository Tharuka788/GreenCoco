import React from 'react';
import { Link } from 'react-router-dom';
import MainNavbar from './MainNavbar';

const HomePage = () => {
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .home-page {
      margin-top: 80px; /* Space for the fixed MainNavbar */
      padding: 40px;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e6f0ea 100%);
      font-family: 'Poppins', sans-serif;
      text-align: center;
    }

    .home-page h1 {
      font-size: 3rem;
      font-weight: 600;
      color: #2a7458;
      margin-bottom: 20px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }

    .home-page p {
      font-size: 1.2rem;
      color: #5e6d55;
      margin-bottom: 40px;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    .home-functions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .function-card {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      padding: 20px;
      width: 200px;
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .function-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    .function-card a {
      text-decoration: none;
      font-size: 1.1rem;
      font-weight: 500;
      color: #328e6e;
      transition: color 0.3s ease;
    }

    .function-card a:hover {
      color: #46b38a;
    }

    @media (max-width: 768px) {
      .home-page {
        padding: 20px;
        margin-top: 120px; /* Adjust for taller navbar on smaller screens */
      }

      .home-page h1 {
        font-size: 2rem;
      }

      .home-page p {
        font-size: 1rem;
      }

      .function-card {
        width: 150px;
        padding: 15px;
      }

      .function-card a {
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .home-page h1 {
        font-size: 1.5rem;
      }

      .home-page p {
        font-size: 0.9rem;
      }

      .function-card {
        width: 100%;
        max-width: 300px;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <MainNavbar />
      <div className="home-page">
        <h1>Welcome to GreenCoco</h1>
        <p>
          Your all-in-one solution for managing business operations efficiently. Navigate through our main functions to get started.
        </p>
        <div className="home-functions">
          <div className="function-card">
            <Link to="/finance">Finance Management</Link>
          </div>
          <div className="function-card">
            <Link to="/inventory">Inventory Management</Link>
          </div>
          <div className="function-card">
            <Link to="/delivery">Delivery</Link>
          </div>
          <div className="function-card">
            <Link to="/order-supplier">Order & Supplier Management</Link>
          </div>
          <div className="function-card">
            <Link to="/employee">Employee Management</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;