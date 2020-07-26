/**
 * Registers the request handlers under /api/v1/actions/ path
 * @module server/routes/actions
 */

const { Router } = require('express');
const fs = require("fs");
const { promisify } = require("util")
const resolve = require("./../api/resolve");
const ROLES = require("./../constants/roles");
const { authorize } = require("./../security/auth");
const { stageInsertSong, commitInsertSong, discardInsertSong, stagedSongs, stagedSongsByCollaboratorId } = require('../services/actions');
const upload = require('../middlewares/upload');
const drive = require("../services/drive")
const exception = require('../errors/exception');

const router = Router();

/**
 * HTTP POST /api/v1/actions/stage/insert-song
 * REQUIRES AUTHORIZATION [COLLABORATOR]
 * USES upload MIDDLEWARE to store files from request body into temporal disk storage
 */
router.post("/stage/insert-song", authorize(ROLES.COLLABORATOR), upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'song', maxCount: 1 },]), (req, res) => {
  const { _id } = req.session;
  const data = req.body;
  const [thumbnailFile] = req.files.thumbnail;
  const [songFile] = req.files.song;

  Promise.all([
    promisify(drive.upload)(thumbnailFile.path),
    promisify(drive.upload)(songFile.path)
  ])
    .then(([thumbnail, source]) => {
      stageInsertSong(_id, { ...data, genres: [data.genres], thumbnail, source }, (err, action) => {
        resolve(req, res)(err, action);
        fs.unlink(thumbnailFile.path);
        fs.unlink(songFile.path);
      });
    })
    .catch(err => resolve(req, res)(exception(err)));
});

/**
 * HTTP POST /api/v1/actions/commit/insert-song/<song_id>
 */
router.post("/commit/insert-song/:id", authorize(ROLES.ADMIN), (req, res) => {
  const { id } = req.params;
  commitInsertSong(id, resolve(req, res));
});

/**
 * HTTP POST /api/v1/actions/discard/insert-song/<song_id>
 */
router.post("/discard/insert-song/:id", authorize(ROLES.ADMIN), (req, res) => {
  const { id } = req.params;
  discardInsertSong(id, resolve(req, res));
});

/**
 * HTTP GET /api/v1/actions/staged/songs
 */
router.get("/staged/songs", authorize(ROLES.ADMIN), (req, res) => {
  stagedSongs(resolve(req, res));
});

/**
 * HTTP GET /api/v1/actions/staged/songs/<collaborator_id>
 */
router.get("/staged/songs/:collaboratorId", authorize(ROLES.COLLABORATOR), (req, res) => {
  const { collaboratorId } = req.params;
  stagedSongsByCollaboratorId(collaboratorId, resolve(req, res));
});

module.exports = router;