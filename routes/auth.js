var express = require('express');
var router = express.Router();
const authCtrl = require('../controllers/auth');

router.post('/login', authCtrl.login);

router.post('/register', authCtrl.userRegistration);

module.exports = router;
