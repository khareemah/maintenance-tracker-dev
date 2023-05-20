const Token = require('../models/Token');
const { isTokenValid, attachCookiesToResponse } = require('../utils');
const CustomError = require('../errors');

const authenticateUser = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.signedCookies;

    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload;
      return next();
    }
    const payload = isTokenValid(refreshToken);

    const existingToken = await Token.findOne({
      refreshToken: payload.refreshToken,
      user: payload.user.userId,
    });
    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError('Invalid credentials');
    }
    attachCookiesToResponse({
      req,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    next();
  } catch (error) {
    console.log(error);
  }
};

const authorizeAdminPermissions = (req, res, next) => {
  if (req.user.role !== 'admin') {
    throw new CustomError.UnauthenticatedError(
      `Not allowed to access this route`
    );
  }
  next();
};
module.exports = { authenticateUser, authorizeAdminPermissions };
