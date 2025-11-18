const crypto = require('crypto');

class SecurityManager {
  // Генерация безопасного случайного числа
  static generateSecureRandom(min, max) {
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const randomBytes = crypto.randomBytes(bytesNeeded);
    const randomValue = randomBytes.readUIntBE(0, bytesNeeded);
    
    return min + (randomValue % range);
  }

  // Проверка попытки мошенничества
  static detectFraudAttempt(userData, action) {
    const suspiciousPatterns = [
      // Слишком частые запросы
      userData.requestCount > 100,
      // Необычно большие суммы
      action.amount > 100000,
      // Подозрительные изменения данных
      userData.unusualBehaviorDetected
    ];

    return suspiciousPatterns.some(pattern => pattern === true);
  }

  // Валидация входных данных
  static sanitizeInput(input) {
    if (typeof input === 'string') {
      // Удаление потенциально опасных символов
      return input.replace(/[<>]/g, '').trim();
    }
    return input;
  }

  // Хеширование для проверки целостности данных
  static generateDataHash(data, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(data));
    return hmac.digest('hex');
  }

  // Проверка подписи данных
  static verifyDataSignature(data, signature, secret) {
    const expectedSignature = this.generateDataHash(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }
}

module.exports = SecurityManager;