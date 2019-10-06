const jwt = require('jsonwebtoken');

module.exports = {
    createJWTToken(payload) {
        return jwt.sign(payload, "MaCommerceJWToken", { expiresIn: '12h' })
    },

    createForgotPasswordToken(payload) {
        return jwt.sign(payload, "ForgotPasswordToken", { expiresIn: '2m' })
    }
}