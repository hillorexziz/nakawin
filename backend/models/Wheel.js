const mongoose = require('mongoose');

const wheelSectionSchema = new mongoose.Schema({
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
  weight: {
    type: Number,
    required: true
  },
  angleStart: Number,
  angleEnd: Number
});

const wheelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  spinPrice: {
    type: Number,
    required: true
  },
  sections: [wheelSectionSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Wheel', wheelSchema);