/**
 * Actions service
 * @module server/services/actions
 */

const Action = require('../../models/Action');
const Song = require('../../models/Song');
const drive = require("./../drive");
const exception = require('../../errors/exception');
const { INSERT_SONG } = require('./actions');

/**
 * @callback boolResultCallback
 * @param {Error} error Any error occurred during execution
 * @param {Boolean} wasSuccess Flag to determine if the action was completed
 */

/**
 * Removes an action using its id from database
 * @param {String} actionId Action id
 * @param {boolResultCallback} callback Callback
 */
function discardAction(actionId, callback) {
  Action.deleteOne({ _id: actionId }, err => {
    if (err) {
      return callback(exception(err));
    }
    return callback(null, true);
  });
}

/**
 * @callback actionResultCallback
 * @param {Error} error Any error occurred during execution
 * @param {Object} action Action
 */

/**
 * Creates an action to insert a song
 * @param {String} collaboratorId Collaborator ID
 * @param {Object} data Song data
 * @param {actionResultCallback} callback Callback
 */
function stageInsertSong(collaboratorId, data, callback) {
  const action = new Action({ type: INSERT_SONG, collaborator: collaboratorId, payload: { song: data } });
  action.save().then((doc) => callback(null, doc))
    .catch(err => callback(exception(err)))
}

/**
 * @callback songResultCallback
 * @param {Error} error Any error occurred during execution
 * @param {Object} song Song
 */

/**
 * Creates a Song using an stored action
 * @param {String} actionId Action ID
 * @param {songResultCallback} callback Callback
 */
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

/**
 * Removes an action of type INSERT_SONG by its ID
 * @param {String} actionId Action ID
 * @param {boolResultCallback} callback Callback
 */
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

/**
 * @callback actionsResultCallback
 * @param {Error} error Any error occurred during execution
 * @param {Object[]} songs List of actions
 */

/**
 * Finds all the actions matching type INSER_SONG
 * @param {actionsResultCallback} callback Callback
 */
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

/**
 * Finds all the actions matching type INSER_SONG and an collaborator by it's id
 * @param {String} id Collaborator ID
 * @param {actionsResultCallback} callback Callback
 */
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