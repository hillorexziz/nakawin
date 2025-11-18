import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import { X, LogIn, Bot } from 'lucide-react';
import './LoginModal.css';

const LoginModal = ({ onClose }) => {
  const { login } = useContext(AuthContext);
  const { error: showError, success } = useNotification();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      showError('Заполните все поля');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        success('Успешный вход в аккаунт!');
      } else {
        showError(result.message);
      }
    } catch (err) {
      showError('Произошла ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  const openBotLink = () => {
    window.open('https://t.me/your_bot_link', '_blank');
  };

  return (
    <motion.div
      className="login-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="login-modal-content glass-ultra lens-effect"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="login-modal-header">
          <h2 className="login-modal-title">Вход в аккаунт</h2>
          <button className="login-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <Input
              label="Имя пользователя"
              type="text"
              value={formData.username}
              onChange={(value) => handleInputChange('username', value)}
              placeholder="Введите ваш username"
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <Input
              label="Пароль"
              type="password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              placeholder="Введите ваш пароль"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={isLoading}
            className="login-submit-btn"
          >
            <LogIn size={20} />
            Войти в аккаунт
          </Button>
        </form>

        <div className="login-modal-footer">
          <p className="registration-hint">
            Нет аккаунта? Создайте его через нашего бота в Telegram
          </p>
          <Button
            variant="secondary"
            size="medium"
            onClick={openBotLink}
            className="bot-link-btn"
          >
            <Bot size={16} />
            Создать аккаунт в боте
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginModal;