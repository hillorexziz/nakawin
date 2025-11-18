import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { wheelAPI } from '../../utils/api';
import { useNotification } from '../../context/NotificationContext';
import WheelComponent from '../../components/Wheel/WheelComponent/WheelComponent';
import PrizeModal from '../../components/Cases/PrizeModal/PrizeModal';
import Loader from '../../components/UI/Loader/Loader';
import './Wheel.css';

const Wheel = () => {
  const [wheel, setWheel] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error: showError } = useNotification();

  useEffect(() => {
    loadWheel();
  }, []);

  const loadWheel = async () => {
    try {
      const response = await wheelAPI.get();
      setWheel(response.data);
    } catch (err) {
      showError('Ошибка загрузки колеса фортуны');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpin = async () => {
    if (!wheel || isSpinning) return;

    setIsSpinning(true);
    
    try {
      const response = await wheelAPI.spin();
      const { prize, verification } = response.data;
      
      // Запускаем анимацию вращения
      setTimeout(() => {
        setWonPrize({ ...prize, verification });
        setIsSpinning(false);
      }, 5000); // Время анимации вращения

    } catch (err) {
      showError(err.response?.data?.message || 'Ошибка вращения колеса');
      setIsSpinning(false);
    }
  };

  const handlePrizeAction = async (action, prize) => {
    try {
      if (action === 'save') {
        await wheelAPI.savePrize(prize);
        success('Предмет сохранен в инвентарь!');
      } else if (action === 'sell') {
        await wheelAPI.sellPrize(prize);
        success(`Предмет продан за ${prize.sellPrice}₽!`);
      }
      
      setWonPrize(null);
    } catch (err) {
      showError('Ошибка обработки приза');
    }
  };

  if (isLoading) {
    return (
      <div className="wheel-loading">
        <Loader size="large" />
        <p>Загрузка колеса фортуны...</p>
      </div>
    );
  }

  if (!wheel) {
    return (
      <div className="wheel-error">
        <div className="wheel-error-icon">🎡</div>
        <h3>Колесо фортуны временно недоступно</h3>
        <p>Попробуйте обновить страницу позже</p>
      </div>
    );
  }

  return (
    <div className="wheel-page">
      <motion.div
        className="wheel-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="wheel-title">Колесо Фортуны</h1>
        <p className="wheel-subtitle">Крутите колесо и получайте уникальные призы</p>
        <div className="wheel-price">
          Стоимость вращения: <span>{wheel.spinPrice}₽</span>
        </div>
      </motion.div>

      <div className="wheel-container">
        <WheelComponent
          wheel={wheel}
          onSpin={handleSpin}
          isSpinning={isSpinning}
        />
      </div>

      {wonPrize && (
        <PrizeModal
          prize={wonPrize}
          onAction={handlePrizeAction}
          onClose={() => setWonPrize(null)}
        />
      )}
    </div>
  );
};

export default Wheel;