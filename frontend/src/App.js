import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FinanceProvider } from './FinanceContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import axios from 'axios';
import Footer from './components/Footer';


// Lazy-loaded components
const InventoryDashboard = lazy(() => import('./components/Inventory/InventoryDashboard'));
const HomePage = lazy(() => import('./components/Home/HomePage'));
const MainNavbar = lazy(() => import('./components/Home/MainNavbar'));
const Dashboard = lazy(() => import('./components/financial/Dashboard'));
const IncomePage = lazy(() => import('./components/financial/IncomePage'));
const ExpensePage = lazy(() => import('./components/financial/ExpensePage'));
const SalaryPage = lazy(() => import('./components/financial/SalaryPage'));
const TransactionsPage = lazy(() => import('./components/financial/TransactionsPage'));
const InventoryManagement = lazy(() => import('./components/Inventory/InventoryManagement'));
const InventoryForm = lazy(() => import('./components/Inventory/InventoryForm'));
const InventoryDetails = lazy(() => import('./components/Inventory/InventoryDetails'));
const LowStockReport = lazy(() => import('./components/Inventory/LowStockReport'));
const Login = lazy(() => import('./components/User/Login'));
const Register = lazy(() => import('./components/User/Register'));
const AdminLogin = lazy(() => import('./components/Admin/AdminLogin'));
const AdminRegister = lazy(() => import('./components/Admin/AdminRegister'));
const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard'));
const OrdersDashboard = lazy(() => import('./components/supplier/OrdersDashboard'));
const TransportManagement = lazy(() => import('./components/Transport/TransportManagement'));
const VehicleManagement = lazy(() => import('./components/Transport/VehicleManagement'));
const DriverManagement = lazy(() => import('./components/Transport/DriverManagement'));
const LandingPage = lazy(() => import('./components/Transport/LandingPage'));
const AddOrder = lazy(() => import('./components/supplier/AddOrder'));
const SupplierDashboard = lazy(() => import('./components/supplier/SupplierDashboard'));
const EmployeeDashboard = lazy(() => import('./components/Employee/EmployeeDashboard'));
const AttendanceManagement = lazy(() => import('./components/Employee/AttendanceManagement'));
const AdminFinance = lazy(() => import('./components/Admin/AdminFinance'));
const AdminInventory = lazy(() => import('./components/Admin/AdminInventory'));
const AdminEmployees = lazy(() => import('./components/Admin/AdminEmployees'));
const AdminSuppliers = lazy(() => import('./components/Admin/AdminSuppliers'));
const AdminOrders = lazy(() => import('./components/Admin/AdminOrders'));

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

// Protected Route for users (both regular users and admins)
const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000; // Current time in seconds
    if (decoded.exp && decoded.exp < currentTime) {
      console.log('Token expired, redirecting to /login');
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }
    return <Outlet />;
  } catch (error) {
    console.error('Error decoding token:', error);
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

// Protected Route for admins only
const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = tokenPayload.exp * 1000 < Date.now();
      
      if (isExpired) {
        localStorage.removeItem('token');
        navigate('/admin/login', { replace: true });
        return;
      }

      if (tokenPayload.role !== 'admin') {
        localStorage.removeItem('token');
        navigate('/admin/login', { replace: true });
        return;
      }
    } catch (err) {
      console.error('Token validation error:', err);
      localStorage.removeItem('token');
      navigate('/admin/login', { replace: true });
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return children;
};

// Not Found Component
const NotFound = () => (
  <PlaceholderPage
    title="404 - Not Found"
    description="The page you're looking for doesn't exist."
  />
);

// MainNavbar wrapper component
const MainNavbarWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    return null;
  }

  return <MainNavbar />;
};

// Footer wrapper component
const FooterWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    return null;
  }

  return <Footer />;
};

function App() {
  const appStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

    .app {
      min-height: 100vh;
      padding-top: 80px;
      font-family: 'Poppins', sans-serif;
      background: #f5f7fa;
      display: flex;
      flex-direction: column;
    }

    .app.admin {
      padding-top: 0;
    }

    @media (max-width: 768px) {
      .app {
        padding-top: 120px;
      }

      .app.admin {
        padding-top: 0;
      }
    }
  `;

  return (
    <Router>
      <style dangerouslySetInnerHTML={{ __html: appStyles }} />
      <div className="app">
        <MainNavbarWrapper />
        <Suspense fallback={<div>Loading...</div>}>
          <FinanceProvider>
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

                
                <Route path="/tr" element={<LandingPage />} />
                <Route path="/transport" element={<TransportManagement />} />
                <Route path="/drivers" element={<DriverManagement />} />
                <Route path="/vehicles" element={<VehicleManagement />} />
                  
                

                <Route path="/suppliers" element={<SupplierDashboard />} />
                <Route path="/employee" element={<EmployeeDashboard />} />
                <Route path="/attendance" element={<AttendanceManagement />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route path="/admin" element={<AdminProtectedRoute><Outlet /></AdminProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="finance" element={<AdminFinance />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="suppliers" element={<AdminSuppliers />} />
                <Route path="employees" element={<AdminEmployees />} />
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </FinanceProvider>
        </Suspense>
        <FooterWrapper />
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;