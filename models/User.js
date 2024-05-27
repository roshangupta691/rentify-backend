// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ['buyer', 'seller'] }
});

module.exports = mongoose.model('User', userSchema);
