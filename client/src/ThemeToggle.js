// client/src/ThemeToggle.js
import React from 'react';
import './App.css';

const ThemeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <div className="toggle-wrapper">
      <label className="switch">
        <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        <span className="slider round"></span>
      </label>
      <span style={{ marginLeft: '10px' }}>{darkMode ? 'Dark' : 'Light'} Mode</span>
    </div>
  );
};

export default ThemeToggle;
