const { body, validationResult } = require('express-validator');

// Валидация входа
const validateLogin = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Имя пользователя должно быть от 3 до 20 символов')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Имя пользователя может содержать только буквы, цифры и подчеркивания'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен быть не менее 6 символов')
];

// Валидация пополнения баланса
const validateDeposit = [
  body('amount')
    .isFloat({ min: 100, max: 999999 })
    .withMessage('Сумма должна быть от 100 до 999,999 рублей')
];

// Валидация создания кейса
const validateCase = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Название кейса должно быть от 2 до 50 символов'),
  
  body('price')
    .isFloat({ min: 1 })
    .withMessage('Цена должна быть положительным числом'),
  
  body('items')
    .isArray({ min: 1 })
    .withMessage('Кейс должен содержать хотя бы один предмет'),
  
  body('items.*.name')
    .isLength({ min: 1, max: 50 })
    .withMessage('Название предмета обязательно'),
  
  body('items.*.dropChance')
    .isFloat({ min: 0, max: 1 })
    .withMessage('Шанс выпадения должен быть от 0 до 1')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Ошибка валидации',
      errors: errors.array() 
    });
  }
  next();
};

module.exports = {
  validateLogin,
  validateDeposit,
  validateCase,
  handleValidationErrors
};