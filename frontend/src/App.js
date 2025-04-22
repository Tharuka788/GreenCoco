import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
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
import AdminLogin from './components/Admin/AdminLogin';
import AdminRegister from './components/Admin/AdminRegister';
import AdminDashboard from './components/Admin/AdminDashboard'; // Updated import
import OrdersDashboard from './components/supplier/OrdersDashboard';
import AddOrder from './components/supplier/AddOrder';
import SupplierDashboard from './components/supplier/SupplierDashboard';
import EmployeeDashboard from './components/Employee/EmployeeDashboard';
import AttendanceManagement from './components/Employee/AttendanceManagement';
import { FinanceProvider } from './FinanceContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Placeholder components for admin subpages
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

const AdminFinance = () => (
  <PlaceholderPage
    title="Admin Finance"
    description="Admin Finance - Coming Soon"
  />
);

const AdminInventory = () => (
  <PlaceholderPage
    title="Admin Inventory"
    description="Admin Inventory - Coming Soon"
  />
);

const AdminOrders = () => (
  <PlaceholderPage
    title="Admin Orders"
    description="Admin Orders - Coming Soon"
  />
);

const AdminSuppliers = () => (
  <PlaceholderPage
    title="Admin Suppliers"
    description="Admin Suppliers - Coming Soon"
  />
);

const AdminEmployees = () => (
  <PlaceholderPage
    title="Admin Employees"
    description="Admin Employees - Coming Soon"
  />
);

const AdminDeliveries = () => (
  <PlaceholderPage
    title="Admin Deliveries"
    description="Admin Deliveries - Coming Soon"
  />
);

// Protected Route for users (both regular users and admins)
const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// Protected Route for admins only
const AdminProtectedRoute = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    const role = decoded.role; // Now role is included in the token payload
    return role === 'admin' ? <Outlet /> : <Navigate to="/admin/login" replace />;
  } catch (error) {
    return <Navigate to="/admin/login" replace />;
  }
};

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
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />

              {/* User Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/finance">
                  <Route index element={<Dashboard />} />
                  <Route path="income" element={<IncomePage />} />
                  <Route path="expense" element={<ExpensePage />} />
                  <Route path="salary" element={<SalaryPage />} />
                  <Route path="transactions" element={<TransactionsPage />} />
                </Route>

                <Route path="/inventory">
                  <Route index element={<InventoryManagement />} />
                  <Route path="dashboard" element={<InventoryDashboard />} />
                  <Route path="add" element={<InventoryForm />} />
                  <Route path="details/:id" element={<InventoryDetails />} />
                  <Route path="edit/:id" element={<InventoryDetails />} />
                  <Route path="low-stock" element={<LowStockReport />} />
                </Route>

                <Route path="/orders">
                  <Route index element={<OrdersDashboard />} />
                  <Route path="add" element={<AddOrder />} />
                </Route>

                <Route path="/suppliers" element={<SupplierDashboard />} />
                <Route path="/employee" element={<EmployeeDashboard />} />
                <Route path="/delivery" element={<DeliveryPage />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<AdminProtectedRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/finance" element={<AdminFinance />} />
                <Route path="/admin/inventory" element={<AdminInventory />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/suppliers" element={<AdminSuppliers />} />
                <Route path="/admin/employees" element={<AdminEmployees />} />
                <Route path="/admin/deliveries" element={<AdminDeliveries />} />
              </Route>

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