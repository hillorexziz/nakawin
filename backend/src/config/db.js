const mongoose = require('mongoose');


async function connectDB() {
try {
await mongoose.connect(process.env.MONGO_URI, { });
console.log('Mongo connected');
} catch (e) {
console.error('Mongo connection error', e);
process.exit(1);
}
}


module.exports = { connectDB };