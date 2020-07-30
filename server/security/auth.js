/**
 * Auth module
 * @module server/security/auth
 */

const { generate, verify } = require("./jwt");
const EXPIRATION_TIME = 604800000;

/**
 * Signs a cookie with an authentication token
 * @param {Object} res Express response
 * @param {String} key Cookie name
 * @param {Object} data Data to tokenize the cookie
 */
function authenticate(res, key, data) {
  const token = generate(data);
  res.cookie(key, token, { expires: new Date(Date.now() + EXPIRATION_TIME), secure: false, httpOnly: true });
}

/**
 * Clears a cookie authetication token
 * @param {Object} res Express response
 * @param {String} key Cookie name
 */
function deauthenticate(res, key) {
  res.clearCookie(key);
}

/**
 * Authorization Middleware
 * Verifies the cookies from the browser before accessing routes functionalities
 * @param  {...String} keys Roles allowed
 */
function authorize(...keys) {
  return (req, res, next) => {
    const tokens = keys.map(key => req.cookies[key]);

    if (!tokens.length) {
      res.status(401);
      return res.end();
    }

    const makeVerification = () => {
      verify(tokens.shift(), (error, data) => {
        if (error) {
          if (tokens.length) {
            makeVerification();
          } else {
            res.status(401);
            return res.json({ error });
          }
        } else {
          req.session = data;
          next();
        }

      });
    };
    makeVerification();
  };
}

module.exports = {
  authenticate,
  deauthenticate,
  authorize
};