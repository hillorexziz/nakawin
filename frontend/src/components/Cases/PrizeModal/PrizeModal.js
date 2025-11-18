import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../UI/Button/Button';
import { Package, Coins, CheckCircle } from 'lucide-react';
import './PrizeModal.css';

const PrizeModal = ({ prize, onAction, onClose }) => {
  const getRarityColor = (rarity) => {
    const colors = {
      1: '#6b7280', 2: '#059669', 3: '#2563eb', 4: '#7c3aed', 5: '#db2777',
      6: '#dc2626', 7: '#ea580c', 8: '#ca8a04', 9: '#16a34a', 10: '#7e22ce'
    };
    return colors[rarity] || colors[1];
  };

  const getRarityName = (rarity) => {
    const names = {
      1: 'Обычный', 2: 'Распространенный', 3: 'Необычный', 4: 'Редкий',
      5: 'Очень редкий', 6: 'Эпический', 7: 'Легендарный', 8: 'Древний',
      9: 'Мифический', 10: 'Божественный'
    };
    return names[rarity] || names[1];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <motion.div
      className="prize-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="prize-modal-content glass-ultra lens-effect"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="prize-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CheckCircle size={48} className="prize-success-icon" />
          <h2 className="prize-title">Поздравляем!</h2>
          <p className="prize-subtitle">Вы выиграли ценный предмет</p>
        </motion.div>

        <motion.div
          className="prize-card animate-prize-glow"
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.4 
          }}
          style={{ 
            borderColor: getRarityColor(prize.rarity),
            boxShadow: `0 0 30px ${getRarityColor(prize.rarity)}40`
          }}
        >
          <div className="prize-image-container">
            <img 
              src={prize.image} 
              alt={prize.name}
              className="prize-image"
            />
            <div 
              className="prize-rarity-glow"
              style={{ 
                background: `radial-gradient(circle, ${getRarityColor(prize.rarity)}30 0%, transparent 70%)`
              }}
            />
          </div>

          <div className="prize-info">
            <h3 className="prize-name">{prize.name}</h3>
            <div 
              className="prize-rarity"
              style={{ color: getRarityColor(prize.rarity) }}
            >
              {getRarityName(prize.rarity)}
            </div>
            <div className="prize-prices">
              <div className="prize-price">
                <Coins size={16} />
                Стоимость: {formatPrice(prize.price)}₽
              </div>
              <div className="prize-sell-price">
                Продажа: {formatPrice(prize.sellPrice)}₽
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="prize-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="success"
            size="large"
            onClick={() => onAction('save', prize)}
            className="prize-action-btn"
          >
            <Package size={20} />
            Сохранить в инвентарь
          </Button>
          
          <Button
            variant="primary"
            size="large"
            onClick={() => onAction('sell', prize)}
            className="prize-action-btn"
          >
            <Coins size={20} />
            Продать за {formatPrice(prize.sellPrice)}₽
          </Button>
        </motion.div>

        <motion.div
          className="prize-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="prize-hint">
            Предмет будет доступен в вашем инвентаре после сохранения
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PrizeModal;