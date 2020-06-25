const mongoose = require('mongoose');

const User = mongoose.model('User', {
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  status: { type: String, required: true },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  bornDate: { type: Date, required: true },
  rol: { type: String, required: true },
});

module.exports = User;