const exception = require("./../errors/exception");
const Song = require("./../models/Song");
const { remove } = require("./drive");

function insertSong(data, callback) {
  const song = new Song(data);
  song.save()
    .then(result => callback(null, result))
    .catch(error => callback(exception(error)));
}

function selectAllSongs(callback) {
  Song.find({}, (error, results) => {
    if (error) {
      callback(exception(error));
    } else {
      callback(null, results);
    }
  });
}

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