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
  const managerId = process.env.userId;

  if (!req.body.date || req.body.date == '' || req.body.date == null) {
    res.status(400).send(failure('Date is required'));
  } else {
    TeamManagementModel.find({ managerId })
    .then((result) => {
      let empIds = [];
      result.forEach(element => {
        empIds.push(mongoose.Types.ObjectId(element.empId));
      });
      fetchAttendance(empIds);
    })
    .catch((error) => next(error));
  }

  const fetchAttendance = (ids) => {
    AttendanceModel.aggregate(
      [
        {
          $match : {
            userId: { $in : ids },
            date : new Date(req.body.date)
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
  }
  
}


module.exports = { addAttendance, attendanceByEmployee, attendanceByTeam };
