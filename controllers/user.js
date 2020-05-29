const mongoose = require('mongoose');
const User = require('../models/user.model');

profile = (req, res, next) => {
  const userId = process.env.userId;

  User.findOne({ _id: mongoose.Types.ObjectId(userId) })
    .then((result) => {
      if (result) {
        result.password = '';
      }
      res.status(200).send(result);
    })
    .catch((error) => next(error));
};

module.exports = { profile };
