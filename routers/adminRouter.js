const express = require('express');
const { adminController } = require('../controllers');
const { auth } = require('../helpers/auth');

const router = express.Router();

router.post('/adminRegister', adminController.adminRegister);
router.post('/adminResendEmailVerification', adminController.resendAdminEmailVerification);
router.post('/adminLogin', adminController.adminLogin);
router.put('/adminEmailVerification', auth, adminController.emailAdminVerification);

// categories
router.get('/getCategory', adminController.getCategory);
router.post('/addCategory', auth, adminController.addCategory);
router.post('/addSubCategory', auth,  adminController.addSubCategory);

router.put('/editCategory/:id', auth, adminController.editCategory);
router.put('/editSubCategory/:id', auth, adminController.editSubCategory);

router.delete('/deleteCategory/:categoryName', auth, adminController.deleteCategory);
router.delete('/deleteSubCategory/:subCategory', auth, adminController.deleteSubCategory);

router.post('/addProduct', auth, adminController.addProduct);
router.put('/editProduct/:id', auth, adminController.editProduct);

router.put('/deleteProduct/:id', auth, adminController.deteleProduct);

module.exports = router;