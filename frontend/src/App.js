import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/financial/Navbar';
import Dashboard from './components/financial/Dashboard';
import IncomePage from './components/financial/IncomePage';
import ExpensePage from './components/financial/ExpensePage';
import SalaryPage from './components/financial/SalaryPage';
import TransactionsPage from './components/financial/TransactionsPage'; // Import the new page
import { FinanceProvider } from './FinanceContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const appStyles = `
    .app {
      display: flex;
      min-height: 100vh;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: appStyles }} />
      <Router>
        <FinanceProvider>
          <div className="app">
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/income" element={<IncomePage />} />
              <Route path="/expense" element={<ExpensePage />} />
              <Route path="/salary" element={<SalaryPage />} />
              <Route path="/transactions" element={<TransactionsPage />} /> {/* Add the new route */}
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