const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id',passport.checkAuthentication,usersController.update)
router.get('/signup', usersController.signup);
router.get('/signin', usersController.signin);
router.get('/signout',passport.checkAuthentication,usersController.destroySession);

router.post('/create', passport.checkAuthentication,usersController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/signin'},
), usersController.createSession);


router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/signin'}),usersController.createSession);
router.post('/search',passport.checkAuthentication,usersController.search);

module.exports = router;