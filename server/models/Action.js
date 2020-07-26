/**
 * Action model
 * @module server/models/Action
 */

const mongoose = require('mongoose');

/**
 * Action instance
 * @typedef {Object} ActionType
 * @property {String} type Action type name
 * @property {Object} payload Action payload (it may be any kind of object)
 * @property {String} collaborator Collaborator id
 */

/**
 * @class
 * @extends {mongoose.Model}
 * @param {Object} props Model initial properties
 * @param {String} props.type Action type name
 * @param {Object} props.payload Action payload (it may be any kind of object)
 * @param {String} props.collaborator Collaborator id
 */
const Action = mongoose.model('Action', {
  type: { type: String, required: true },
  payload: { type: Object, required: true },
  collaborator: {
    type: mongoose.Schema.Types.ObjectId, // Foreign Key
    ref: "Collaborator", // References Collaborator
    required: true // Not null
  }
});

module.exports = Action;