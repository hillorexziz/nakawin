// Контроллер игровых действий: получение кейсов, открытие кейса, прокрутка колеса.
const Case = require('../models/Case');
const Item = require('../models/Item');
const WheelEntry = require('../models/WheelEntry');
const User = require('../models/User');
const { randomFromSeeds, genServerSeed, serverSeedHash } = require('../services/rng');

async function getCases(req, res) {
  try {
    const cases = await Case.find().populate('prizePool');
    res.json({ cases });
  } catch (e) {
    console.error('getCases', e);
    res.status(500).json({ error: 'Server error' });
  }
}

async function openCase(req, res) {
  try {
    const { caseId, clientSeed } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const cs = await Case.findById(caseId).populate('prizePool');
    if (!cs) return res.status(404).json({ error: 'Case not found' });
    if (user.balance < cs.price) return res.status(400).json({ error: 'Not enough balance' });

    user.balance -= cs.price;
    await user.save();

    const serverSeed = genServerSeed();
    const serverHash = serverSeedHash(serverSeed);
    const pool = cs.prizePool;
    const idx = randomFromSeeds(serverSeed, clientSeed || Math.random().toString(36).slice(2), pool.length);
    const prizeTemplate = pool[idx];

    // Создаём локальную копию предмета для пользователя
    const userItem = new Item({
      name: prizeTemplate.name,
      icon: prizeTemplate.icon,
      rarity: prizeTemplate.rarity,
      price: prizeTemplate.price
    });
    await userItem.save();

    // Добавляем в инвентарь пользователя
    user.inventory = user.inventory || [];
    user.inventory.push(userItem._id);
    await user.save();

    res.json({
      prize: userItem,
      serverSeedHash: serverHash,
      // в продакшене не выдавать serverSeed сразу — выдавать позже для проверки честности
      serverSeed
    });
  } catch (e) {
    console.error('openCase', e);
    res.status(500).json({ error: 'Server error' });
  }
}

async function spinWheel(req, res) {
  try {
    const { clientSeed } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const entries = await WheelEntry.find().populate('item');
    const pool = [];
    entries.forEach(e => {
      const weight = Math.max(1, Math.floor(e.weight || 1));
      for (let i = 0; i < weight; i++) pool.push(e.item);
    });
    if (!pool.length) return res.status(400).json({ error: 'No wheel items' });

    const serverSeed = genServerSeed();
    const serverHash = serverSeedHash(serverSeed);
    const idx = randomFromSeeds(serverSeed, clientSeed || Math.random().toString(36).slice(2), pool.length);
    const prizeTemplate = pool[idx];

    const userItem = new Item({
      name: prizeTemplate.name,
      icon: prizeTemplate.icon,
      rarity: prizeTemplate.rarity,
      price: prizeTemplate.price
    });
    await userItem.save();

    user.inventory = user.inventory || [];
    user.inventory.push(userItem._id);
    await user.save();

    res.json({ prize: userItem, serverSeedHash: serverHash, serverSeed });
  } catch (e) {
    console.error('spinWheel', e);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getCases, openCase, spinWheel };
