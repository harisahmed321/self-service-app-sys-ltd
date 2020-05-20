const mongoose = require('mongoose')
  jwt = require('jsonwebtoken')
  LeaveModel = require('../models/leave.model')
  UserModel = require('../models/user.model')
  QuotaModel = require('../models/quota.model');
const { success, failure } = require('../helpers/response');


addRequest = (req, res, next) => {

  req.body.user = process.env.userId;

  if (req.body.leaveType == 'Annual') {
    req.body.requestType = 'ANNUAL_LEAVE_REQUEST';
  } else if (req.body.leaveType == 'Casual') {
    req.body.requestType = 'CASUAL_LEAVE_REQUEST';
  } else if (req.body.leaveType == 'Sick') {
    req.body.requestType = 'SICK_LEAVE_REQUEST';
  }

  delete[req.body.attachment]; // temporarily for attachments

  const leave = new LeaveModel(req.body);

  leave
    .save()
    .then((resp) => {
      updateLeaveQuota(resp);
    })
    .catch((error) => {
      next(error);
    });

  const updateLeaveQuota = (leave) => {
    QuotaModel
    .findOne({ userId: mongoose.Types.ObjectId(userId) })
    .then(quota => {

      QuotaModel.findOneAndUpdate(
        { userId: mongoose.Types.ObjectId(userId) },
        {
          $set: {
            annualLeaves: req.body.leaveType == 'Annual' ? req.body.remainingBalance : quota.annualLeaves,
            casualLeaves: req.body.leaveType == 'Casual' ? req.body.remainingBalance : quota.casualLeaves,
            sickLeaves: req.body.leaveType == 'Sick' ? req.body.remainingBalance : quota.sickLeaves,
          }
        }
        ,(err) => {
          if (err)
            next(error);
          else
            res.status(200).send(success("", 'Leave request added successfully'));
        }
      )
    })
    .catch((error) => {
      next(error);
    });
  }

};


leavesByEmployee = (req, res, next) => {
  const userId = process.env.userId;

  LeaveModel.aggregate(
    [
      {
        $match : { user: mongoose.Types.ObjectId(userId) } 
      },
      // { $sort : { date : 1 } }, // Sorts the records wrt to date in ascending order
      { $project : 
        {
          onBehalfLeave: 1,
          leaveType: 1,
          currentBalance: 1,
          startDate: { $dateToString: { format: "%d-%m-%Y", date: "$startDate" } },
          endDate: { $dateToString: { format: "%d-%m-%Y", date: "$endDate" } },
          dutyResumptionDate: { $dateToString: { format: "%d-%m-%Y", date: "$dutyResumptionDate" } },
          remainingBalance: 1,
          actingEmployee: 1,
          comments: 1,
          exitPermitRequired: 1,
          status: 1,
          workflowStatus: 1,
          attachment: 1,
          user: 1,
          requestType: 1
        }
      }
    ]
  ).then(result => {
    LeaveModel.populate(
      result, 
      {
        path: "user",
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


getLeavesQuota = (req, res, next) => {
  const userId = process.env.userId;

  QuotaModel
    .findOne({ userId: mongoose.Types.ObjectId(userId) })
    .select('annualLeaves casualLeaves sickLeaves')
    .then(resp => {
      let respFormat = [
        { leaveType: 'Annaul', quota: resp.annualLeaves },
        { leaveType: 'Casual', quota: resp.casualLeaves },
        { leaveType: 'Sick', quota: resp.sickLeaves },
      ]
      res.status(200).send(success(respFormat, 'success'));
    })
    .catch((error) => {
      next(error);
    });
}


module.exports = { addRequest, leavesByEmployee, getLeavesQuota };
