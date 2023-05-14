const User = require('../models/User');
const CustomError = require('../errors');
const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');
const sendVerificationEmail = require('../utils/sendVerificationEmail');

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

  const origin = 'http:localhost://3000';
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

module.exports = { register };
