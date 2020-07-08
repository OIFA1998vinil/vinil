const { Router } = require('express');
const fs = require("fs");
const { promisify } = require("util")
const resolve = require("./../api/resolve");
const ROLES = require("./../constants/roles");
const { authorize } = require("./../security/auth");
const { selectAllSongs, insertSong, deleteSong } = require("./../services/song");
const drive = require("./../services/drive");
const upload = require('../middlewares/upload');
const { exception } = require('console');
const router = Router();

router.get("/all", authorize(ROLES.ADMIN, ROLES.USER), (req, res) => {
  selectAllSongs(resolve(req, res));
});

router.post("/insert", authorize(ROLES.ADMIN), upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'song', maxCount: 1 },]), (req, res) => {
  const data = req.body;
  const [thumbnailFile] = req.files.thumbnail;
  const [songFile] = req.files.song;
  Promise.all([
    promisify(drive.upload)(thumbnailFile.path),
    promisify(drive.upload)(songFile.path)
  ])
    .then(([thumbnail, source]) => {
      insertSong({ ...data, thumbnail, source }, (err, song) => {
        resolve(req, res)(err, song);
        fs.unlink(thumbnailFile.path);
        fs.unlink(songFile.path);
      });
    })
    .catch(err => resolve(req, res)(exception(err)));
}
);

router.delete("/delete/:id", authorize(ROLES.ADMIN), (req, res) => {
  const { id } = req.params;
  deleteSong(id, resolve(req, res));
});

module.exports = router;