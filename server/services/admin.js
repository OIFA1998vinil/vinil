/**
 * Admin Service
 * @module server/services/admin
 */

const exception = require("./../errors/exception");
const Admin = require("./../models/Admin");

/**
 * @callback adminResultCallback
 * @param {Error} error Any error occurred during execution
 * @param {Object} admin Admin object
 */

/**
 * Validates admin credentials
 * @param {Object} data Credentials data
 * @param {String} data.email Credentials email
 * @param {String} data.password Credentials password
 * @param {adminResultCallback} callback Callback
 */
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