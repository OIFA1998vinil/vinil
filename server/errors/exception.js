function exception(error, code = 500) {
  return {
    error,
    message: typeof error === "string" ? error : error.message,
    code
  }
}

module.exports = exception;