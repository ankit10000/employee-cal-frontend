import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import WorkingHours from './Employee/WorkingHours';
import AllWorkingHours from './admin/AllWorkingHours';
import Logout from './components/Logout'; 
import EmployeeDetails from './admin/EmployeeDetails';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/working-hours" element={<WorkingHours />} /> 
        <Route path="/adminDashboard" element={<AllWorkingHours />} />
        <Route path="/employee_details/:userId" element={<EmployeeDetails />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
