/**
 * Registers the request handlers under /api/v1/users/ path
 * @module server/routes/users
 */

const { Router } = require('express');
const resolve = require("./../api/resolve");
const ROLES = require("./../constants/roles");
const { authenticate, deauthenticate, authorize } = require("./../security/auth");
const { validateUserCredentials, createUser, pendingUsers, acceptUser, rejectUser, activeUsers } = require("./../services/user");

const router = Router();

/**
 * HTTP POST /api/v1/users/sign-in
 */
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

/**
 * HTTP POST /api/v1/users/sign-up
 */
router.post("/sign-up", (req, res) => {
  const user = req.body;
  createUser(user, resolve(req, res));
});

/**
 * HTTP POST /api/v1/users/sign-out
 */
router.post("/sign-out", (req, res) => {
  deauthenticate(res, ROLES.USER);
  resolve(req, res)(null, true);
});

/**
 * HTTP GET /api/v1/users/active
 * REQUIRES AUTHORIZATION [ADMIN]
 */
router.get("/active", authorize(ROLES.ADMIN), (req, res) => {
  activeUsers(resolve(req, res));
});

/**
 * HTTP GET /api/v1/users/pending
 * REQUIRES AUTHORIZATION [ADMIN]
 */
router.get("/pending", authorize(ROLES.ADMIN), (req, res) => {
  pendingUsers(resolve(req, res));
});

/**
 * HTTP POST /api/v1/users/accept/<user_id>
 * REQUIRES AUTHORIZATION [ADMIN]
 */
router.post("/accept/:id", authorize(ROLES.ADMIN), (req, res) => {
  const { id } = req.params;
  acceptUser(id, resolve(req, res));
});

/**
 * HTTP POST/api/v1/users/reject/<user_id>
 * REQUIRES AUTHORIZATION [ADMIN]
 */
router.post("/reject/:id", authorize(ROLES.ADMIN), (req, res) => {
  const { id } = req.params;
  rejectUser(id, resolve(req, res));
});

module.exports = router;