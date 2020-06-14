const { Router } = require('express');
const path = require("path");

const router = Router();

router.get("/:filename", (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname + "/../../uploads/" + filename));
});

module.exports = router;