import React, { createContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Проверка аутентификации при загрузке
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('nakawin_token');
      if (!token) {
        setIsLoading(false);
        setShowLoginModal(true);
        return;
      }

      const response = await api.get('/auth/verify');
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('nakawin_token');
      setShowLoginModal(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Вход
  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      
      localStorage.setItem('nakawin_token', token);
      setUser(user);
      setIsAuthenticated(true);
      setShowLoginModal(false);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Ошибка входа' 
      };
    }
  };

  // Выход
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('nakawin_token');
      setUser(null);
      setIsAuthenticated(false);
      setShowLoginModal(true);
    }
  };

  // Обновление баланса
  const updateBalance = (newBalance) => {
    setUser(prev => prev ? { ...prev, balance: newBalance } : null);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    showLoginModal,
    setShowLoginModal,
    login,
    logout,
    updateBalance,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};