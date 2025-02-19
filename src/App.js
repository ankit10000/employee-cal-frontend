import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import WorkingHours from './Employee/WorkingHours';
import AllWorkingHours from './admin/AllWorkingHours';
import Logout from './components/Logout'; // Add Logout component if you want a separate logout page or button

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes (User must be logged in) */}
        <Route path="/home" element={<Home />} />
        <Route path="/working-hours" element={<WorkingHours />} /> {/* Path for Employee's working hours */}
        
        {/* Admin Routes */}
        <Route path="/adminDashboard" element={<AllWorkingHours />} /> {/* Path for Admin to view all working hours */}
        
        {/* Default Route (Login) */}
        <Route path="/" element={<Login />} />
        
        {/* Optional: Logout Route */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
