const express = require('express');
const Case = require('../models/Case');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const auth = require('../middleware/auth');
const ProvablyFairRNG = require('../utils/rng');
const router = express.Router();

// Получение всех активных кейсов
router.get('/', async (req, res) => {
  try {
    const cases = await Case.find({ isActive: true });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Открытие кейса
router.post('/:caseId/open', auth, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.caseId);
    
    if (!caseItem || !caseItem.isActive) {
      return res.status(404).json({ message: 'Кейс не найден' });
    }

    // Проверка баланса
    if (req.user.balance < caseItem.price) {
      return res.status(400).json({ message: 'Недостаточно средств' });
    }

    // Спишем стоимость кейса
    req.user.balance -= caseItem.price;
    await req.user.save();

    // Генерация случайного приза
    const serverSeed = process.env.JWT_SECRET;
    const clientSeed = req.user._id.toString();
    const nonce = Date.now();
    
    const rng = new ProvablyFairRNG(serverSeed, clientSeed, nonce);
    const prize = rng.selectPrize(caseItem.items);

    // Сохраняем информацию о выигрыше для проверки честности
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

// Сохранение приза в инвентарь
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
      source: 'case'
    });

    await inventoryItem.save();
    res.json({ message: 'Приз сохранен в инвентарь' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Продажа приза
router.post('/sell-prize', auth, async (req, res) => {
  try {
    const { prize } = req.body;

    // Добавляем стоимость продажи к балансу
    req.user.balance += prize.sellPrice;
    await req.user.save();

    res.json({ 
      message: 'Приз продан', 
      newBalance: req.user.balance 
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;