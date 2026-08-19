const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Check your MONGO_URI in .env (Atlas connection string, password, and network access IP allowlist).');
    process.exit(1);
  }
};

module.exports = connectDB;
