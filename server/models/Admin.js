/**
 * Admin model
 * @module server/models/Admin
 */
const mongoose = require('mongoose');

/**
 * Admin instance
 * @typedef {Object} AdminType
 * @property {String} email Email
 * @property {String} password Password
 * @property {String} name Name
 */

/**
 * @class
 * @extends {mongoose.Model}
 * @param {Object} props Model initial properties
 * @param {String} props.email Email
 * @param {String} props.password Password
 * @param {String} props.name Name
 */
const Admin = mongoose.model('Admin', {
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

module.exports = Admin;