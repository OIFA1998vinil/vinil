/**
 * JWT module
 * @module server/security/jwt
 */

const jwt = require('jsonwebtoken');
const SECRET = "=th12_12*4#2up3r%23cur3/23cr3t¡"

/**
 * Generates a JWT from an object
 * @param {Object} data Object to tokenize
 * @returns {String} Token
 */
function generate(data) {
  return jwt.sign(data, SECRET, { expiresIn: '7d' });
}

/**
 * @callback verifyCallback
 * @param {Error} error Any error occurred during verification
 * @param {Object} data Token data
 */

/**
 * Verifies if a token has not expired and extracts its actual value
 * @param {String} token JWT
 * @param {verifyCallback} callback Callback
 */
function verify(token, callback) {
  jwt.verify(token, SECRET, callback);
}

module.exports = {
  generate,
  verify
};