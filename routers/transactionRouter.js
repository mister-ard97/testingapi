const express = require('express');
const { transactionController } = require('../controllers/index');
const { auth } = require('../helpers/auth');

const router = express.Router()

router.get('/getUserTransaction', auth, transactionController.getTransaction);
router.get('/getAllTransaction', auth, transactionController.getAllTransaction);
router.get('/getTransactionDetail/:id', auth, transactionController.getTransactionDetail);
router.get('/getTransactionAdminDetail/:id', auth, transactionController.getTransactionAdminDetail);

router.post('/addTransaction', auth, transactionController.addTransaction);
router.post('/updatePaymentUser/:id', auth, transactionController.uploadPaymentUser);
router.post('/refusePaymentUser/:id', auth, transactionController.refusePaymentSlipFromUser);
router.post('/acceptPaymentUser/:id', auth, transactionController.acceptPaymentSlipFromUser);

router.post('/sendProductToUser/:id', auth, transactionController.sendProductToUser);
router.post('/confirmProductToAdmin/:id', auth, transactionController.confirmProduct);
router.post('/sendNotificationProduct/:id', auth, transactionController.sendNotification);

router.post('/refuseTransactionUser/:id', auth, transactionController.refuseTransaction);
router.post('/acceptTransactionUser/:id', auth, transactionController.acceptTransaction);

// router.post('/simple_checkout_with_midtrans', auth, transactionController.simpleCheckOutMidTrans)



module.exports = router;