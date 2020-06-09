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

module.exports = {
  insertSong,
  selectAllSongs
};