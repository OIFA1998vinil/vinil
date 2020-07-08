const exception = require("./../errors/exception");
const Collaborator = require("./../models/Collaborator");
const { sendMail } = require("./mail");

function createCollaborator(data, callback) {
  const collaborator = new Collaborator({ ...data, status: 'active', password: new Date().getTime().toString(32) });
  collaborator.save()
    .then((result) => {
      callback(null, result);
      sendMail({
        to: collaborator.email,
        subject: "Registro de nuevo usuario colaborador",
        template: "new-collaborator",
        context: { email: collaborator.email, name: collaborator.name, lastName: collaborator.lastName, password: collaborator.password }
      });
    })
    .catch(err => {
      if (err.name === 'MongoError' && err.code === 11000) {
        callback(exception("Ya existe un colaborador registrado con ese correo electrónico", 422));
      } else {
        callback(exception(err));
      }
    });
}

function validateCollaboratorCredentials(data, callback) {
  const collaborator = new Collaborator(data);
  Collaborator.findOne({ email: collaborator.email }, (error, result) => {
    if (error) {
      return callback(exception(error));
    }

    if (!result) {
      return callback(exception("No existe un colaborador con ese correo electrónico", 401));
    }

    if (result && result.status === "inactive") {
      return callback(exception("El colaborador está deshabilitado", 401));
    }

    if (result && result.password !== collaborator.password) {
      return callback(exception("La contraseña no coincide", 401));
    }

    delete result.password;
    return callback(null, result);
  });
}


function findAllActiveCollaborators(callback) {
  Collaborator.find({ status: "active" }, '-password', (err, requests) => {
    if (err) {
      callback(exception(err));
    } else {
      callback(null, requests);
    }
  })
}

function deactivateCollaborator(id, callback) {
  Collaborator.updateOne({ _id: id }, { status: "inactive" }, (err) => {
    if (err) {
      callback(exception(err));
    } else {
      callback(null, true);
    }
  });
}

module.exports = {
  validateCollaboratorCredentials,
  createCollaborator,
  deactivateCollaborator,
  findAllActiveCollaborators
};