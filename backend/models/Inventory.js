const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    name: String,
    image: String,
    price: Number,
    sellPrice: Number,
    rarity: Number,
    source: {
      type: String,
      enum: ['case', 'wheel'],
      required: true
    }
  },
  status: {
    type: String,
    enum: ['in_inventory', 'sold', 'withdrawn'],
    default: 'in_inventory'
  },
  obtainedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inventory', inventorySchema);