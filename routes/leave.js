var express = require('express');
var router = express.Router();
const passport = require('passport');
const leaveCtrl = require('../controllers/leave');

router.post(
  '/addRequest', 
  passport.authenticate('jwt', { session: false }), 
  leaveCtrl.addRequest
);

router.get(
  '/leavesByEmployee', 
  passport.authenticate('jwt', { session: false }), 
  leaveCtrl.leavesByEmployee
);

module.exports = router;
