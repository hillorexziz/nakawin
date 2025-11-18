import React from 'react';
import { motion } from 'framer-motion';
import InventoryItem from '../InventoryItem/InventoryItem';
import './InventoryList.css';

const InventoryList = ({ inventory, onSellItem, onWithdrawItem }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      className="inventory-list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {inventory.map((item, index) => (
        <InventoryItem
          key={item._id}
          item={item}
          onSell={() => onSellItem(item._id)}
          onWithdraw={() => onWithdrawItem(item._id)}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default InventoryList;