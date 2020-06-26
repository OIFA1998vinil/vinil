const { Router } = require('express');
const resolve = require("./../api/resolve");
const ROLES = require("./../constants/roles");
const { authenticate, deauthenticate, authorize } = require("./../security/auth");
const { validateUserCredentials, createUser, pendingUsers, acceptUser, rejectUser, activeUsers } = require("./../services/user");

const router = Router();

router.post("/sign-in", (req, res) => {
  const credentials = req.body;
  validateUserCredentials(credentials, (error, user) => {
    let session = null;
    if (!error) {
      session = {
        _id: user._id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        gender: user.gender,
        bornDate: user.bornDate,
      };
      authenticate(res, ROLES.USER, session);
    }
    resolve(req, res)(error, session);
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

router.get("/active", authorize(ROLES.ADMIN), (req, res) => {
  activeUsers(resolve(req, res));
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