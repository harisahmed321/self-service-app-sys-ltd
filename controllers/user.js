const mongoose = require('mongoose');
const User = require('../models/user.model');
const TeamManagementModel = require('../models/team-management.model');

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

teamProfileByManager = (req, res, next) => {
  const managerId = process.env.userId;
  TeamManagementModel.findOne({ managerId })
    .populate('empIds', { firstName: 1, lastName: 1 })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => next(error));
};

module.exports = { profile, teamProfileByManager };
