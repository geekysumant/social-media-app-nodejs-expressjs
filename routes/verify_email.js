const express = require('express');
const router = express.Router();
const verifyEmailController=require('../controllers/verify_email_controller');


router.get('/:id',verifyEmailController.verifyEmail);
// router.post('/',resetPasswordController.)


module.exports=router;