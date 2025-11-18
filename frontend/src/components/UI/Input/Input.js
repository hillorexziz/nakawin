import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error = null,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`input-container ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}
      
      <motion.div
        className={`input-wrapper ${isFocused ? 'input-focused' : ''} ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''}`}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="input-field"
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </motion.div>
      
      {error && (
        <motion.div
          className="input-error-message"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default Input;