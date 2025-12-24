const ERROR_MAP = require("../errors/errorMap");
const ERROR_CODES = require("../errors/errorCodes");

class ApiError extends Error {
    constructor(code, detail) {
        const errorInfo = ERROR_MAP[code] || {
            status: ERROR_MAP[ERROR_CODES.INTERNAL_ERROR].status,
            message: ERROR_MAP[ERROR_CODES.INTERNAL_ERROR].message,
        };

        super(errorInfo.message);

        this.success = false;
        this.code = code || ERROR_CODES.INTERNAL_ERROR;
        this.statusCode = errorInfo.status;
        this.detail = detail 
    }
}

module.exports = ApiError;