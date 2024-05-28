const ORDER_STATUS = {
    WAITING: 0,
    PAID: 1,
    CANCELLED: 2,
}

const RESPONSE_STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    INTERNAL_SERVER_ERROR: 500,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    CONFLICT: 409,
}

module.exports = { ORDER_STATUS, RESPONSE_STATUS_CODE }