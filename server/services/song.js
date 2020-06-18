const exception = require("./../errors/exception");
const Song = require("./../models/Song");

function insertSong(data, callback) {
  const song = new Song(data);
  song.save()
    .then(result => {
      callback(null, result);
    })
    .catch(error => {
      callback(exception(error));
    });
}

function selectAllSongs(callback) {
  Song.find({}, (error, results) => {
    if (error) {
      return callback(exception(error));
    }
    return callback(null, results);
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

    // TODO: delete in google drive

    Song.deleteOne({ _id: result._id }, err => {
      if (err) {
        callback(exception(err))
      } else {
        callback(null, true);
      }
    });
  });
}

module.exports = {
  insertSong,
  selectAllSongs,
  deleteSong
};