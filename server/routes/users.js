const { Router } = require('express');
const resolve = require("./../api/resolve");
const ROLES = require("./../constants/roles");
const { authenticate, deauthenticate, authorize } = require("./../security/auth");
const { validateUserCredentials, createUser, pendingUsers, acceptUser, rejectUser } = require("./../services/user");

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

router.post("/sign-up", (req, res) => {
  const user = req.body;
  createUser(user, resolve(req, res));
});

router.post("/sign-out", (req, res) => {
  deauthenticate(res, ROLES.USER);
  resolve(req, res)(null, true);
});

router.get("/pending", authorize(ROLES.ADMIN), (req, res) => {
  pendingUsers(resolve(req, res));
});

router.post("/accept/:id", authorize(ROLES.ADMIN), (req, res) => {
  const { id } = req.params;
  acceptUser(id, resolve(req, res));
});

router.post("/reject/:id", authorize(ROLES.ADMIN), (req, res) => {
  const { id } = req.params;
  rejectUser(id, resolve(req, res));
});

module.exports = router;