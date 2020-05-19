const mongoose = require('mongoose')
  jwt = require('jsonwebtoken')
  LeaveModel = require('../models/leave.model')
  UserModel = require('../models/user.model');
const { success, failure } = require('../helpers/response');


addRequest = (req, res, next) => {
  const {
    onBehalfLeave,
    leaveType,
    currentBalance,
    startDate,
    endDate,
    remainingBalance,
    dutyResumptionDate,
    actingEmployee,
    // expectedDutyResumptionDate,
    // annualDutyResumptionDate,
    comments,
    exitPermitRequired,
    // attachment
  } = req.body;

  const userId = fetchUserId(req.headers.authorization);

  const leave = new LeaveModel({
    onBehalfLeave,
    leaveType,
    currentBalance,
    startDate,
    endDate,
    remainingBalance,
    dutyResumptionDate,
    actingEmployee,
    // expectedDutyResumptionDate,
    // annualDutyResumptionDate,
    comments,
    exitPermitRequired,
    user: userId
  });

  leave
    .save()
    .then((resp) => {
      updateUserQuota(resp);
    })
    .catch((error) => {
      next(error);
    });

  const updateUserQuota = (leave) => {
    UserModel
    .findOne({ _id: mongoose.Types.ObjectId(userId) })
    .then(user => {
      UserModel.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(userId) },
        {
          $set: {
            annualLeaves: leaveType == 'Annual' ? remainingBalance : user.annualLeaves,
            casualLeaves: leaveType == 'Casual' ? remainingBalance : user.casualLeaves,
            sickLeaves: leaveType == 'Sick' ? remainingBalance : user.sickLeaves,
          }
        }
        ,(err) => {
          if (err)
            next(error);
          else
            res.status(200).send(success(leave, 'Leave request added successfully'));
        }
      )
    })
    .catch((error) => {
      next(error);
    });
  }

};


leavesByEmployee = (req, res, next) => {
  const userId = fetchUserId(req.headers.authorization);

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
          // expectedDutyResumptionDate: { $dateToString: { format: "%d-%m-%Y", date: "$expectedDutyResumptionDate" } },
          // annualDutyResumptionDate: { $dateToString: { format: "%d-%m-%Y", date: "$annualDutyResumptionDate" } },
          remainingBalance: 1,
          actingEmployee: 1,
          comments: 1,
          exitPermitRequired: 1,
          status: 1,
          workflowStatus: 1,
          attachment: 1,
          user: 1
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
  const userId = fetchUserId(req.headers.authorization);

  UserModel
    .findOne({ _id: mongoose.Types.ObjectId(userId) })
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


fetchUserId = (auth) => {
  const token = auth.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_Secret_Key);
  return decoded.user._id;
}

module.exports = { addRequest, leavesByEmployee, getLeavesQuota };
