import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';
import MainNavbar from './components/Home/MainNavbar';
import { FinanceProvider } from './FinanceContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy-loaded components for better performance
const HomePage = lazy(() => import('./components/Home/HomePage'));
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

// Placeholder component with global App.css styles
const PlaceholderPage = ({ title, description }) => (
  <div className="container mt-2 p-2 text-center">
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
);

const DeliveryPage = () => (
  <PlaceholderPage
    title="Delivery"
    description="Delivery - Coming Soon"
  />
);

const OrderSupplierPage = () => (
  <PlaceholderPage
    title="Order & Supplier Management"
    description="Order & Supplier Management - Coming Soon"
  />
);

const EmployeePage = () => (
  <PlaceholderPage
    title="Employee Management"
    description="Employee Management - Coming Soon"
  />
);

// Footer component using App.css styles
const Footer = () => (
  <footer className="mt-2 p-2 text-center" style={{ background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))', color: '#ffffff' }}>
    <div className="container">
      <p>&copy; {new Date().getFullYear()} GreenCoco. All rights reserved.</p>
      <div className="d-flex justify-center gap-1">
        <a href="/about" className="btn">About</a>
        <a href="/contact" className="btn">Contact</a>
        <a href="/privacy" className="btn">Privacy Policy</a>
      </div>
      {/* Placeholder for theme toggle */}
      <button className="btn mt-1" onClick={() => alert('Theme toggle coming soon!')}>
        Toggle Theme
      </button>
    </div>
  </footer>
);

// Loading fallback component
const LoadingSpinner = () => (
  <div className="container d-flex justify-center align-center" style={{ minHeight: '100vh' }}>
    <div className="loading-spinner"></div>
  </div>
);

function App() {
  return (
    <Router>
      <FinanceProvider>
        <MainNavbar />
        <main className="container mt-2" role="main">
          <Suspense fallback={<LoadingSpinner />}>
            <TransitionGroup>
              <CSSTransition timeout={300} classNames="fade">
                <Routes location={window.location}>
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
                    <Route path="add" element={<InventoryForm />} />
                    <Route path="details/:id" element={<InventoryDetails />} />
                    <Route path="edit/:id" element={<InventoryDetails />} />
                    <Route path="low-stock" element={<LowStockReport />} />
                  </Route>

                  {/* Placeholder routes for other main functions */}
                  <Route path="/delivery" element={<DeliveryPage />} />
                  <Route path="/order-supplier" element={<OrderSupplierPage />} />
                  <Route path="/employee" element={<EmployeePage />} />

                  {/* Catch-all route for 404 */}
                  <Route path="*" element={<PlaceholderPage title="404 - Page Not Found" description="The page you are looking for does not exist." />} />
                </Routes>
              </CSSTransition>
            </TransitionGroup>
          </Suspense>
        </main>
        <Footer />
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
  );
}

// Global transition styles
const transitionStyles = `
  .fade-enter {
    opacity: 0;
    transform: translateY(20px);
  }
  .fade-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 300ms ease, transform 300ms ease;
  }
  .fade-exit {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-exit-active {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 300ms ease, transform 300ms ease;
  }

  .loading-spinner {
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--secondary-color);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

document.head.insertAdjacentHTML('beforeend', `<style>${transitionStyles}</style>`);

export default App;