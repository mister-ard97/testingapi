const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');

const port = 2002;

const app_api = express();

app_api.use(cors());
app_api.use(bearerToken());
app_api.use(bodyParser.json());
app_api.use(bodyParser.urlencoded({extended: false}));
app_api.use(express.static('public'));

app_api.get('/', (req, res) => {
    res.status(200).send(
        `<h3>Welcome to MaCommerce API</h3>`
    )
})

const {
    usersRouter,
    adminRouter,
    productRouter,
    cartRouter,
    transactionRouter
} = require('./routers');

app_api.use('/user', usersRouter);
app_api.use('/productMaCommerce', productRouter);
app_api.use('/admin', adminRouter);
app_api.use('/cart', cartRouter);
app_api.use('/transaction', transactionRouter);

app_api.listen(port, () => console.log(`Server API Aktif di port ${port}`));