require('dotenv').config();
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const sendEmail = async ({ to, subject, html }) => {
  const mailgun = new Mailgun(formData);
  const client = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere',
  });
  const messageData = {
    from: 'Kareemah <ajimobikareemah@gmail.com>',
    to,
    subject,
    html,
  };
  const response = await client.messages.create(
    process.env.MAIILGUN_API_DOMAIN,
    messageData
  );
  return response;
};

module.exports = sendEmail;
