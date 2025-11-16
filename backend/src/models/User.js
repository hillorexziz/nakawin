const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true }, // ник сайта
passwordHash: { type: String, required: true },
balance: { type: Number, default: 1000 },
bankAccount: { type: String, default: '' },
gameNick: { type: String, default: '' },
serverName: { type: String, default: '' },
inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
roles: [{ type: String }],
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('User', UserSchema);