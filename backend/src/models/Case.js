const mongoose = require('mongoose');


const CaseSchema = new mongoose.Schema({
title: String,
cover: String,
price: Number,
prizePool: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
});


module.exports = mongoose.model('Case', CaseSchema);