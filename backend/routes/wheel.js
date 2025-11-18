const express = require('express');
const Wheel = require('../models/Wheel');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const auth = require('../middleware/auth');
const ProvablyFairRNG = require('../utils/rng');
const router = express.Router();

// Получение активного колеса
router.get('/', async (req, res) => {
  try {
    const wheel = await Wheel.findOne({ isActive: true });
    res.json(wheel);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Вращение колеса
router.post('/spin', auth, async (req, res) => {
  try {
    const wheel = await Wheel.findOne({ isActive: true });
    
    if (!wheel) {
      return res.status(404).json({ message: 'Колесо не найдено' });
    }

    // Проверка баланса
    if (req.user.balance < wheel.spinPrice) {
      return res.status(400).json({ message: 'Недостаточно средств' });
    }

    // Спишем стоимость вращения
    req.user.balance -= wheel.spinPrice;
    await req.user.save();

    // Генерация случайного сектора
    const serverSeed = process.env.JWT_SECRET;
    const clientSeed = req.user._id.toString();
    const nonce = Date.now();
    
    const rng = new ProvablyFairRNG(serverSeed, clientSeed, nonce);
    const prize = rng.selectWheelSection(wheel.sections);

    // Сохраняем информацию для проверки честности
    const verificationHash = rng.generateHash();

    res.json({
      prize: {
        name: prize.name,
        image: prize.image,
        price: prize.price,
        sellPrice: prize.sellPrice,
        rarity: prize.rarity
      },
      verification: {
        hash: verificationHash,
        serverSeed: serverSeed,
        clientSeed: clientSeed,
        nonce: nonce
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Сохранение приза колеса в инвентарь
router.post('/save-prize', auth, async (req, res) => {
  try {
    const { prize } = req.body;

    const inventoryItem = new Inventory({
      user: req.user._id,
      item: {
        name: prize.name,
        image: prize.image,
        price: prize.price,
        sellPrice: prize.sellPrice,
        rarity: prize.rarity
      },
      source: 'wheel'
    });

    await inventoryItem.save();
    res.json({ message: 'Приз сохранен в инвентарь' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;