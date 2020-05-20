const AirTicketModel = require('../models/air-ticket.model');
const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

create = (req, res, next) => {
  req.body.userId = process.env.userId;
  const airTicket = new AirTicketModel(req.body);
  airTicket
    .save()
    .then(() => {
      res.status(200).send({ message: 'Air ticket created' });
    })
    .catch((error) => {
      next(error);
    });
};

getAll = (req, res, next) => {
  const userId = process.env.userId;
  AirTicketModel.find({ userId: userId })
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
