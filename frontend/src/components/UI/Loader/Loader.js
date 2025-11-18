import React from 'react';
import { motion } from 'framer-motion';
import './Loader.css';

const Loader = ({ size = 'medium', color = 'primary' }) => {
  const sizeClass = `loader-${size}`;
  const colorClass = `loader-${color}`;

  return (
    <motion.div
      className={`loader ${sizeClass} ${colorClass}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div className="loader-spinner"></div>
    </motion.div>
  );
};

export default Loader;