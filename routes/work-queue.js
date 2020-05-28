var express = require('express');
var router = express.Router();
const passport = require('passport');
const workQueueCtrl = require('../controllers/work-queue');

router.post(
  '/byEmployee',
  passport.authenticate('jwt', { session: false }),
  workQueueCtrl.getByEmployee
);

router.post(
  '/byManager',
  passport.authenticate('jwt', { session: false }),
  workQueueCtrl.getByManager
);

module.exports = router;
