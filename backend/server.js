require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();

// Подключение к MongoDB
const connectDB = require('./config/database');
connectDB();

// Middleware безопасности
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов за окно
  message: { message: 'Слишком много запросов, попробуйте позже' }
});
app.use('/api/', limiter);

// Более строгий лимит для аутентификации
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Слишком много попыток входа, попробуйте позже' }
});
app.use('/api/auth/login', authLimiter);

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Логирование запросов
app.use((req, res, next) => {
  const logger = require('./utils/logger');
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Создание папки для логов если не существует
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Импорт маршрутов
const authRoutes = require('./routes/auth');
const caseRoutes = require('./routes/cases');
const wheelRoutes = require('./routes/wheel');
const inventoryRoutes = require('./routes/inventory');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');

// Использование маршрутов
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/wheel', wheelRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Статические файлы
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Обработка 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

// Глобальный обработчик ошибок
app.use((error, req, res, next) => {
  const logger = require('./utils/logger');
  logger.error('Unhandled error', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method
  });

  res.status(500).json({ 
    message: 'Внутренняя ошибка сервера',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

const PORT = process.env.PORT || 5000;

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`🌐 Окружение: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
});