const Request = require('../models/Request');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

// create request
const createRequest = async (req, res) => {
  req.body.user = req.user.userId;
  const request = await Request.create(req.body);
  res.status(StatusCodes.CREATED).json({ request });
};

// fetch all requests that belongs to a logged in user
const getAllUsersRequest = async (req, res) => {
  const requests = await Request.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ count: requests.length, requests });
};

// Fetch a request that belongs to a logged in user
const getSingleRequest = async (req, res) => {
  const { requestId } = req.params;
  const request = await Request.findOne({ _id: requestId });
  if (!request) {
    throw new CustomError.NotFoundError(`No request with id ${requestId}`);
  }
  res.status(StatusCodes.OK).json({ request });
};

// modify request

const modifyRequest = async (req, res) => {
  const { requestType } = req.body;
  const { requestId } = req.params;
  const request = await Request.findOne({ _id: requestId });
  if (!request) {
    throw new CustomError.NotFoundError(`No request with id ${requestId}`);
  }
  if (request.approvalStatus === 'approved') {
    throw new CustomError.UnauthorizedError(
      'This request has already being approved'
    );
  }
  checkPermissions(req.user, request.user);
  request.requestType = requestType;
  await request.save();
  res.status(StatusCodes.OK).json({ request });
};

module.exports = {
  createRequest,
  getAllUsersRequest,
  getSingleRequest,
  modifyRequest,
};
