const exception = require("./../errors/exception");
const Song = require("./../models/Song");
const fs = require("fs");
const path = require("path");

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
    const { source, thumbnail } = result;
    const sourcePath = path.join(__dirname + "/../../uploads/" + source);
    const thumbnailPath = path.join(__dirname + "/../../uploads/" + thumbnail);
    Promise.all([
      new Promise((res, rej) => fs.unlink(sourcePath, err => err ? rej(err) : res())),
      new Promise((res, rej) => fs.unlink(thumbnailPath, err => err ? rej(err) : res()))
    ])
      .then(() => {
        Song.deleteOne({ _id: result._id }, err => {
          if (err) {
            callback(exception(err))
          } else {
            callback(null, true);
          }
        });
      })
      .catch(err => callback(exception(err)));
  });
}

module.exports = {
  insertSong,
  selectAllSongs,
  deleteSong
};