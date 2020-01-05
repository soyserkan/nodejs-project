const nodemailer = require('nodemailer');
const config = require('./config');

const transport = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: config.mailer.auth.user,
    pass: config.mailer.auth.password
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = {
  sendMail(from, to, subject, html) {
    return new Promise((resolve, reject) => {
      transport.sendMail({ from, subject, to, html }, (err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });
  }
};