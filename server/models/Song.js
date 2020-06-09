const mongoose = require('mongoose');

const Song = mongoose.model('Song', {
  title: { type: String, required: true },
  year: { type: Number, required: true },
  source: { type: String, required: true },
  thumbnail: { type: String, required: true },
  genres: { type: [String], required: true, default: [] }
});

module.exports = Song;