const { ErrorMessage } = require('../models/response')
const { sequelize } = require("../models/db");
const process = require('process');
const { hashPassword, comparePassword } = require('../util/crypto')
const jwt = require('jsonwebtoken')
const Token = require('../models/token')
const { RESPONSE_STATUS_CODE } = require('../util/constants')
class AuthService {
    constructor(userRepo) {
        this.userRepo = userRepo
    }
    async userRegister(user) {
        try {
            const newUser = await sequelize.transaction(async (t) => {
                const emailExist = await this.userRepo.getUserByEmail(user.email, t)
                const usernameExist = await this.userRepo.getUserByUsername(user.username, t)
                if (emailExist) {
                    const error = new Error(ErrorMessage.ERROR_USER_EMAIL_USED)
                    error.status = RESPONSE_STATUS_CODE.CONFLICT
                    throw error
                }
                if (usernameExist) {
                    const error = new Error(ErrorMessage.ERROR_USER_USERNAME_USED)
                    error.status = RESPONSE_STATUS_CODE.CONFLICT
                    throw error
                }
                const hashedPassword = await hashPassword(user.password)
                user.password = hashedPassword
                await this.userRepo.createUser(user, t)
                return {
                    username: user.username,
                    email: user.email
                }
            })
            return newUser
        } catch (err) {
            throw err;
        }
    }
    async userLogin(user) {
        try {
            // get user by email
            const userData = await this.userRepo.getUserByEmail(user.email)
            if (!userData) {
                const error = new Error(ErrorMessage.ERROR_USER_NOT_FOUND)
                error.status = RESPONSE_STATUS_CODE.NOT_FOUND
                throw error
            }
            // compare password
            const hashedPassword = userData.password
            const plainPassword = user.password
            const isMatch = await comparePassword(plainPassword, hashedPassword)
            if (!isMatch) {
                const error = new Error(ErrorMessage.ERROR_INVALID_PASSWORD)
                error.status = RESPONSE_STATUS_CODE.UNAUTHORIZED
                throw error
            }
            // generate token
            const tokens = await this.createUserToken(userData)
            return tokens
        } catch (err) {
            throw err;
        }
    }
    async createUserToken(userData) {
        try {
            // membuat claim
            // sub, iat
            const now = new Date()
            const claims = {
                sub: userData.id,
                iat: now.getTime()
            }
            // membuat jwt accessToken
            const accessToken = jwt.sign(claims, process.env.JWT_SECRET)
            // generate token model
            const tokens = new Token(accessToken)
            return tokens
        } catch (err) {
            throw err;
        }
    }
    async validateUserToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { sub } = decoded;
            const user = await this.userRepo.getUserById(sub)
            if(!user) {
                const error = new Error(ErrorMessage.ERROR_INVALID_ACCESS_TOKEN);
                error.status = RESPONSE_STATUS_CODE.UNAUTHORIZED;
                throw error;
            }
            return decoded
        } catch (err) {
            throw err;
        }
    }
}

module.exports = { AuthService }