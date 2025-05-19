import React, { useState, useEffect } from 'react';
import { FaBars, FaSun, FaMoon } from 'react-icons/fa';
import logo from '../images/logoBranco.png';
import "../styles/Header.css";

const Header = ({ toggleSidebar }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="Header">
      <div className="left">
        <FaBars className="menu-icon" onClick={toggleSidebar} />
      </div>
      <div className="center">
        <h1 className="header">FlowBiz</h1>
      </div>
      <div className="right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? <FaSun size={25} /> : <FaMoon size={25} />}
        </button>
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </header>
  );
};

export default Header;