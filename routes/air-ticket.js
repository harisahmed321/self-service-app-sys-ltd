var express = require('express');
var router = express.Router();
const passport = require('passport');
const airTicketCtrl = require('../controllers/air-ticket');

router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  airTicketCtrl.getAll
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  airTicketCtrl.create
);

router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  airTicketCtrl.remove
);

// router.post('/register', authCtrl.userRegistration);

module.exports = router;
