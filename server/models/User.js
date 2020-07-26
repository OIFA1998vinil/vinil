/**
 * User model
 * @module server/models/User
 */
const mongoose = require('mongoose');

/**
 * User instance
 * @typedef {Object} UserType
 * @property {String} email Email
 * @property {String} password Password
 * @property {String} status Status (active|inactive)
 * @property {String} name Name
 * @property {String} lastName Last Name
 * @property {String} gender Gender
 * @property {Date} bornDate Born date
 * @property {String} rol Rol
 */

/**
 * @class
 * @extends {mongoose.Model}
 * @param {Object} props Model initial properties
 * @param {String} props.email Email
 * @param {String} props.password Password
 * @param {String} props.status Status (active|inactive)
 * @param {String} props.name Name
 * @param {String} props.lastName Last Name
 * @param {String} props.gender Gender
 * @param {Date} props.bornDate Born date
 * @param {String} props.rol Rol
 */
const User = mongoose.model('User', {
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  status: { type: String, required: true },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  bornDate: { type: Date, required: true },
  rol: { type: String, required: true },
});

module.exports = User;