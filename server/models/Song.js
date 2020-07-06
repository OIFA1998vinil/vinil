const mongoose = require('mongoose');

const Song = mongoose.model('Song', {
  title: { type: String, required: true },
  year: { type: Number, required: true },
  source: { type: String, required: true },
  thumbnail: { type: String, required: true },
  genres: { type: [String], required: true, default: [] },
  collaborator: {
    type: mongoose.Schema.Types.ObjectId, // Foreign Key
    ref: "Collaborator", // References BusRoute 
    required: false // Nullable because admin can add songs too
  }
});

module.exports = Song;