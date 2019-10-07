const express = require('express');
const { usersController } = require('../controllers');
const { auth, resetToken } = require('../helpers/auth');

const router = express.Router();

router.post('/userRegister', usersController.register);
router.put('/userEmailVerification', auth, usersController.emailVerification);
router.post('/userResendEmailVerification', usersController.resendEmailVerification);
router.post('/userKeepLogin', auth, usersController.keepLoginUser);
router.post('/userLogin', usersController.userLogin);

router.get('/getWishlist', auth, usersController.userGetWishlist);
router.get('/userWishlistProduct/:id', auth, usersController.userWishlistProduct);
router.post('/userToggleWishlist/:id', auth, usersController.userToggleWishlistProduct);
router.post('/userChangeAddress', auth, usersController.userChangeAddress);
router.post('/userComment', auth, usersController.commentOnProduct);
router.post('/userReplyComment', auth, usersController.replyCommentProduct);

router.post('/userLoginWithGoogle', usersController.userLoginWithGoogle)
router.post('/userLoginWithFacebook', usersController.userLoginWithFacebook)
router.post('/userForgotPassword', usersController.userForgotPassword);

router.get('/userGetResetToken', resetToken, usersController.userCheckResetToken);
router.post('/newPasswordUser', resetToken, usersController.userResetPassword)
router.post('/changeUserPassword', auth, usersController.userChangePassword)

module.exports = router;


