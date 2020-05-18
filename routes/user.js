var express = require('express');
var router = express.Router();
const passport = require('passport');
const userCtrl = require('../controllers/user');
/* GET users listing. */
// router.post(
//   '/login',
//   passport.authenticate('login', { session: false }),
//   userCtrl.login
// );

// router.post('/register', userCtrl.register);

router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    //We'll just send back the user details and the token
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
    });
  }
);

module.exports = router;
