const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require("handlebars");
const MAIL = 'viniloifa@gmail.com';
const PASS = '#vinil-oifa2020>sudo su';

var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: MAIL, pass: PASS } });

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