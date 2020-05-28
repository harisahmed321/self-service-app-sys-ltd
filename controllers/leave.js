const mongoose = require('mongoose')
  jwt = require('jsonwebtoken')
  LeaveModel = require('../models/leave.model')
  UserModel = require('../models/user.model')
  QuotaModel = require('../models/quota.model')
  attachmentCtrl = require('../controllers/attachment')
  TeamManagementModel = require('../models/team-management.model');
const { success, failure } = require('../helpers/response');


addRequest = (req, res, next) => {
  const userId = process.env.userId;
  req.body.userId = userId;

  if (req.body.leaveType == 'Annual') {
    req.body.requestType = 'ANNUAL_LEAVE_REQUEST';
  } else if (req.body.leaveType == 'Casual') {
    req.body.requestType = 'CASUAL_LEAVE_REQUEST';
  } else if (req.body.leaveType == 'Sick') {
    req.body.requestType = 'SICK_LEAVE_REQUEST';
  }

  const leave = new LeaveModel(req.body);
  leave
    .save()
    .then((resp) => {
      addAttachment(resp);
      updateLeaveQuota(resp);
    })
    .catch((error) => {
      next(error);
    });

  const addAttachment = (leave) => {
    if (req.body.attachment != null) {
      const data = {
        userId: userId,
        requestId: leave._id,
        fileName: req.body.attachment.fileName,
        fileType: req.body.attachment.fileType,
        baseString: req.body.attachment.baseString,
        requestType: req.body.requestType
      };
      attachmentCtrl.create(data);
      return;
    } else {
      return;
    }
  }

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
  const userId = process.env.userId;

  LeaveModel.aggregate(
    [
      {
        $match : { userId: mongoose.Types.ObjectId(userId) }
      },
      // { $sort : { date : 1 } }, // Sorts the records wrt to date in ascending order
      {
        $project : {
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
          userId: 1,
          requestType: 1
        }
      }
    ]
  ).then(result => {
    LeaveModel.populate(
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


leavesByTeam = (req, res, next) => {
  const managerId = process.env.userId;
  
  TeamManagementModel.find({ managerId })
    .then((result) => {
      let empIds = [];
      empIds.push(mongoose.Types.ObjectId(managerId)); // also fetch manager leaves
      result.forEach(element => {
        empIds.push(mongoose.Types.ObjectId(element.empId));
      });
      fetchLeaveRequest(empIds);
    })
    .catch((error) => next(error));

  const fetchLeaveRequest = (ids) => {
    LeaveModel.aggregate(
      [
        {
          $match : { userId: { $in : ids } }
        },
        {
          $project : {
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
            userId: 1,
            requestType: 1
          }
        }
      ]
    ).then(result => {
      LeaveModel.populate(
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


getLeavesQuota = (req, res, next) => {
  const userId = process.env.userId;

  QuotaModel
    .findOne({ userId: mongoose.Types.ObjectId(userId) })
    .select('annualLeaves casualLeaves sickLeaves')
    .then(resp => {
      let respFormat = [
        { leaveType: 'Annual', quota: resp.annualLeaves },
        { leaveType: 'Casual', quota: resp.casualLeaves },
        { leaveType: 'Sick', quota: resp.sickLeaves },
      ]
      res.status(200).send(success(respFormat, 'success'));
    })
    .catch((error) => {
      next(error);
    });
}


module.exports = { addRequest, leavesByEmployee, getLeavesQuota, leavesByTeam };
