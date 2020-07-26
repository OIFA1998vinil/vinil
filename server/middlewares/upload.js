/**
 * Provides multer middleware for express to handle file uploads using 'multipart/form-data'
 * @module server/middlewares/upload
 */

const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, path.join(__dirname + "/../../uploads"));
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}-${file.originalname}`);
  }
});

/**
 * Provides multer middleware for express to handle file uploads using 'multipart/form-data'
 * @function
 * @param {multer.Options} options Multer middleware options see [multer docs]{@link https://www.npmjs.com/package/multer#multeropts} for more information
 */
const upload = multer({ storage: storage });

module.exports = upload;