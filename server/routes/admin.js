const { Router } = require('express');
const resolve = require("./../api/resolve");
const ROLES = require("./../constants/roles");
const { authenticate, deauthenticate } = require("./../security/auth");
const { validateAdminCredentials } = require("./../services/admin");

const router = Router();

router.post("/sign-in", (req, res) => {
  const data = req.body;
  validateAdminCredentials(data, (error, admin) => {
    let session = null;
    if (!error) {
      session = {
        _id: admin._id,
        email: admin.email,
        name: admin.name
      };
      authenticate(res, ROLES.ADMIN, session);
    }
    resolve(req, res)(error, session);
  });
});

router.post("/sign-out", (req, res) => {
  deauthenticate(res, ROLES.ADMIN);
  resolve(req, res)(null, true);
});

module.exports = router;