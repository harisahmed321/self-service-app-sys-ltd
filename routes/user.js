var express = require('express');
var router = express.Router();
const passport = require('passport');
const userCtrl = require('../controllers/user');

// passport.authenticate('jwt', { session: false }),
router.get('/profile', userCtrl.profile);

module.exports = router;
