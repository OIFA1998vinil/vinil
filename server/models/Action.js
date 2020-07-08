const mongoose = require('mongoose');

const Action = mongoose.model('Action', {
  type: { type: String, required: true },
  payload: { type: Object, required: true },
});

module.exports = Action;