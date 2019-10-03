const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rezardiansyah1997@gmail.com',
        pass: 'yzrztjnpnbapuukb'
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter;