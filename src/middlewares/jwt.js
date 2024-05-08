const { ErrorResponse, ErrorMessage, ErrorType } = require('../models/response');

class JWTMiddleware {
    constructor(authService) {
        this.authService = authService;
    }
    async authenticate(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                throw new Error(ErrorMessage.ERROR_REQUIRED_ACCESS_TOKEN);
            }
            // TODO need to change secret to env
            const decoded = this.authService.validateUserToken(token);
            req.userId = decoded.sub;
            next();
        } catch (err) {
            const errs = [new ErrorResponse(err.message, ErrorMessage.ERROR_USER_AUTHENTICATION)]
            return res.status(403).send(errs);
        }
    }
}

module.exports = { JWTMiddleware }
