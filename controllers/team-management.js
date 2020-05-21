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

getAll = (req, res, next) => {
  console.log(req.params);
  const { managerId } = req.params;
  TeamManagementModel.find({ managerId })
    .then((result) => res.status(200).send({ result: result }))
    .catch((error) => next(error));
};

remove = (req, res, next) => {
  console.log(req.params);
  // const airTicket = new AirTicketModel(req.body);
  // airTicket
  //   .save()
  //   .then(() => {
  //     res.status(200).send({ message: 'Air ticket created' });
  //   })
  //   .catch((error) => {
  //     next(error);
  //   });
};

module.exports = { create, remove, getAll };
