var express = require('express');
var router = express.Router();
const passport = require('passport');
const workQueueCtrl = require('../controllers/work-queue');

router.post(
  '/byEmployee',
  passport.authenticate('jwt', { session: false }),
  workQueueCtrl.getByEmployee
);


module.exports = router;
