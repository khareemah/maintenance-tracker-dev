const Request = require('../models/Request');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

// Approve request
const approveRequest = async (req, res) => {
  const { requestId } = req.params;
  const request = await Request.findOne({ _id: requestId });
  if (!request) {
    throw new CustomError.NotFoundError(`No request with id ${requestId}`);
  }
  request.approvalStatus = 'approved';
  await request.save();
  res.status(StatusCodes.OK).json({ request });
};

// reject request
const rejectRequest = async (req, res) => {
  const { requestId } = req.params;
  const request = await Request.findOne({ _id: requestId });
  if (!request) {
    throw new CustomError.NotFoundError(`No request with id ${requestId}`);
  }
  request.approvalStatus = 'rejected';
  await request.save();
  res.status(StatusCodes.OK).json({ request });
};

// get all requests
const getAllRequests = async (req, res) => {
  const { requestType, approvalStatus, requestStatus, sort } = req.query;

  const queryObject = {};

  if (requestType) {
    queryObject.requestType = requestType;
  }
  if (approvalStatus) {
    queryObject.approvalStatus = approvalStatus;
  }
  if (requestStatus) {
    queryObject.requestStatus = requestStatus;
  }

  let result = Request.find(queryObject);
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  const requests = await result;

  res.status(StatusCodes.OK).json({ count: requests.length, requests });
};

// resolve request
const resolveRequest = async (req, res) => {
  const { requestId } = req.params;
  const request = await Request.findOne({ _id: requestId });
  if (!request) {
    throw new CustomError.NotFoundError(`No request with id ${requestId}`);
  }
  request.requestStatus = 'resolved';
  await request.save();
  res.status(StatusCodes.OK).json({ request });
};
module.exports = {
  approveRequest,
  rejectRequest,
  getAllRequests,
  resolveRequest,
};
