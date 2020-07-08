const { Router } = require('express');
const fs = require("fs");
const { promisify } = require("util")
const resolve = require("./../api/resolve");
const ROLES = require("./../constants/roles");
const { authorize } = require("./../security/auth");
const { stageInsertSong, commitInsertSong, discardInsertSong, stagedSongs, stagedSongsByCollaboratorId } = require('../services/actions');
const { upload } = require('../services/drive');
const drive = require("../services/drive")
const exception = require('../errors/exception');

const router = Router();

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
      stageInsertSong(_id, { ...data, thumbnail, source }, (err, action) => {
        resolve(req, res)(err, action);
        fs.unlink(thumbnailFile.path);
        fs.unlink(songFile.path);
      });
    })
    .catch(err => resolve(req, res)(exception(err)));
});

router.post("/commit/insert-song/:id", authorize(ROLES.ADMIN), (req, res) => {
  const { id } = req.params;
  commitInsertSong(id, resolve(req, res));
});

router.post("/discard/insert-song/:id", authorize(ROLES.ADMIN), (req, res) => {
  const { id } = req.params;
  discardInsertSong(id, resolve(req, res));
});

router.get("/staged/songs", authorize(ROLES.ADMIN), (req, res) => {
  stagedSongs(resolve(req, res));
});

router.get("/staged/songs/:collaboratorId", authorize(ROLES.COLLABORATOR), (req, res) => {
  const { collaboratorId } = req.params;
  stagedSongsByCollaboratorId(collaboratorId, resolve(req, res));
});

module.exports = router;