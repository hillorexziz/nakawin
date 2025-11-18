import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import Button from '../../UI/Button/Button';
import DepositModal from '../../Payment/DepositModal/DepositModal';
import FAQModal from '../../UI/FAQModal/FAQModal';
import { LogOut, Plus, HelpCircle } from 'lucide-react';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { success } = useNotification();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    success('Вы успешно вышли из аккаунта');
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('ru-RU').format(balance);
  };

  return (
    <>
      <motion.header 
        className="header glass"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="header-content">
          <div className="header-left">
            <div className="balance-section">
              <span className="balance-label">Баланс:</span>
              <div className="balance-value">
                {formatBalance(user?.balance || 0)}
                <span className="currency">₽</span>
              </div>
              <Button
                variant="primary"
                size="small"
                className="deposit-btn"
                onClick={() => setShowDepositModal(true)}
              >
                <Plus size={16} />
                Пополнить
              </Button>
            </div>
            
            <div className="user-info">
              <span className="username">@{user?.username}</span>
              {user?.isAdmin && (
                <span className="admin-badge">ADMIN</span>
              )}
            </div>
          </div>

          <div className="header-center">
            <motion.div 
              className="logo"
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <img src="/logo.png" alt="Nakawin" />
              <span className="logo-text">Nakawin</span>
            </motion.div>
          </div>

          <div className="header-right">
            <Button
              variant="secondary"
              size="small"
              className="faq-btn"
              onClick={() => setShowFAQModal(true)}
            >
              <HelpCircle size={16} />
              FAQ
            </Button>
            
            <Button
              variant="error"
              size="small"
              className="logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Выйти
            </Button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {showDepositModal && (
          <DepositModal onClose={() => setShowDepositModal(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFAQModal && (
          <FAQModal onClose={() => setShowFAQModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;