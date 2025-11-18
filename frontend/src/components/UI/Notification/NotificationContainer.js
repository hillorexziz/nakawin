import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../../context/NotificationContext';
import './NotificationContainer.css';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'var(--success)';
      case 'error': return 'var(--error)';
      case 'warning': return 'var(--warning)';
      case 'info': return 'var(--accent-blue)';
      default: return 'var(--accent-blue)';
    }
  };

  return (
    <div className="notification-container">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className="notification glass lens-effect"
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{ borderLeft: `4px solid ${getNotificationColor(notification.type)}` }}
          >
            <div className="notification-content">
              <div className="notification-message">
                {notification.message}
              </div>
              <button
                className="notification-close"
                onClick={() => removeNotification(notification.id)}
              >
                ×
              </button>
            </div>
            <div 
              className="notification-progress"
              style={{ 
                backgroundColor: getNotificationColor(notification.type),
                width: `${notification.progress}%`
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer;