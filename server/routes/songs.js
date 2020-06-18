const { Router } = require('express');
const resolve = require("./../api/resolve");
const ROLES = require("./../constants/roles");
const { authorize } = require("./../security/auth");
const { selectAllSongs, insertSong, deleteSong } = require("./../services/song");
const upload = require('../middlewares/upload');
const router = Router();

router.get("/all", authorize(ROLES.ADMIN, ROLES.USER), (req, res) => {
  selectAllSongs(resolve(req, res));
});

router.post("/insert",
  authorize(ROLES.ADMIN),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'song', maxCount: 1 },
  ]),
  (req, res) => {
    const data = req.body;
    const [thumbnailFile] = req.files.thumbnail;
    const [songFile] = req.files.song;
    insertSong({
      ...data,
      thumbnail: thumbnailFile.filename,
      source: songFile.filename
    }, resolve(req, res));
  }
);

router.delete("/delete/:id", authorize(ROLES.ADMIN), (req, res) => {
  const { id } = req.params;
  deleteSong(id, resolve(req, res));
});

module.exports = router;