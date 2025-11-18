const express = require('express');
const yookassa = require('yookassa');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

const paymentClient = yookassa({
  shopId: process.env.YOOKASSA_SHOP_ID,
  secretKey: process.env.YOOKASSA_SECRET_KEY
});

// Создание платежа
router.post('/create-payment', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount < 100 || amount > 999999) {
      return res.status(400).json({ message: 'Сумма должна быть от 100 до 999,999 рублей' });
    }

    const payment = await paymentClient.createPayment({
      amount: {
        value: amount,
        currency: 'RUB'
      },
      payment_method_data: {
        type: 'bank_card'
      },
      confirmation: {
        type: 'redirect',
        return_url: `${req.headers.origin}/payment-success`
      },
      description: `Пополнение баланса Nakawin - ${req.user.username}`,
      metadata: {
        userId: req.user._id.toString(),
        username: req.user.username
      }
    });

    res.json({
      paymentId: payment.id,
      confirmationUrl: payment.confirmation.confirmation_url
    });
  } catch (error) {
    console.error('Ошибка создания платежа:', error);
    res.status(500).json({ message: 'Ошибка создания платежа' });
  }
});

// Вебхук для обработки уведомлений от ЮKassa
router.post('/webhook', async (req, res) => {
  try {
    const { object } = req.body;

    if (object.status === 'succeeded') {
      const userId = object.metadata.userId;
      const amount = object.amount.value;

      const user = await User.findById(userId);
      if (user) {
        user.balance += amount;
        await user.save();
        
        console.log(`Баланс пользователя ${user.username} пополнен на ${amount}`);
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Ошибка обработки вебхука:', error);
    res.status(500).send('Error');
  }
});

// Проверка статуса платежа
router.get('/payment-status/:paymentId', auth, async (req, res) => {
  try {
    const payment = await paymentClient.getPayment(req.params.paymentId);
    
    res.json({
      status: payment.status,
      amount: payment.amount.value
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка проверки статуса платежа' });
  }
});

module.exports = router;