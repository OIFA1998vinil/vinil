const { Router } = require('express');
const resolve = require("./../api/resolve");
const ROLES = require("./../constants/roles");
const { authorize } = require("./../security/auth");
const { selectAllSongs, insertSong } = require("./../services/song");

const router = Router();

router.use(authorize(ROLES.ADMIN, ROLES.USER));

router.get("/all", (req, res) => {
  selectAllSongs(resolve(req, res));
});

router.post("/insert", (req, res) => {
  const data = req.body;
  insertSong(data, resolve(req, res));
});

module.exports = router;