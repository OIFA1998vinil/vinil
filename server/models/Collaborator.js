/**
 * Collaborator model
 * @module server/models/Collaborator
 */
const mongoose = require('mongoose');

/**
 * Collaborator instance
 * @typedef {Object} CollaboratorType
 * @property {String} email Email
 * @property {Number} password Password
 * @property {String} name Name
 * @property {String} lastName Last name
 * @property {String} status Status (active|inactive)
 */

/**
 * @class
 * @extends {mongoose.Model}
 * @param {Object} props Model initial properties
 * @param {String} props.email Email
 * @param {Number} props.password Password
 * @param {String} props.name Name
 * @param {String} props.lastName Last name
 * @param {String} props.status Status (active|inactive)
 */
const Collaborator = mongoose.model('Collaborator', {
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  status: { type: String, required: true },
});

module.exports = Collaborator;