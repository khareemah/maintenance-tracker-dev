const sendEMail = require('./sendEmail');

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyURL = `${origin}/user/verify-email/token=${verificationToken}&email=${email}`;

  const message = `
                  <p>click the link below to verify your email:
                  <a href='${verifyURL}'>Verify Email</a></p>
 `;
  return sendEMail({
    to: email,
    subject: 'Email Confirmation',
    html: `<h4>Hello ${name}, ${message}</h4>`,
  });
};

module.exports = sendVerificationEmail;
