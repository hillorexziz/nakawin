class ProvablyFairRNG {
  constructor(serverSeed, clientSeed, nonce) {
    this.serverSeed = serverSeed;
    this.clientSeed = clientSeed;
    this.nonce = nonce;
  }

  // Генерация хеша для проверки честности
  generateHash() {
    const crypto = require('crypto');
    const hash = crypto.createHmac('sha256', this.serverSeed);
    hash.update(`${this.clientSeed}:${this.nonce}`);
    return hash.digest('hex');
  }

  // Генерация случайного числа от 0 до 1
  generateNumber() {
    const hash = this.generateHash();
    const substring = hash.substring(0, 8);
    const number = parseInt(substring, 16);
    return number / 4294967295; // 2^32 - 1
  }

  // Выбор приза из кейса на основе шансов
  selectPrize(items) {
    const random = this.generateNumber();
    let cumulative = 0;
    
    for (const item of items) {
      cumulative += item.dropChance;
      if (random <= cumulative) {
        return item;
      }
    }
    
    return items[items.length - 1]; // fallback
  }

  // Выбор сектора на колесе
  selectWheelSection(sections) {
    const random = this.generateNumber();
    const totalWeight = sections.reduce((sum, section) => sum + section.weight, 0);
    let cumulative = 0;
    
    for (const section of sections) {
      cumulative += section.weight / totalWeight;
      if (random <= cumulative) {
        return section;
      }
    }
    
    return sections[sections.length - 1]; // fallback
  }
}

module.exports = ProvablyFairRNG;