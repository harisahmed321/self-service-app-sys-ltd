var express = require('express');
var router = express.Router();
const passport = require('passport');
const attendanceCtrl = require('../controllers/attendance');

router.post(
  '/', 
  passport.authenticate('jwt', { session: false }), 
  attendanceCtrl.addAttendance
);

router.get(
  '/byEmployee', 
  passport.authenticate('jwt', { session: false }), 
  attendanceCtrl.attendanceByEmployee
);

router.post(
  '/byTeam', 
  passport.authenticate('jwt', { session: false }), 
  attendanceCtrl.attendanceByTeam
);

module.exports = router;
