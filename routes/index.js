const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('router loaded');


router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/reset-password',require('./reset_password'));
router.use('/likes', require('./likes'));
router.use('/verify-email',require('./verify_email'));
// for any further routes, access from here
// router.use('/routerName', require('./routerfile));

router.use('/api',require('./api'));
 

module.exports = router;