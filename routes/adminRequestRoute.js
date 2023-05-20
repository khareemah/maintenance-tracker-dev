const express = require('express');
const router = express.Router();

const {
  getAllRequests,
  rejectRequest,
  approveRequest,
  resolveRequest,
} = require('../controllers/adminRequestController');

const {
  authenticateUser,
  authorizeAdminPermissions,
} = require('../middleware/authentication');

router
  .route('/')
  .get(authenticateUser, authorizeAdminPermissions, getAllRequests);
router
  .route('/:requestId/disapprove')
  .put(authenticateUser, authorizeAdminPermissions, rejectRequest);
router
  .route('/:requestId/approve')
  .put(authenticateUser, authorizeAdminPermissions, approveRequest);

router
  .route('/:requestId/resolve')
  .put(authenticateUser, authorizeAdminPermissions, resolveRequest);

module.exports = router;
