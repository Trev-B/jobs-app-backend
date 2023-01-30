const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const { sendEmail } = require('../utils/emails.js');
const ResetToken = require('../models/ResetToken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide a email or password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError('Please provide a email');
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(StatusCodes.OK).json({ sent: true });
  }

  const token = await ResetToken.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  const resetToken = crypto.randomBytes(32).toString('hex');
  const salt = await bcrypt.genSalt(10);
  const hashedToken = await bcrypt.hash(resetToken, salt);

  await ResetToken.create({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
  });

  const url = process.env.IS_DEV
    ? 'http://localhost:3000'
    : 'https://www.job-tracer.com';

  const link = `${url}/change-password?id=${user._id}&token=${resetToken}`;

  sendEmail(
    email,
    'Password Reset Request',
    '../utils/templates/resetPasswordRequest.template.js',
    { link, name: user.name }
  );

  res.status(StatusCodes.OK).json({ sent: true });
};

const resetPassword = async (req, res) => {
  const { id, token, password } = req.body;
  if (!id || !token || !password) {
    throw new BadRequestError(`Id, token, and password fields cannot be empty`);
  }

  let resetToken = await ResetToken.findOne({ userId: id });
  if (!resetToken) {
    throw new UnauthenticatedError('Invalid or expired password reset token');
  }

  const isValid = await bcrypt.compare(token, resetToken.token);
  if (!isValid) {
    throw new UnauthenticatedError('Invalid password reset token');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  await User.updateOne({ _id: id }, { password: hash });

  const user = await User.findById({ _id: id });

  sendEmail(
    user.email,
    'Password Reset Successfully',
    '../utils/templates/resetPasswordConfirmation.template.js',
    {
      name: user.name,
    }
  );

  await resetToken.deleteOne();

  res.status(StatusCodes.OK).json({ sent: true });
};

module.exports = {
  register,
  login,
  requestPasswordReset,
  resetPassword,
};
