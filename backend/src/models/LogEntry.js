const mongoose = require('mongoose');


const LogSchema = new mongoose.Schema({
type: String, // 'sell', 'withdraw', etc
text: String,
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('LogEntry', LogSchema);