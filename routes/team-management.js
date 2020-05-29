var express = require('express');
var router = express.Router();
const passport = require('passport');
const teamManagementCtrl = require('../controllers/team-management');

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  teamManagementCtrl.create
);

module.exports = router;
