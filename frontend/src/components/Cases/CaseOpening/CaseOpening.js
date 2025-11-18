import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../UI/Button/Button';
import { X, ArrowDown } from 'lucide-react';
import './CaseOpening.css';

const CaseOpening = ({ caseItem, onOpen, onClose, isSpinning = false }) => {
  const [currentItems, setCurrentItems] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const itemsContainerRef = useRef(null);
  const animationRef = useRef(null);

  // Генерация повторяющихся предметов для бесконечной ленты
  useEffect(() => {
    if (caseItem?.items) {
      const repeatedItems = [];
      for (let i = 0; i < 50; i++) {
        repeatedItems.push(...caseItem.items);
      }
      // Перемешиваем предметы
      const shuffled = repeatedItems.sort(() => Math.random() - 0.5);
      setCurrentItems(shuffled);
    }
  }, [caseItem]);

  // Анимация прокрутки
  useEffect(() => {
    if (isSpinning && itemsContainerRef.current) {
      const container = itemsContainerRef.current;
      const containerWidth = container.scrollWidth / 2; // Так как у нас 2 копии
      
      let startTime = null;
      const duration = 10000; // 10 секунд
      const startPosition = scrollPosition;
      const endPosition = startPosition + containerWidth;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Эasing функция для плавного старта и остановки
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const newPosition = startPosition + (endPosition - startPosition) * easeOut;
        
        setScrollPosition(newPosition);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpinning, scrollPosition]);

  if (!caseItem) return null;

  return (
    <motion.div
      className="case-opening-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="case-opening-container glass-ultra"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="case-opening-header">
          <h2 className="case-opening-title">{caseItem.name}</h2>
          <Button
            variant="secondary"
            size="small"
            onClick={onClose}
            className="case-opening-close"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="case-opening-content">
          <div className="items-track-container">
            <div className="selection-arrow">
              <ArrowDown size={40} />
            </div>
            
            <div 
              ref={itemsContainerRef}
              className="items-track"
              style={{ 
                transform: `translateX(-${scrollPosition}px)`,
                transition: isSpinning ? 'none' : 'transform 0.1s linear'
              }}
            >
              {currentItems.map((item, index) => (
                <motion.div
                  key={`${item.name}-${index}`}
                  className="case-item-preview glass"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="item-preview-image"
                  />
                  <div className="item-preview-name">{item.name}</div>
                  <div 
                    className="item-rarity-badge"
                    style={{ 
                      backgroundColor: getRarityColor(item.rarity) + '20',
                      color: getRarityColor(item.rarity),
                      borderColor: getRarityColor(item.rarity)
                    }}
                  >
                    {getRarityName(item.rarity)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {!isSpinning && (
            <motion.div
              className="case-opening-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="primary"
                size="large"
                onClick={onOpen}
                className="open-case-btn"
              >
                Крутить за {caseItem.price}₽
              </Button>
            </motion.div>
          )}

          {isSpinning && (
            <motion.div
              className="spinning-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="spinning-text">Крутим...</div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Вспомогательные функции для редкости
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

export default CaseOpening;