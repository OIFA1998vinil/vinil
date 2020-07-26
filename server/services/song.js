/**
 * Songs Service
 * @module server/services/song
 */

const exception = require("./../errors/exception");
const Song = require("./../models/Song");
const { remove } = require("./drive");

/**
 * @callback songResultCallback
 * @param {Error} error Any error occurred during execution
 * @param {Object} song Song object
 */

/**
 * Inserts a song
 * @param {Object} data Song data
 * @param {songResultCallback} callback Callback
 */
function insertSong(data, callback) {
  const song = new Song(data);
  song.save()
    .then(result => callback(null, result))
    .catch(error => callback(exception(error)));
}

/**
 * @callback songsResultCallback
 * @param {Error} error Any error occurred during execution
 * @param {Object[]} songs Songs list
 */

/**
 * Selects all songs
 * @param {songsResultCallback} callback
 */
function selectAllSongs(callback) {
  Song.find({}, (error, results) => {
    if (error) {
      callback(exception(error));
    } else {
      callback(null, results);
    }
  });
}

/**
 * @callback booleanResultCallback
 * @param {Error} error Any error occurred during execution
 * @param {Boolean} wasSuccess Flag to know if the execution succeded
 */

/**
 * Deletes a song from database using its ID
 * @param {String} id Song ID
 * @param {booleanResultCallback} callback Callback
 */
function deleteSong(id, callback) {
  Song.findById(id, (error, result) => {
    if (error) {
      return callback(exception(error));
    }
    if (!result) {
      return callback(exception("La canción ya ha sido eliminada o no existe", 422));
    }

    const songId = result.source;
    const thumbnailId = result.thumbnail;

    Song.deleteOne({ _id: result._id }, err => {
      if (err) {
        callback(exception(err))
      } else {
        callback(null, true);
        remove(songId);
        remove(thumbnailId);
      }
    });
  });
}

module.exports = {
  insertSong,
  selectAllSongs,
  deleteSong
};