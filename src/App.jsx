import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './COMPONENTS/Header';
import Footer from './COMPONENTS/Footer';
import Home from './PAGES/Home';
import Auth from './PAGES/Auth';
import Dashboard from './PAGES/Dashboard';
import Recipe from './PAGES/Recipe';
import PageNotFound from './PAGES/PageNotFound';

import './App.css';
import AdminLogin from './PAGES/AdminLogin';
import AdminDashboard from './PAGES/AdminDashboard';
import CreateCollectionPage from './PAGES/CreateCollectionPage';

function App() {
  // State for theme management: 'light' or 'dark'
  const [theme, setTheme] = useState('light');

  // Toggle function to switch themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme; // Apply the theme globally
  };

  useEffect(() => {
    // Optionally, load the preferred theme from local storage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  useEffect(() => {
    // Save the selected theme to local storage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className={`app ${theme}`}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <Routes>
         {/* Define the route for admin login */}
         <Route path='/admin-login' element={<AdminLogin />} />
        
        {/* Define the route for admin dashboard (after successful login) */}
        <Route path='/admin-dashboard' element={<AdminDashboard />} />

        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Auth register={true} />} />
        <Route path='/login' element={<Auth />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path="/create-collection" element={<CreateCollectionPage />} />
        <Route path='/recipe' element={<Recipe />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
     
      <Footer theme={theme} toggleTheme={toggleTheme} />

    </div>
  );
}

export default App;
