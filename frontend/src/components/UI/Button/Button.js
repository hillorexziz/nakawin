import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${disabled ? 'btn-disabled' : ''} ${loading ? 'btn-loading' : ''} ${className}`;

  return (
    <motion.button
      className={buttonClass}
      whileHover={!disabled && !loading ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <motion.div
          className="btn-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      <span className="btn-content">{children}</span>
    </motion.button>
  );
};

export default Button;