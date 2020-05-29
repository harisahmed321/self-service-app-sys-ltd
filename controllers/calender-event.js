const CalenderEventModel = require('../models/calender-event');
const moment = require('moment');

create = (req, res, next) => {
  req.body.userId = process.env.userId;
  const calenderEvent = new CalenderEventModel(req.body);
  calenderEvent
    .save()
    .then(() => {
      res.status(200).send({ message: 'Calender event created' });
    })
    .catch((error) => {
      next(error);
    });
};

getByDate = async (req, res, next) => {
  // console.log(req.params);
  const { dateTime } = req.params;
  const startDateTime = moment(
    `${dateTime} 00:00`,
    'YYYY-MM-DD hh:mm'
  ).format();
  const endDateTime = moment(`${dateTime} 23:59`, 'YYYY-MM-DD hh:mm').format();

  const startMonth = new moment(dateTime).startOf('month').format();
  const endMonth = new moment(dateTime).endOf('month').format();
  // console.log('currentMonth', startDateTime, endDateTime);

  const userId = process.env.userId;
  let calenderEventResult = {};
  await CalenderEventModel.find({
    $and: [
      { userId },
      {
        dateTime: {
          $gte: new Date(startDateTime),
          $lte: new Date(endDateTime),
        },
      },
    ],
  })
    .then((result) => (calenderEventResult.currentDateEvents = result))
    .catch((error) => next(error));

  await CalenderEventModel.find({
    $and: [
      { userId },
      {
        dateTime: {
          $gte: new Date(startMonth),
          $lte: new Date(endMonth),
        },
      },
    ],
  })
    .then((result) => (calenderEventResult.currentMonthEvents = result))
    .catch((error) => next(error));

  res.status(200).send({ result: calenderEventResult });
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

module.exports = { create, remove, getByDate };
