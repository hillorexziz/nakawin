import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { inventoryAPI } from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import InventoryList from '../../components/Inventory/InventoryList/InventoryList';
import Loader from '../../components/UI/Loader/Loader';
import { Package } from 'lucide-react';
import './Inventory.css';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, updateBalance } = useContext(AuthContext);
  const { success, error: showError } = useNotification();

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await inventoryAPI.getAll();
      setInventory(response.data);
    } catch (err) {
      showError('Ошибка загрузки инвентаря');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSellItem = async (itemId) => {
    try {
      const response = await inventoryAPI.sell(itemId);
      const { newBalance } = response.data;
      
      // Обновляем баланс в контексте
      updateBalance(newBalance);
      
      // Удаляем предмет из инвентаря
      setInventory(prev => prev.filter(item => item._id !== itemId));
      
      success('Предмет успешно продан!');
    } catch (err) {
      showError(err.response?.data?.message || 'Ошибка продажи предмета');
    }
  };

  const handleWithdrawItem = async (itemId) => {
    try {
      await inventoryAPI.withdraw(itemId);
      
      // Удаляем предмет из инвентаря
      setInventory(prev => prev.filter(item => item._id !== itemId));
      
      success('Запрос на вывод отправлен! Проверьте файл логов на сервере.');
    } catch (err) {
      showError(err.response?.data?.message || 'Ошибка вывода предмета');
    }
  };

  const getTotalValue = () => {
    return inventory.reduce((total, item) => total + item.item.price, 0);
  };

  const getSellValue = () => {
    return inventory.reduce((total, item) => total + item.item.sellPrice, 0);
  };

  if (isLoading) {
    return (
      <div className="inventory-loading">
        <Loader size="large" />
        <p>Загрузка инвентаря...</p>
      </div>
    );
  }

  return (
    <div className="inventory-page">
      <motion.div
        className="inventory-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inventory-title-section">
          <h1 className="inventory-title">Инвентарь</h1>
          <p className="inventory-subtitle">
            Управляйте вашими выигранными предметами
          </p>
        </div>

        <div className="inventory-stats glass">
          <div className="stat-item">
            <div className="stat-value">{inventory.length}</div>
            <div className="stat-label">Всего предметов</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{getTotalValue()}₽</div>
            <div className="stat-label">Общая стоимость</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{getSellValue()}₽</div>
            <div className="stat-label">Стоимость продажи</div>
          </div>
        </div>
      </motion.div>

      {inventory.length === 0 ? (
        <motion.div
          className="inventory-empty"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Package size={64} className="empty-icon" />
          <h3>Инвентарь пуст</h3>
          <p>Откройте кейсы или покрутите колесо фортуны, чтобы получить предметы</p>
        </motion.div>
      ) : (
        <InventoryList
          inventory={inventory}
          onSellItem={handleSellItem}
          onWithdrawItem={handleWithdrawItem}
        />
      )}
    </div>
  );
};

export default Inventory;