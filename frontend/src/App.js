import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from './context/AuthContext';
import Header from './components/Layout/Header/Header';
import Navigation from './components/Layout/Navigation/Navigation';
import LoginModal from './components/Auth/LoginModal/LoginModal';
import Home from './pages/Home/Home';
import Cases from './pages/Cases/Cases';
import Wheel from './pages/Wheel/Wheel';
import Inventory from './pages/Inventory/Inventory';
import Admin from './pages/Admin/Admin';
import NotificationContainer from './components/UI/Notification/NotificationContainer';
import './App.css';

function App() {
  const { user, isAuthenticated, showLoginModal, setShowLoginModal } = useContext(AuthContext);

  // Если пользователь забанен
  if (user?.isBanned) {
    return (
      <div className="banned-container">
        <motion.div
          className="banned-message"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <h1>Аккаунт заблокирован</h1>
          <p>Ваш аккаунт был заблокирован администрацией.</p>
          <p>По вопросам разблокировки обращайтесь в поддержку.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="App">
      <NotificationContainer />
      
      <AnimatePresence>
        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}
      </AnimatePresence>

      {isAuthenticated && <Header />}
      
      <main className={`main-content ${!isAuthenticated ? 'centered' : ''}`}>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Home /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/cases" 
            element={
              isAuthenticated ? <Cases /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/wheel" 
            element={
              isAuthenticated ? <Wheel /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/inventory" 
            element={
              isAuthenticated ? <Inventory /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/admin" 
            element={
              isAuthenticated && user?.isAdmin ? <Admin /> : <Navigate to="/" replace />
            } 
          />
          <Route path="/login" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {isAuthenticated && <Navigation />}
    </div>
  );
}

export default App;