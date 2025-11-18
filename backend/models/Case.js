const mongoose = require('mongoose');

const caseItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  sellPrice: {
    type: Number,
    required: true
  },
  rarity: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  dropChance: {
    type: Number,
    required: true
  }
});

const caseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  items: [caseItemSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Валидация: сумма шансов выпадения должна быть равна 1
caseSchema.pre('save', function(next) {
  const totalChance = this.items.reduce((sum, item) => sum + item.dropChance, 0);
  if (Math.abs(totalChance - 1) > 0.001) {
    return next(new Error('Сумма шансов выпадения должна равняться 1'));
  }
  next();
});

module.exports = mongoose.model('Case', caseSchema);