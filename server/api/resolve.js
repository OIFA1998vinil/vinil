/**
 * Resolves an express request
 * @module server/api/resolve
 */

/**
 * Resolves an express request
 * @param {object} req Express request
 * @param {object} res Express response
 */
function resolve(req, res) {
  let called = false;
  return (error, data) => {
    if (called) return;
    called = true;
    if (error) {
      res.status(error.code);
      res.json({ error: error.message });
    } else {
      res.status(200);
      res.json({ result: data });
    }
  };
}

module.exports = resolve;