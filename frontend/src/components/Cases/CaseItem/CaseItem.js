import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../UI/Button/Button';
import { ShoppingBag } from 'lucide-react';
import './CaseItem.css';

const CaseItem = ({ caseItem, onSelect, index }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      1: '#6b7280',
      2: '#059669',
      3: '#2563eb',
      4: '#7c3aed',
      5: '#db2777',
      6: '#dc2626',
      7: '#ea580c',
      8: '#ca8a04',
      9: '#16a34a',
      10: '#7e22ce'
    };
    return colors[rarity] || colors[1];
  };

  const getRarityName = (rarity) => {
    const names = {
      1: 'Обычный',
      2: 'Распространенный',
      3: 'Необычный',
      4: 'Редкий',
      5: 'Очень редкий',
      6: 'Эпический',
      7: 'Легендарный',
      8: 'Древний',
      9: 'Мифический',
      10: 'Божественный'
    };
    return names[rarity] || names[1];
  };

  const maxRarity = Math.max(...caseItem.items.map(item => item.rarity));

  return (
    <motion.div
      className="case-item glass lens-effect morph-element"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 24,
        delay: index * 0.1 
      }}
      whileHover={{ 
        y: -8,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
    >
      <div className="case-image-container">
        <img 
          src={caseItem.image} 
          alt={caseItem.name}
          className="case-image"
        />
        <div 
          className="case-rarity-glow"
          style={{ 
            background: `radial-gradient(circle, ${getRarityColor(maxRarity)}20 0%, transparent 70%)`,
            boxShadow: `0 0 40px ${getRarityColor(maxRarity)}40`
          }}
        />
      </div>

      <div className="case-info">
        <h3 className="case-name">{caseItem.name}</h3>
        <p className="case-rarity">
          Макс. редкость: <span style={{ color: getRarityColor(maxRarity) }}>
            {getRarityName(maxRarity)}
          </span>
        </p>
        <p className="case-items-count">
          {caseItem.items.length} предметов
        </p>
      </div>

      <div className="case-footer">
        <div className="case-price">
          {formatPrice(caseItem.price)}₽
        </div>
        <Button
          variant="primary"
          size="medium"
          onClick={() => onSelect(caseItem)}
          className="case-open-btn"
        >
          <ShoppingBag size={18} />
          Открыть
        </Button>
      </div>
    </motion.div>
  );
};

export default CaseItem;