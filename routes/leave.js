var express = require('express');
var router = express.Router();
const passport = require('passport');
const leaveCtrl = require('../controllers/leave');

router.post(
  '/', 
  passport.authenticate('jwt', { session: false }), 
  leaveCtrl.addRequest
);

router.get(
  '/byEmployee', 
  passport.authenticate('jwt', { session: false }), 
  leaveCtrl.leavesByEmployee
);

router.get(
  '/byManager', 
  passport.authenticate('jwt', { session: false }), 
  leaveCtrl.leavesByTeam
);

router.get(
  '/getLeavesQuota', 
  passport.authenticate('jwt', { session: false }), 
  leaveCtrl.getLeavesQuota
);

module.exports = router;
