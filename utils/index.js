const sendEMail = require('./sendEmail');
const sendVerificationEmail = require('./sendVerificationEmail');
const sendResetPasswordEmail = require('./sendResetPasswordEmail');
const createTokenUser = require('./createTokenUser');
const checkPermissions = require('./checkPermissions');
const { attachCookiesToResponse, isTokenValid } = require('./jwt');
const createHash = require('./createHash');

module.exports = {
  sendEMail,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createTokenUser,
  checkPermissions,
  attachCookiesToResponse,
  isTokenValid,
  createHash,
};
