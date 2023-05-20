const express = require('express');
const router = express.Router();

const {
  createRequest,
  getAllUsersRequest,
  getSingleRequest,
  modifyRequest,
} = require('../controllers/userRequestController');

const { authenticateUser } = require('../middleware/authentication');

router
  .route('/')
  .post(authenticateUser, createRequest)
  .get(authenticateUser, getAllUsersRequest);

router
  .route('/:requestId')
  .get(authenticateUser, getSingleRequest)
  .put(authenticateUser, modifyRequest);

module.exports = router;
