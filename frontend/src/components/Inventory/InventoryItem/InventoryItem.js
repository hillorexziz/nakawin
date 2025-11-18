import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../UI/Button/Button';
import { Coins, Download, MoreVertical } from 'lucide-react';
import './InventoryItem.css';

const InventoryItem = ({ item, onSell, onWithdraw, index }) => {
  const [showActions, setShowActions] = useState(false);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className="inventory-item glass lens-effect morph-element"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 24,
        delay: index * 0.1 
      }}
      whileHover={{ 
        y: -5,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
    >
      <div className="inventory-item-header">
        <div className="item-source">
          {item.source === 'case' ? '🎁 Кейс' : '🎡 Колесо'}
        </div>
        <div className="item-actions-toggle">
          <Button
            variant="secondary"
            size="small"
            onClick={() => setShowActions(!showActions)}
            className="actions-toggle-btn"
          >
            <MoreVertical size={16} />
          </Button>
        </div>
      </div>

      <div className="inventory-item-content">
        <div className="item-image-container">
          <img 
            src={item.item.image} 
            alt={item.item.name}
            className="item-image"
          />
          <div 
            className="item-rarity-glow"
            style={{ 
              background: `radial-gradient(circle, ${getRarityColor(item.item.rarity)}20 0%, transparent 70%)`,
              boxShadow: `0 0 30px ${getRarityColor(item.item.rarity)}30`
            }}
          />
        </div>

        <div className="item-info">
          <h3 className="item-name">{item.item.name}</h3>
          <div 
            className="item-rarity"
            style={{ color: getRarityColor(item.item.rarity) }}
          >
            {getRarityName(item.item.rarity)}
          </div>
          <div className="item-prices">
            <div className="item-price">
              Стоимость: {formatPrice(item.item.price)}₽
            </div>
            <div className="item-sell-price">
              Продажа: {formatPrice(item.item.sellPrice)}₽
            </div>
          </div>
          <div className="item-date">
            Получен: {formatDate(item.obtainedAt)}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showActions && (
          <motion.div
            className="inventory-item-actions"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="primary"
              size="small"
              onClick={onSell}
              className="action-btn"
            >
              <Coins size={16} />
              Продать
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={onWithdraw}
              className="action-btn"
            >
              <Download size={16} />
              Вывести
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InventoryItem;