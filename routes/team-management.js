var express = require('express');
var router = express.Router();
const passport = require('passport');
const teamManagementCtrl = require('../controllers/team-management');

router.get(
  '/all/:managerId',
  passport.authenticate('jwt', { session: false }),
  teamManagementCtrl.getAll
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  teamManagementCtrl.create
);

router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  teamManagementCtrl.remove
);

// router.post('/register', authCtrl.userRegistration);

module.exports = router;
