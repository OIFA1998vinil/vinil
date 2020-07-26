/**
 * Song model
 * @module server/models/Song
 */
const mongoose = require('mongoose');

/**
 * Song instance
 * @typedef {Object} SongType
 * @property {String} title Title
 * @property {Number} year Year
 * @property {String} source ID of the song file in Google Drive
 * @property {String} thumbnail ID of the thumbnail file in Google Drive
 * @property {String[]} genres Genres list
 * @property {String} collaborator ID of the collaborator
 */

/**
 * @class
 * @extends {mongoose.Model}
 * @param {Object} props Model initial properties
 * @param {String} props.title Title
 * @param {Number} props.year Year
 * @param {String} props.source ID of the song file in Google Drive
 * @param {String} props.thumbnail ID of the thumbnail file in Google Drive
 * @param {String[]} props.genres Genres list
 * @param {String} props.collaborator ID of the collaborator
 */
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