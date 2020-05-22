const mongoose = require('mongoose')
  jwt = require('jsonwebtoken')
  LeaveModel = require('../models/leave.model')
  attachmentCtrl = require('../controllers/attachment')
  ClubMembershipModel = require('../models/club-membership.model')
  AirTicketModel = require('../models/air-ticket.model');
const { success, failure } = require('../helpers/response');


getByEmployee = (req, res, next) => {
  const userId = process.env.userId;

  if (!req.body.filter || req.body.filter == '') {
    res.status(400).send(failure('filter is required'));
  } else {
    Promise.all([
      fetchLeaveReqs(userId),
      fetchClubMembershipReqs(userId),
      fetchAirTicketReqs(userId),
    ]).then(function(results) {
        let RECORDS = [];
        results.forEach((e) => {
          RECORDS = RECORDS.concat(e);
        });
        RECORDS.sort((a,b) => (a.requestType > b.requestType) ? 1 : ((b.requestType > a.requestType) ? -1 : 0)); 
        res.send(RECORDS);
    });
  }

}

const fetchLeaveReqs = (userId) => {
  return new Promise((resolve, reject) => {
    LeaveModel.aggregate(
      [
        {
          $match : { userId: mongoose.Types.ObjectId(userId) }
        },
        {
          $project : {
            status: 1,
            workflowStatus: 1,
            requestType: 1,
            userId: 1,
            createdAt: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
            updatedAt: { $dateToString: { format: "%d-%m-%Y", date: "$updatedAt" } }
          }
        }
      ]
    ).then(result => {
      resolve(result);
    })
  })
}

const fetchClubMembershipReqs = (userId) => {
  return new Promise((resolve, reject) => {
    ClubMembershipModel.aggregate(
      [
        {
          $match : { userId: mongoose.Types.ObjectId(userId) }
        },
        {
          $project : {
            status: 1,
            workflowStatus: 1,
            requestType: 1,
            userId: 1,
            createdAt: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
            updatedAt: { $dateToString: { format: "%d-%m-%Y", date: "$updatedAt" } }
          }
        }
      ]
    ).then(result => {
      resolve(result);
    })
  })
}

const fetchAirTicketReqs = (userId) => {
  return new Promise((resolve, reject) => {
    AirTicketModel.aggregate(
      [
        {
          $match : { userId: mongoose.Types.ObjectId(userId) }
        },
        {
          $project : {
            status: 1,
            workflowStatus: 1,
            requestType: 1,
            userId: 1,
            createdAt: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
            updatedAt: { $dateToString: { format: "%d-%m-%Y", date: "$updatedAt" } }
          }
        }
      ]
    ).then(result => {
      resolve(result);
    })
  })
}


leavesByTeam = (req, res, next) => {
  const managerId = process.env.userId;
  
  TeamManagementModel.find({ managerId })
    .then((result) => {
      let empIds = [];
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



module.exports = { getByEmployee };
