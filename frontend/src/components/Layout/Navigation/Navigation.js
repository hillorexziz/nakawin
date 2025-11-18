import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, Circle, User, Settings } from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const tabs = [
    { path: '/', icon: Home, label: 'Главная' },
    { path: '/cases', icon: Package, label: 'Кейсы' },
    { path: '/wheel', icon: Circle, label: 'Рулетка' },
    { path: '/inventory', icon: User, label: 'Инвентарь' },
  ];

  const handleTabClick = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <motion.nav
      className="navigation glass"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
    >
      <div className="nav-content">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.path;
          
          return (
            <motion.button
              key={tab.path}
              className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
              onClick={() => handleTabClick(tab.path)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="nav-icon-container">
                <Icon 
                  size={24} 
                  className="nav-icon"
                  fill={isActive ? "currentColor" : "none"}
                />
                {isActive && (
                  <motion.div
                    className="nav-active-indicator"
                    layoutId="activeIndicator"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span className="nav-label">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default Navigation;