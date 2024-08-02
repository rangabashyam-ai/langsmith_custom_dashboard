
import React, { useState } from 'react';
import Dashboard from './components/Dashboard'; // Import your Dashboard component
import './App.css'; // Import your CSS file

const App = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="app-container">
      <button onClick={toggleTheme} className="theme-toggle-button">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <Dashboard />
    </div>
  );
};

export default App;

