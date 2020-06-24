const exception = require("./../errors/exception");
const User = require("./../models/User");

function createUser(data, callback) {
  const user = new User({ ...data, status: 'pending' });
  user.save()
    .then((result) => {
      callback(null, result);
    })
    .catch(err => {
      if (err.name === 'MongoError' && err.code === 11000) {
        callback(exception("Ya existe un usuario registrado con ese correo electrónico", 422));
      } else {
        callback(exception(err));
      }
    });
}

function validateUserCredentials(data, callback) {
  const user = new User(data);
  User.findOne({ email: user.email }, (error, result) => {
    if (error) {
      return callback(exception(error));
    }

    if (!result) {
      return callback(exception("No existe un usuario con ese correo electrónico", 401));
    }

    if (result && result.status === "pending") {
      return callback(exception("El usuario no ha sido aprobado", 401));
    }

    if (result && result.password !== user.password) {
      return callback(exception("La contraseña no coincide", 401));
    }

    delete result.password;
    return callback(null, result);
  });
}

module.exports = {
  validateUserCredentials,
  createUser
};