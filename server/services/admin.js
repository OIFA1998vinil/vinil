const exception = require("./../errors/exception");
const Admin = require("./../models/Admin");

function validateAdminCredentials(data, callback) {
  const admin = new Admin(data);
  Admin.findOne({ email: admin.email }, (error, result) => {
    if (error) {
      return callback(exception(error));
    }
    if (!result) {
      return callback(exception("No existe un usuario administrador con ese correo electrónico", 401));
    }
    if (result && result.password !== admin.password) {
      return callback(exception("La contraseña no coincide", 401));
    }

    delete result.password;
    return callback(null, result);
  });
}

module.exports = {
  validateAdminCredentials
};