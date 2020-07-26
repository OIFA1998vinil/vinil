/**
 * Registers the request handlers
 * @module server/routes
 */
module.exports = {
  "admin": require("./admin"),
  "users": require("./users"),
  "songs": require("./songs"),
  "files": require("./files"),
  "collaborators": require("./collaborators"),
  "actions": require("./actions"),
};