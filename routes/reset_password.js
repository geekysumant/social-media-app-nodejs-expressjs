const express = require('express');
const router = express.Router();
const resetPasswordController=require('../controllers/reset_password_controller');


router.get('/',resetPasswordController.resetPasswordPage);
router.post('/',resetPasswordController.resetPasswordMail);
router.get('/:id',resetPasswordController.resetPassword);
router.post('/new-password',resetPasswordController.newPasswordForm);


module.exports=router;