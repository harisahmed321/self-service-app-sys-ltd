const mongoose = require('mongoose')
  jwt = require('jsonwebtoken')
  LeaveModel = require('../models/leave.model');
const { success, failure } = require('../helpers/response');


addRequest = (req, res, next) => {
  const {
    onBehalfLeave,
    leaveType,
    currentAnnualBalance,
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
    currentAnnualBalance,
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
      res.status(200).send(success(resp, 'Leave request added successfully'));
    })
    .catch((error) => {
      next(error);
    });
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
          currentAnnualBalance: 1,
          startDate : { $dateToString: { format: "%d-%m-%Y", date: "$startDate" } },
          endDate : { $dateToString: { format: "%d-%m-%Y", date: "$endDate" } },
          dutyResumptionDate : { $dateToString: { format: "%d-%m-%Y", date: "$dutyResumptionDate" } },
          // expectedDutyResumptionDate : { $dateToString: { format: "%d-%m-%Y", date: "$expectedDutyResumptionDate" } },
          // annualDutyResumptionDate : { $dateToString: { format: "%d-%m-%Y", date: "$annualDutyResumptionDate" } },
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
        path : "user" , 
        select : { "_id" : 0, "__v" : 0, "password" : 0, "createdAt" : 0, "updatedAt" : 0 } // Hide following fields
      }
    ).then(popl => {
      res.status(200).send(success(popl, 'success'));
    })
  })

}


fetchUserId = (auth) => {
  const token = auth.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_Secret_Key);
  return decoded.user._id;
}

module.exports = { addRequest, leavesByEmployee };
