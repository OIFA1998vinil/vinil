const { Router } = require('express');
const resolve = require("./../api/resolve");
const ROLES = require("./../constants/roles");
const { authenticate, deauthenticate } = require("./../security/auth");
const { validateUserCredentials } = require("./../services/user");

const router = Router();

router.post("/sign-in", (req, res) => {
  const credentials = req.body;
  validateUserCredentials(credentials, (error, user) => {
    if (!error) {
      authenticate(res, ROLES.USER, user);
    }
    resolve(req, res)(error, user);
  });
});

router.post("/sign-out", (req, res) => {
  deauthenticate(res, ROLES.USER);
  resolve(req, res)(null, true);
});

module.exports = router;