/**
 * Mail service
 * @module server/services/mail
 */

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require("handlebars");
const MAIL = 'viniloifa@gmail.com';
const PASS = '#vinil-oifa2020>sudo su';

var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: MAIL, pass: PASS } });

/**
 * @callback templateResultCallback
 * @param {Error} error Any error occurred during execution
 * @param {String} template HTML generated from template
 */

/**
 * Builds a Handlebars template by its name using some data as context
 * @param {String} templateName template file name (from "./templates" folder)
 * @param {Object} context Context object
 * @param {templateResultCallback} callback Callback
 */
function createTemplate(templateName, context, callback) {
  fs.readFile(path.join(__dirname + '/templates/' + templateName + '.hbs'), 'utf8', (err, templateData) => {
    if (err) {
      callback(err);
    } else {
      const template = hbs.compile(templateData);
      const html = template(context);
      callback(null, html);
    }
  });
}

/**
 * @callback onlyErrorCallback
 * @param {Error} error Any error occurred during execution
 */

/**
 * 
 * @param {Object} mailOptions
 * @param {String} mailOptions.to Destinatary email address
 * @param {String} mailOptions.subject Email subject
 * @param {String} mailOptions.template Email template name
 * @param {Object} mailOptions.context Context object to build template
 * @param {onlyErrorCallback} callback Callback
 */
function sendMail({ to, subject, template, context }, callback = () => { }) {
  createTemplate(template, context, (err, content) => {
    if (err) {
      callback(err);
    } else {
      transporter.sendMail({ from: MAIL, to, subject, html: content }, error => {
        if (error) {
          callback(error);
        } else {
          callback();
        }
      });
    }
  });
}

module.exports = {
  sendMail
};