// Контроллер аутентификации (login).
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid username or password' });

    const token = jwt.sign({
      id: user._id,
      username: user.username,
      roles: user.roles || []
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

    // возвращаем минимальную информацию о пользователе
    res.json({
      token,
      user: {
        username: user.username,
        balance: user.balance,
        gameNick: user.gameNick,
        bankAccount: user.bankAccount,
        serverName: user.serverName
      }
    });
  } catch (e) {
    console.error('Login error', e);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { login };
