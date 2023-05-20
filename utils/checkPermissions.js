const CustomError = require('../errors');
const checkPermissions = (requestUser, resourceId) => {
  if (requestUser.userId === resourceId.toString()) {
    return;
  }
  throw new CustomError.UnauthorizedError('Unauthorized to access this route');
};

module.exports = checkPermissions;
