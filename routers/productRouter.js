const express = require('express');
const { productController } = require('../controllers');
const router = express.Router();

router.get('/allProductUI', productController.getAllProductUI);
router.get('/allProduct', productController.getAllProducts);
router.get('/searchFilteredProduct', productController.getFilterProduct);
router.get('/productDetail/:id', productController.getProductDetailById);
router.get('/commentProduct/:id', productController.getCommentProduct);

module.exports = router