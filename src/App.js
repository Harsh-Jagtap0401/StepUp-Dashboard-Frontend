import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLogin from './components/Auth/UserLogin';
import AdminLogin from './components/Auth/AdminLogin';
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ViewDashboard from './components/Dashboard/ViewDashboard';
import Footer from './components/Footer/Footer'; // Import the Footer component
import LevelDashboard from './components/Dashboard/LevelDashboard';

const App = () => (
  <Router>
    <div className='App'>
      <Routes>
      
        <Route path="/" element={<UserLogin />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/view-dashboard" element={<ViewDashboard />} />
        <Route path="/admin/level-dashboard" element={<LevelDashboard />} />
       
      </Routes>
      
      
    
    </div>
    <Footer/>{/* <Footer /> Add the Footer component */}

  </Router>
);


export default App;