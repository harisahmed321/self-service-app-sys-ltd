var express = require('express');
var router = express.Router();
const passport = require('passport');
const clubMembCtrl = require('../controllers/club-membership');

router.post(
  '/', 
  passport.authenticate('jwt', { session: false }), 
  clubMembCtrl.addRequest
);

module.exports = router;
