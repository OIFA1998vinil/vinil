const { Router } = require('express');
const resolve = require("./../api/resolve");
const ROLES = require("./../constants/roles");
const { authenticate, deauthenticate, authorize } = require("./../security/auth");
const { validateCollaboratorCredentials, createCollaborator, findAllActiveCollaborators, deactivateCollaborator } = require("./../services/collaborator");

const router = Router();

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

router.post("/sign-out", (req, res) => {
  deauthenticate(res, ROLES.COLLABORATOR);
  resolve(req, res)(null, true);
});

router.post("/create", authorize(ROLES.ADMIN), (req, res) => {
  const user = req.body;
  createCollaborator(user, resolve(req, res));
});

router.get("/active", authorize(ROLES.ADMIN), (req, res) => {
  findAllActiveCollaborators(resolve(req, res));
});

router.put("/deactivate/:id", authorize(ROLES.ADMIN), (req, res) => {
  const { id } = req.params;
  deactivateCollaborator(id, resolve(req, res));
});

module.exports = router;