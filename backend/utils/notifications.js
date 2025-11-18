class NotificationManager {
  constructor() {
    this.notifications = new Map();
  }

  // Создание уведомления
  createNotification(userId, type, message, duration = 5000) {
    const notification = {
      id: Date.now() + Math.random(),
      type, // 'success', 'error', 'warning', 'info'
      message,
      duration,
      createdAt: new Date()
    };

    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }

    const userNotifications = this.notifications.get(userId);
    userNotifications.push(notification);

    // Автоматическое удаление после истечения времени
    setTimeout(() => {
      this.removeNotification(userId, notification.id);
    }, duration);

    return notification;
  }

  // Получение уведомлений пользователя
  getUserNotifications(userId) {
    return this.notifications.get(userId) || [];
  }

  // Удаление уведомления
  removeNotification(userId, notificationId) {
    const userNotifications = this.notifications.get(userId);
    if (userNotifications) {
      this.notifications.set(
        userId, 
        userNotifications.filter(n => n.id !== notificationId)
      );
    }
  }

  // Очистка старых уведомлений
  cleanupOldNotifications() {
    const now = new Date();
    const maxAge = 24 * 60 * 60 * 1000; // 24 часа

    for (const [userId, notifications] of this.notifications) {
      const freshNotifications = notifications.filter(
        n => now - n.createdAt < maxAge
      );
      this.notifications.set(userId, freshNotifications);
    }
  }
}

// Синглтон экземпляр
const notificationManager = new NotificationManager();

// Запуск очистки каждые час
setInterval(() => {
  notificationManager.cleanupOldNotifications();
}, 60 * 60 * 1000);

module.exports = notificationManager;