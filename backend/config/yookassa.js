const yookassa = require('yookassa');

const paymentClient = yookassa({
  shopId: process.env.YOOKASSA_SHOP_ID,
  secretKey: process.env.YOOKASSA_SECRET_KEY
});

// Конфигурация платежей
const paymentConfig = {
  // Автоматический прием платежей
  capture: true,
  
  // Настройки уведомлений
  notification: {
    url: process.env.WEBHOOK_URL || 'https://nakawin.ru/api/payment/webhook',
    events: ['payment.succeeded', 'payment.canceled', 'payment.waiting_for_capture']
  },
  
  // Настройки метаданных
  metadata: {
    platform: 'nakawin-casino',
    version: '1.0.0'
  }
};

// Валидация суммы платежа
const validatePaymentAmount = (amount) => {
  return amount >= 100 && amount <= 999999;
};

// Создание описания платежа
const createPaymentDescription = (username, amount) => {
  return `Пополнение баланса Nakawin - ${username} на ${amount} рублей`;
};

module.exports = {
  paymentClient,
  paymentConfig,
  validatePaymentAmount,
  createPaymentDescription
};