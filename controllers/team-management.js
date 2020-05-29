const TeamManagementModel = require('../models/team-management.model');

create = (req, res, next) => {
  req.body.userId = process.env.userId;

  const teamManagement = new TeamManagementModel(req.body);
  teamManagement
    .save()
    .then(() => {
      res.status(200).send({ message: 'User added successfully' });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { create, remove, getAll };
