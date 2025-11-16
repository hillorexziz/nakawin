const mongoose = require('mongoose');


const WheelEntry = new mongoose.Schema({
item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
weight: Number,
sliceSize: Number // for visual sizing on frontend
});


module.exports = mongoose.model('WheelEntry', WheelEntry);