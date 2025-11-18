import React from 'react';
import { motion } from 'framer-motion';
import CaseItem from '../CaseItem/CaseItem';
import './CaseList.css';

const CaseList = ({ cases, onCaseSelect }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (cases.length === 0) {
    return (
      <div className="cases-empty">
        <div className="cases-empty-icon">📦</div>
        <h3>Кейсы временно отсутствуют</h3>
        <p>Скоро появятся новые кейсы с крутыми предметами!</p>
      </div>
    );
  }

  return (
    <motion.div
      className="case-list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cases.map((caseItem, index) => (
        <CaseItem
          key={caseItem._id}
          caseItem={caseItem}
          onSelect={onCaseSelect}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default CaseList;