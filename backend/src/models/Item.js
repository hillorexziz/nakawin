const mongoose = require('mongoose');


const ItemSchema = new mongoose.Schema({
name: String,
icon: String, // path to png in frontend assets
rarity: { type: Number, default: 1 },
price: { type: Number, default: 0 },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Item', ItemSchema);