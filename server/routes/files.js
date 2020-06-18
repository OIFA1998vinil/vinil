const { Router } = require('express');
const drive = require("./../services/drive");

const router = Router();

router.get("/:id", (req, res) => {
  const { id } = req.params;
  drive.get(id, res, err => {
    if (err) {
      res.status(404);
      res.end();
    }
  });
});

module.exports = router;