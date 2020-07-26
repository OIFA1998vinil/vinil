/**
 * Provides a common error handler for the api
 * @module server/errors/exception
 */

/**
 * Provides a common error handler for the api
 * @param {Error|String} error Error information
 * @param {Number} code HTTP Code for the error
 */
function exception(error, code = 500) {
  return {
    error,
    message: typeof error === "string" ? error : error.message,
    code
  }
}

module.exports = exception;