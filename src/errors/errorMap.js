const ERROR_CODES = require("./errorCodes");

const ERROR_MAP = {
    [ERROR_CODES.MISSING_REQUIRED_PARAM]: {
        status: 400,
        message: "Missing required parameter",
    },
    [ERROR_CODES.INTERNAL_ERROR]: {
        status: 500,
        message: "Internal Server Error",
    },
};

module.exports = ERROR_MAP;