import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message, duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      type,
      message,
      duration,
      progress: 100
    };

    setNotifications(prev => [...prev, notification]);

    // Автоматическое удаление
    setTimeout(() => {
      removeNotification(id);
    }, duration);

    // Анимация прогресс-бара
    const interval = setInterval(() => {
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id
            ? { ...notif, progress: notif.progress - (100 / (duration / 100)) }
            : notif
        )
      );
    }, 100);

    setTimeout(() => clearInterval(interval), duration);

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const success = (message, duration) => {
    return addNotification('success', message, duration);
  };

  const error = (message, duration) => {
    return addNotification('error', message, duration);
  };

  const warning = (message, duration) => {
    return addNotification('warning', message, duration);
  };

  const info = (message, duration) => {
    return addNotification('info', message, duration);
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};