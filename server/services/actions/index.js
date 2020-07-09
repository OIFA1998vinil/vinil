const Action = require('../../models/Action');
const Song = require('../../models/Song');
const drive = require("./../drive");
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

function stageInsertSong(collaboratorId, data, callback) {
  const action = new Action({ type: INSERT_SONG, collaborator: collaboratorId, payload: { song: data } });
  action.save().then((doc) => callback(null, doc))
    .catch(err => callback(exception(err)))
}

function commitInsertSong(actionId, callback) {
  Action.findOne({ _id: actionId, type: INSERT_SONG }, (err, action) => {
    if (err || !action) {
      return callback(exception(err || "No se pudo procesar su solicitud"));
    }
    const song = new Song({ ...action.payload.song, collaborator: action.collaborator });
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

function discardInsertSong(actionId, callback) {
  Action.findOne({ _id: actionId, type: INSERT_SONG }, (err, action) => {
    if (err) {
      return callback(exception(err));
    }
    const { source, thumbnail } = action.payload.song;
    discardAction(actionId, err => {
      if (err) {
        return callback(err);
      }
      callback(null, true);
      drive.remove(source);
      drive.remove(thumbnail);
    });
  });
}

function stagedSongs(callback) {
  Action.find({ type: INSERT_SONG })
    .populate({ path: 'collaborator', select: '-password' })
    .exec((err, actions) => {
      if (err) {
        return callback(exception(err));
      }
      callback(null, actions);
    });
}

function stagedSongsByCollaboratorId(id, callback) {
  Action.find({ type: INSERT_SONG, collaborator: id }, (err, actions) => {
    if (err) {
      return callback(exception(err));
    }
    callback(null, actions);
  });
}

module.exports = {
  stageInsertSong,
  commitInsertSong,
  discardInsertSong,
  stagedSongs,
  stagedSongsByCollaboratorId
}