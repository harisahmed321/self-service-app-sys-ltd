var express = require('express');
var router = express.Router();
const passport = require('passport');
const calenderEventCtrl = require('../controllers/calender-event');

router.get(
  '/:dateTime',
  passport.authenticate('jwt', { session: false }),
  calenderEventCtrl.getByDate
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  calenderEventCtrl.create
);

// router.delete(
//   '/',
//   passport.authenticate('jwt', { session: false }),
//   calenderEventCtrl.remove
// );

// router.post('/register', authCtrl.userRegistration);

module.exports = router;
