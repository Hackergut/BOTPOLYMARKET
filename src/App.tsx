import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/globals.css';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Trading from './pages/Trading';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Portfolio from './pages/Portfolio';
import Risk from './pages/Risk';
import Agents from './pages/Agents';
import Traders from './pages/Traders';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <DashboardLayout>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="trading" element={<Trading />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="risk" element={<Risk />} />
            <Route path="agents" element={<Agents />} />
            <Route path="traders" element={<Traders />} />
          </Routes>
        </DashboardLayout>
      </div>
    </Router>
  );
}

export default App;