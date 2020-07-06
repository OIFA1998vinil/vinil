const mongoose = require('mongoose');

const Collaborator = mongoose.model('Collaborator', {
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  status: { type: String, required: true },
});

module.exports = Collaborator;