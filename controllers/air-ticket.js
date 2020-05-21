const AirTicketModel = require('../models/air-ticket.model');
const attachmentCtrl = require('../controllers/attachment');
create = (req, res, next) => {
  req.body.userId = process.env.userId;

  const airTicket = new AirTicketModel(req.body);
  airTicket
    .save()
    .then((result) => {
      const data = {
        userId: req.body.userId,
        requestId: result._id,
        fileName: req.body.attachment.fileName,
        fileType: req.body.attachment.fileType,
        baseString: req.body.attachment.baseString,
        requestType: 'AIR_TICKET_REQUEST'
      };
      attachmentCtrl.create(data);
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
