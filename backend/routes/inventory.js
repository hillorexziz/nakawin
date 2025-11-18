const express = require('express');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Получение инвентаря пользователя
router.get('/', auth, async (req, res) => {
  try {
    const inventory = await Inventory.find({ 
      user: req.user._id,
      status: 'in_inventory'
    }).sort({ obtainedAt: -1 });
    
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Продажа предмета из инвентаря
router.post('/:itemId/sell', auth, async (req, res) => {
  try {
    const inventoryItem = await Inventory.findOne({
      _id: req.params.itemId,
      user: req.user._id,
      status: 'in_inventory'
    });

    if (!inventoryItem) {
      return res.status(404).json({ message: 'Предмет не найден' });
    }

    // Добавляем стоимость продажи к балансу
    req.user.balance += inventoryItem.item.sellPrice;
    await req.user.save();

    // Обновляем статус предмета
    inventoryItem.status = 'sold';
    await inventoryItem.save();

    res.json({ 
      message: 'Предмет продан', 
      newBalance: req.user.balance 
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Вывод предмета
router.post('/:itemId/withdraw', auth, async (req, res) => {
  try {
    const inventoryItem = await Inventory.findOne({
      _id: req.params.itemId,
      user: req.user._id,
      status: 'in_inventory'
    });

    if (!inventoryItem) {
      return res.status(404).json({ message: 'Предмет не найден' });
    }

    // Обновляем статус предмета
    inventoryItem.status = 'withdrawn';
    await inventoryItem.save();

    // Записываем в лог вывода
    const logEntry = `
Игрок: ${req.user.username}
Никнейм: ${req.user.gameNickname}
Банковский счет: ${req.user.bankAccount}
Сервер: ${req.user.server}
Предмет: ${inventoryItem.item.name}
Стоимость: ${inventoryItem.item.price}
Время: ${new Date().toISOString()}
_________________________________________________________
`;

    fs.appendFileSync(path.join(__dirname, '../logs/vivod.log'), logEntry);

    res.json({ message: 'Запрос на вывод отправлен' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;