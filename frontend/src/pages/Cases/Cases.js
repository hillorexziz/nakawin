import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { casesAPI } from '../../utils/api';
import { useNotification } from '../../context/NotificationContext';
import CaseList from '../../components/Cases/CaseList/CaseList';
import CaseOpening from '../../components/Cases/CaseOpening/CaseOpening';
import PrizeModal from '../../components/Cases/PrizeModal/PrizeModal';
import Loader from '../../components/UI/Loader/Loader';
import './Cases.css';

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isOpening, setIsOpening] = useState(false);
  const [wonPrize, setWonPrize] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error: showError } = useNotification();

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const response = await casesAPI.getAll();
      setCases(response.data);
    } catch (err) {
      showError('Ошибка загрузки кейсов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaseSelect = (caseItem) => {
    setSelectedCase(caseItem);
  };

  const handleCaseOpen = async () => {
    if (!selectedCase) return;

    setIsOpening(true);
    
    try {
      const response = await casesAPI.open(selectedCase._id);
      const { prize, verification } = response.data;
      
      // Запускаем анимацию открытия
      setTimeout(() => {
        setWonPrize({ ...prize, verification });
        setIsOpening(false);
      }, 3000); // Время анимации открытия

    } catch (err) {
      showError(err.response?.data?.message || 'Ошибка открытия кейса');
      setIsOpening(false);
    }
  };

  const handlePrizeAction = async (action, prize) => {
    try {
      if (action === 'save') {
        await casesAPI.savePrize(prize);
        success('Предмет сохранен в инвентарь!');
      } else if (action === 'sell') {
        await casesAPI.sellPrize(prize);
        success(`Предмет продан за ${prize.sellPrice}₽!`);
      }
      
      setWonPrize(null);
      setSelectedCase(null);
    } catch (err) {
      showError('Ошибка обработки приза');
    }
  };

  const handleCloseCase = () => {
    setSelectedCase(null);
    setWonPrize(null);
  };

  if (isLoading) {
    return (
      <div className="cases-loading">
        <Loader size="large" />
        <p>Загрузка кейсов...</p>
      </div>
    );
  }

  return (
    <div className="cases-page">
      <motion.div
        className="cases-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="cases-title">Кейсы</h1>
        <p className="cases-subtitle">Открывайте кейсы и получайте уникальные предметы</p>
      </motion.div>

      <CaseList 
        cases={cases} 
        onCaseSelect={handleCaseSelect}
      />

      <AnimatePresence>
        {selectedCase && !isOpening && !wonPrize && (
          <CaseOpening
            caseItem={selectedCase}
            onOpen={handleCaseOpen}
            onClose={handleCloseCase}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpening && (
          <CaseOpening
            caseItem={selectedCase}
            onOpen={handleCaseOpen}
            onClose={handleCloseCase}
            isSpinning={true}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {wonPrize && (
          <PrizeModal
            prize={wonPrize}
            onAction={handlePrizeAction}
            onClose={handleCloseCase}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cases;