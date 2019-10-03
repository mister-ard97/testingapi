const express = require('express');
const { cartController } = require('../controllers');
const { auth } = require('../helpers/auth');

const router = express.Router();

router.get('/showCart', auth, cartController.showCart);
router.post('/addedToCart', auth, cartController.addToCart);
router.post('/deleteCart/:id', auth, cartController.deleteCart);

module.exports = router;