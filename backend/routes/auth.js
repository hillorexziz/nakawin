const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Вход в аккаунт
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Заполните все поля' });
    }

    const user = await User.findOne({ username });
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: 'Аккаунт заблокирован' });
    }

    // Обновляем статус онлайн
    user.isOnline = true;
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        gameNickname: user.gameNickname,
        balance: user.balance,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Выход из аккаунта
router.post('/logout', auth, async (req, res) => {
  try {
    req.user.isOnline = false;
    await req.user.save();
    res.json({ message: 'Успешный выход' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Проверка токена
router.get('/verify', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      gameNickname: req.user.gameNickname,
      balance: req.user.balance,
      isAdmin: req.user.isAdmin
    }
  });
});

module.exports = router;