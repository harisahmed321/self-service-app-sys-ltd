var express = require('express');
var router = express.Router();
const passport = require('passport');
const userCtrl = require('../controllers/user');

router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  userCtrl.profile
);

router.get(
  '/team-profile',
  passport.authenticate('jwt', { session: false }),
  userCtrl.teamProfileByManager
);

module.exports = router;
