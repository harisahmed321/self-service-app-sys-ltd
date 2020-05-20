const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

profile = (req, res, next) => {
  //We'll just send back the user details and the token
  res.json({
    message: 'You made it to the secure route',
  });
};

module.exports = { profile };
