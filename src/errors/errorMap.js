const ERROR_CODES = require("./errorCodes");

const ERROR_MAP = {
    [ERROR_CODES.INTERNAL_ERROR]: {
        status: 500,
        message: "Internal Server Error",
    },
    [ERROR_CODES.UNAUTHORIZED]: {
        status: 401,
        message: "Unauthorized",
    },
    [ERROR_CODES.MISSING_REQUIRED_PARAM]: {
        status: 400,
        message: "Missing required parameter",
    },
    [ERROR_CODES.USER_NOT_FOUND]: {
        status: 400,
        message: "User is not found",
    },
};

module.exports = ERROR_MAP;