const { generate, verify } = require("./jwt");
const EXPIRATION_TIME = 604800000;

function authenticate(res, key, data) {
  const token = generate(data);
  res.cookie(key, token, { expires: new Date(Date.now() + EXPIRATION_TIME), secure: false, httpOnly: true, sameSite: 'None' });
}

function deauthenticate(res, key) {
  res.clearCookie(key);
}

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
        }
        req.session = data;
        next();
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