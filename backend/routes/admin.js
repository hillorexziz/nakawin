const express = require('express');
const User = require('../models/User');
const Case = require('../models/Case');
const Wheel = require('../models/Wheel');
const Inventory = require('../models/Inventory');
const auth = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const router = express.Router();

// Все маршруты требуют авторизации и прав администратора
router.use(auth, adminMiddleware);

// Статистика пользователей
router.get('/stats/users', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const onlineUsers = await User.countDocuments({ isOnline: true });
    const bannedUsers = await User.countDocuments({ isBanned: true });
    
    // Пользователи за сегодня
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayUsers = await User.countDocuments({ registrationDate: { $gte: today } });

    res.json({
      totalUsers,
      onlineUsers,
      bannedUsers,
      todayUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Список пользователей
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ registrationDate: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Бан/разбан пользователя
router.post('/users/:userId/ban', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ 
      message: `Пользователь ${user.isBanned ? 'заблокирован' : 'разблокирован'}`,
      isBanned: user.isBanned
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Назначение администратора
router.post('/users/:userId/make-admin', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.isAdmin = true;
    await user.save();

    res.json({ message: 'Пользователь назначен администратором' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Управление кейсами
router.get('/cases', async (req, res) => {
  try {
    const cases = await Case.find();
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создание кейса
router.post('/cases', async (req, res) => {
  try {
    const caseData = req.body;
    const newCase = new Case(caseData);
    await newCase.save();
    res.json(newCase);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания кейса' });
  }
});

// Обновление кейса
router.put('/cases/:caseId', async (req, res) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(
      req.params.caseId,
      req.body,
      { new: true }
    );
    res.json(updatedCase);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления кейса' });
  }
});

// Управление колесом
router.get('/wheel', async (req, res) => {
  try {
    const wheel = await Wheel.findOne();
    res.json(wheel);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновление колеса
router.put('/wheel/:wheelId', async (req, res) => {
  try {
    const updatedWheel = await Wheel.findByIdAndUpdate(
      req.params.wheelId,
      req.body,
      { new: true }
    );
    res.json(updatedWheel);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления колеса' });
  }
});

module.exports = router;