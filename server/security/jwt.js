const jwt = require('jsonwebtoken');
const SECRET = "=th12_12*4#2up3r%23cur3/23cr3t¡"

function generate(data) {
  return jwt.sign(data, SECRET, { expiresIn: '7d' });
}

function verify(token, callback) {
  jwt.verify(token, SECRET, callback);
}

module.exports = {
  generate,
  verify
};