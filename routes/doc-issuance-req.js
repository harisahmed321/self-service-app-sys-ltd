var express = require('express');
var router = express.Router();
const passport = require('passport');
const docIssuanceReqCtrl = require('../controllers/doc-issuance-req');

router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  docIssuanceReqCtrl.getAll
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  docIssuanceReqCtrl.create
);

module.exports = router;
