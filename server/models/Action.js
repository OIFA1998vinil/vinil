const mongoose = require('mongoose');

const Action = mongoose.model('Action', {
  type: { type: String, required: true },
  payload: { type: Object, required: true },
  collaborator: {
    type: mongoose.Schema.Types.ObjectId, // Foreign Key
    ref: "Collaborator", // References Collaborator
    required: true // Not null
  }
});

module.exports = Action;