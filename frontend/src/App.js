// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InventoryDashboard from './components/Inventory/InventoryDashboard';
import HomePage from './components/Home/HomePage';
import MainNavbar from './components/Home/MainNavbar';
import Dashboard from './components/financial/Dashboard';
import IncomePage from './components/financial/IncomePage';
import ExpensePage from './components/financial/ExpensePage';
import SalaryPage from './components/financial/SalaryPage';
import TransactionsPage from './components/financial/TransactionsPage';
import InventoryManagement from './components/Inventory/InventoryManagement';
import InventoryForm from './components/Inventory/InventoryForm';
import InventoryDetails from './components/Inventory/InventoryDetails';
import LowStockReport from './components/Inventory/LowStockReport';
import Login from './components/User/Login';
import Register from './components/User/Register';
import OrdersDashboard from './components/supplier/OrdersDashboard';
import AddOrder from './components/supplier/AddOrder'; // Added import for AddOrder
import SupplierDashboard from './components/supplier/SupplierDashboard';
import { FinanceProvider } from './FinanceContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Placeholder components for other main functions
const PlaceholderPage = ({ title, description }) => {
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .placeholder-page {
      margin-top: 80px;
      padding: 40px;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e6f0ea 100%);
      font-family: 'Poppins', sans-serif;
      text-align: center;
    }

    .placeholder-page h1 {
      font-size: 2.5rem;
      font-weight: 600;
      color: #2a7458;
      margin-bottom: 20px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }

    .placeholder-page p {
      font-size: 1.2rem;
      color: #5e6d55;
    }

    @media (max-width: 768px) {
      .placeholder-page {
        padding: 20px;
        margin-top: 120px;
      }

      .placeholder-page h1 {
        font-size: 2rem;
      }

      .placeholder-page p {
        font-size: 1rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="placeholder-page">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </>
  );
};

const DeliveryPage = () => (
  <PlaceholderPage
    title="Delivery"
    description="Delivery - Coming Soon"
  />
);

const EmployeePage = () => (
  <PlaceholderPage
    title="Employee Management"
    description="Employee Management - Coming Soon"
  />
);

function App() {
  const appStyles = `
    .app {
      min-height: 100vh;
      padding-top: 80px;
    }

    @media (max-width: 768px) {
      .app {
        padding-top: 120px;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: appStyles }} />
      <Router>
        <FinanceProvider>
          <MainNavbar />
          <div className="app">
            <Routes>
              {/* Root route for the homepage */}
              <Route path="/" element={<HomePage />} />

              {/* Registration and Login routes */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              {/* Nested finance routes */}
              <Route path="/finance">
                <Route index element={<Dashboard />} />
                <Route path="income" element={<IncomePage />} />
                <Route path="expense" element={<ExpensePage />} />
                <Route path="salary" element={<SalaryPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
              </Route>

              {/* Inventory routes */}
              <Route path="/inventory">
                <Route index element={<InventoryManagement />} />
                <Route path="dashboard" element={<InventoryDashboard />} />
                <Route path="add" element={<InventoryForm />} />
                <Route path="details/:id" element={<InventoryDetails />} />
                <Route path="edit/:id" element={<InventoryDetails />} />
                <Route path="low-stock" element={<LowStockReport />} />
              </Route>

              {/* Order and Supplier routes */}
              <Route path="/orders">
                <Route index element={<OrdersDashboard />} />
                <Route path="add" element={<AddOrder />} />
              </Route>
              <Route path="/suppliers" element={<SupplierDashboard />} />

              {/* Placeholder routes for other main functions */}
              <Route path="/delivery" element={<DeliveryPage />} />
              <Route path="/employee" element={<EmployeePage />} />
            </Routes>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </FinanceProvider>
      </Router>
    </>
  );
}

export default App;