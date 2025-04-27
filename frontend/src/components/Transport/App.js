import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import LandingPage from './Pgs/LandingPage';
import DriverManagement from './Pgs/DriverManagement';
import VehicleManagement from './Pgs/VehicleManagement';
import TransportManagement from './Pgs/TransportManagement';

import './App.css';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/drivers" element={<DriverManagement />} />
          <Route path="/vehicles" element={<VehicleManagement />} />
          <Route path="/transport" element={<TransportManagement />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;