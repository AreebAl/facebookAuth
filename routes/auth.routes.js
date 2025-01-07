// const express = require('express');
// const AuthController = require('../controllers/auth.controller');
// const router = express.Router();

// // Facebook login route
// router.get('/facebook/login', AuthController.showFacebookLoginPage);

// // Facebook callback route to handle the redirection after successful login
// router.get('/facebook/callback', AuthController.facebookCallback);

// module.exports = router;


const express = require('express');
const {
  loginWithFacebook,
  facebookCallback,
  dashboard,
  logout,
} = require('../controllers/auth.controller');
const ensureAuth = require('../middlewares/ensureAuth');

const router = express.Router();

// Facebook Login
router.get('/facebook', loginWithFacebook);

// Facebook Callback
router.get('/facebook/callback', facebookCallback);

// Dashboard (Protected Route)
router.get('/dashboard', ensureAuth, dashboard);

// Logout
router.get('/logout', logout);

module.exports = router;

