const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logsDir = path.join(__dirname, '../logs');
    this.ensureLogsDirectory();
  }

  ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  getCurrentDate() {
    return new Date().toISOString().split('T')[0];
  }

  getLogFilePath(type = 'app') {
    return path.join(this.logsDir, `${type}_${this.getCurrentDate()}.log`);
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data
    };

    const logString = `${timestamp} [${level.toUpperCase()}] ${message} ${
      data ? JSON.stringify(data) : ''
    }\n`;

    // Запись в файл
    fs.appendFileSync(this.getLogFilePath(), logString, 'utf8');

    // Вывод в консоль в development
    if (process.env.NODE_ENV !== 'production') {
      console.log(logString.trim());
    }
  }

  info(message, data = null) {
    this.log('info', message, data);
  }

  error(message, data = null) {
    this.log('error', message, data);
  }

  warn(message, data = null) {
    this.log('warn', message, data);
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV !== 'production') {
      this.log('debug', message, data);
    }
  }

  // Специальный логгер для вывода предметов
  logWithdrawal(user, item) {
    const logEntry = `
[ВЫВОД ПРЕДМЕТА]
Время: ${new Date().toISOString()}
Игрок: ${user.username}
Никнейм: ${user.gameNickname}
Банковский счет: ${user.bankAccount}
Сервер: ${user.server}
Предмет: ${item.name}
Стоимость: ${item.price}
ID предмета: ${item._id}
_________________________________________________________
`;

    fs.appendFileSync(
      path.join(this.logsDir, 'vivod.log'), 
      logEntry, 
      'utf8'
    );

    this.info('Item withdrawal requested', { 
      username: user.username, 
      item: item.name,
      price: item.price 
    });
  }
}

module.exports = new Logger();