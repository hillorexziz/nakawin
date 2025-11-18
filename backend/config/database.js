const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB подключена');
  } catch (error) {
    console.error('Ошибка подключения MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;