const { Router } = require('express');
const resolve = require("./../api/resolve");
const ROLES = require("./../constants/roles");
const { authenticate, deauthenticate } = require("./../security/auth");
const { validateAdminCredentials } = require("./../services/admin");

const router = Router();

router("/sign-in", (req, res) => {
  const data = req.body;
  validateAdminCredentials(data, (error, admin) => {
    if (!error) {
      authenticate(res, ROLES.ADMIN, admin);
    }
    resolve(req, res)(error, admin);
  });
});

router("/sign-out", (req, res) => {
  deauthenticate(res, ROLES.ADMIN);
  resolve(req, res)(null, true);
});

module.exports = router;