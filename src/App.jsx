import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import LandingPage from './pages/LandingPage.jsx';
import WeatherDashboard from './pages/WeatherDashboard.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-['Poppins'] selection:bg-blue-100">
        {/* The Navbar stays visible across all pages */}
        <Navbar />
        
        <main>
          <Routes>
            {/* Page 1: Introduction Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Page 2: Dynamic Data Page */}
            <Route path="/dashboard" element={<WeatherDashboard />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;