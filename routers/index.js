const usersRouter = require('./usersRouter');
const adminRouter = require('./adminRouter');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');
const transactionRouter = require('./transactionRouter')
const campaignRouter=require('./Campaignrouter')
module.exports = {
    usersRouter,
    adminRouter,
    productRouter,
    cartRouter,
    transactionRouter,
    campaignRouter
}