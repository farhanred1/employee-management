const mongoose = require('mongoose');

const url = 'mongodb://mongo:27017/ApolloniaDentalPractice';

const connectDb = async () => {
  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectDb;
