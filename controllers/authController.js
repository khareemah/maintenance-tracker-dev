const User = require('../models/User');
const CustomError = require('../errors');
const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
  createTokenUser,
  createHash,
  attachCookiesToResponse,
} = require('../utils/');
const Token = require('../models/Token');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const alreadyExist = await User.findOne({ email });
  if (alreadyExist) {
    throw new CustomError.BadRequestError('Email already exist');
  }
  const verificationToken = crypto.randomBytes(40).toString('hex');
  const user = await User.create({
    name,
    email,
    password,
    verificationToken,
  });

  const origin = 'http://localhost:3000';
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });
  res.status(StatusCodes.CREATED).json({
    msg: 'Success!!!! please check your email to verify your account',
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Verification Error');
  }
  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError('Verification Error');
  }
  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = '';

  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Email Verified' });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }

  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError('Please verify your email');
  }

  const tokenUser = createTokenUser(user);
  console.log(tokenUser);
  let refreshToken = '';

  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError('Invalid credentials');
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }
  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };
  await Token.create(userToken);
  attachCookiesToResponse({ res, tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  const token = await Token.findOneAndDelete({ user: req.user.userId });

  res.cookie('accessToken', logout, {
    httpOnly: true,
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.cookie('refreshToken', logout, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: 'user logged out' });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomError.BadRequestError('Please provide a valid email');
  }

  const user = await User.findOne({ email });

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString('hex');
    const origin = 'https://localhost:3000';
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    const tenMinutes = 60 * 1000 * 10;
    const passwordTokenExpiryDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpiryDate = passwordTokenExpiryDate;

    await user.save();
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Please check your email for reset password link' });
};

const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;

  if (!email || !password || !token) {
    throw new CustomError.BadRequestError('please provide all values');
  }
  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === createHash(token) ||
      user.passwordTokenExpiryDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpiryDate = null;
      await user.save();
    }
  }
  res.status(StatusCodes.OK).json({ msg: 'password reset successfully' });
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
