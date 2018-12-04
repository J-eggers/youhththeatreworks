const nodemailer = require('nodemailer');

//mailer for the website
module.exports = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'youththeatreworkscumc@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
});
