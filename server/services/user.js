/**
 * Songs Service
 * @module server/services/user
 */

const exception = require("./../errors/exception");
const User = require("./../models/User");
const { sendMail } = require("./mail");

/**
 * @callback userResultCallback
 * @param {Error} error Any error occurred during execution
 * @param {Object} user User object
 */

/**
 * Inserts an user in database
 * @param {Object} data User data
 * @param {userResultCallback} callback
 */
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

/**
 * Validates user credentials
 * @param {Object} data Credentials data
 * @param {String} data.email Credentials email
 * @param {String} data.password Credentials password
 * @param {userResultCallback} callback Callback
 */
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

/**
 * @callback usersResultCallback
 * @param {Error} error Any error occurred during execution
 * @param {Object[]} user Users list
 */

/**
 * Retrieves all user with status pending from database
 * @param {usersResultCallback} callback Callback
 */
function pendingUsers(callback) {
  User.find({ status: "pending" }, '-password', (err, requests) => {
    if (err) {
      callback(exception(err));
    } else {
      callback(null, requests);
    }
  })
}

/**
 * Retrieves all user with status active from database
 * @param {usersResultCallback} callback Callback
 */
function activeUsers(callback) {
  User.find({ status: "approved" }, '-password', (err, requests) => {
    if (err) {
      callback(exception(err));
    } else {
      callback(null, requests);
    }
  })
}

/**
 * @callback onlyErrorCallback
 * @param {Error} error Any error occurred during execution
 */

/**
 * Changes the status of an user to approved
 * @param {String} id User id
 * @param {onlyErrorCallback} callback Callback
 */
function acceptUser(id, callback) {
  User.updateOne({ _id: id }, { status: "approved" }, (err) => {
    if (err) {
      callback(exception(err));
    } else {
      callback();
      User.findById(id, (err, user) => {
        if (!err) {
          sendMail({
            to: user.email,
            subject: "Su solicitud de registro ha sido aprovada",
            template: "user-request-accepted",
            context: { name: user.name, lastName: user.lastName, email: user.email }
          });
        }
      });
    }
  });
}

/**
 * Removes an user
 * @param {String} id User id
 * @param {onlyErrorCallback} callback Callback
 */
function rejectUser(id, callback) {
  User.deleteOne({ _id: id }, (err) => {
    if (err) {
      callback(exception(err));
    } else {
      callback();
    }
  });
}

module.exports = {
  validateUserCredentials,
  createUser,
  acceptUser,
  rejectUser,
  pendingUsers,
  activeUsers
};