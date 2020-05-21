const mongoose = require('mongoose');
const AttendanceModel = require('../models/attendance.model');
const { success, failure } = require('../helpers/response');

addAttendance = (req, res, next) => {
  req.body.userId = process.env.userId;

  const attendanceModel = new AttendanceModel(req.body);
  attendanceModel
    .save()
    .then((resp) => {
      res.status(200).send(success(resp, "Attendance added successfully"));
    })
    .catch((error) => {
      next(error);
    });
};


attendanceByEmployee = (req, res, next) => {
  const userId = process.env.userId;

  let stDate = new Date();
  stDate.setDate(1);
  let endDate = new Date();
  endDate.setDate(31);

  AttendanceModel.aggregate(
    [
      {
        $match : {
          userId: mongoose.Types.ObjectId(userId),
          date : { $lt : endDate },
          date : { $gt : stDate }
        }
      },
      {
        $project : {
          timeIn: 1,
          timeOut: 1,
          userId: 1,
          date: { $dateToString: { format: "%d-%m-%Y", date: "$date" } }
        }
      }
    ]
  ).then(result => {
    AttendanceModel.populate(
      result, 
      {
        path: "userId",
        select: {
          role: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          designation: 1
        }
      }
    ).then(popl => {
      res.status(200).send(success(popl, 'success'));
    })
  })

};


attendanceByTeam = (req, res, next) => {

  // req.body.date
}


module.exports = { addAttendance, attendanceByEmployee, attendanceByTeam };
