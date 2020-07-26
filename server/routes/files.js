/**
 * Registers the request handlers under /api/v1/files/ path
 * @module server/routes/files
 */

const { Router } = require('express');
const drive = require("./../services/drive");

const router = Router();

/**
 * HTTP GET /api/v1/files/<google_drive_file_id>
 */
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