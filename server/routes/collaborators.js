/**
 * Registers the request handlers under /api/v1/collaborators/ path
 * @module server/routes/collaborators
 */

const { Router } = require('express');
const resolve = require("./../api/resolve");
const ROLES = require("./../constants/roles");
const { authenticate, deauthenticate, authorize } = require("./../security/auth");
const { validateCollaboratorCredentials, createCollaborator, findAllActiveCollaborators, deactivateCollaborator } = require("./../services/collaborator");

const router = Router();

/**
 * HTTP POST /api/v1/collaborators/sign-in
 */
router.post("/sign-in", (req, res) => {
  const credentials = req.body;
  validateCollaboratorCredentials(credentials, (error, collaborator) => {
    let session = null;
    if (!error) {
      session = {
        _id: collaborator._id,
        email: collaborator.email,
        name: collaborator.name,
        lastName: collaborator.lastName
      };
      authenticate(res, ROLES.COLLABORATOR, session);
    }
    resolve(req, res)(error, session);
  });
});

/**
 * HTTP POST /api/v1/collaborators/sign-out
 */
router.post("/sign-out", (req, res) => {
  deauthenticate(res, ROLES.COLLABORATOR);
  resolve(req, res)(null, true);
});

/**
 * HTTP POST /api/v1/collaborators/insert
 * REQUIRES AUTHORIZATION [ADMIN]
 */
router.post("/insert", authorize(ROLES.ADMIN), (req, res) => {
  const user = req.body;
  createCollaborator(user, resolve(req, res));
});

/**
 * HTTP GET /api/v1/collaborators/active
 * REQUIRES AUTHORIZATION [ADMIN]
 */
router.get("/active", authorize(ROLES.ADMIN), (req, res) => {
  findAllActiveCollaborators(resolve(req, res));
});

/**
 * HTTP PUT /api/v1/collaborators/deactivate/<collaborator_id>
 * REQUIRES AUTHORIZATION [ADMIN]
 */
router.put("/deactivate/:id", authorize(ROLES.ADMIN), (req, res) => {
  const { id } = req.params;
  deactivateCollaborator(id, resolve(req, res));
});

module.exports = router;