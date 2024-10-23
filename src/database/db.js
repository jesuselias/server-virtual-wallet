const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 50,
      wtimeoutMS: 2500,
    });
    console.log('Connecting to MongoDB');
  } catch (err) {
    console.error('bug connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
