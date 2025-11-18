const admin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

module.exports = admin;