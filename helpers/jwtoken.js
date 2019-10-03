const jwt = require('jsonwebtoken');

module.exports = {
    createJWTToken(payload) {
        return jwt.sign(payload, "MaCommerceJWToken", { expiresIn: '12h' })
    }
}