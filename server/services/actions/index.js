const Action = require('../../models/Action');
const Song = require('../../models/Song');
const exception = require('../../errors/exception');
const { INSERT_SONG } = require('./actions');

function discardAction(actionId, callback) {
  Action.deleteOne({ _id: actionId }, err => {
    if (err) {
      return callback(exception(err));
    }
    return callback(null, true);
  });
}

function stageInsertSong(data, callback) {
  const song = new Song(data);
  const action = new Action({ type: INSERT_SONG, payload: { song: song.toObject() } });
  action.save().then((doc) => callback(null, doc))
    .catch(err => callback(exception(err)))
}

function commitInsertSong(actionId, callback) {
  Action.findOne({ _id: actionId, type: INSERT_SONG }, (err, action) => {
    if (err || !action) {
      return callback(exception(err || "No se pudo procesar su solicitud"));
    }
    const song = new Song(action.payload.song);
    song.save().then(doc => {
      discardAction(actionId, err => {
        if (err) {
          return callback(err);
        }
        return callback(null, doc);
      });
    })
      .catch(err => callback(exception(err)));
  });
}

module.exports = {
  discardAction,
  stageInsertSong,
  commitInsertSong
}