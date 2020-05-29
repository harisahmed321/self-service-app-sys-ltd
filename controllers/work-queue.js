const mongoose = require('mongoose');
jwt = require('jsonwebtoken');
LeaveModel = require('../models/leave.model');
attachmentCtrl = require('../controllers/attachment');
ClubMembershipModel = require('../models/club-membership.model');
AirTicketModel = require('../models/air-ticket.model');
TeamManagementModel = require('../models/team-management.model');
const { success, failure } = require('../helpers/response');

getByEmployee = (req, res, next) => {
  const userId = process.env.userId;

  Promise.all([
    fetchLeaveReqs(userId, false),
    fetchClubMembershipReqs(userId, false),
    fetchAirTicketReqs(userId, false),
  ]).then(function (results) {
    let RECORDS = [];
    results.forEach((e) => {
      RECORDS = RECORDS.concat(e);
    });
    if (req.body.filterBy == 'request-type') {
      RECORDS.sort((a, b) =>
        a.requestType > b.requestType
          ? 1
          : b.requestType > a.requestType
          ? -1
          : 0
      );
    } else if (req.body.filterBy == 'date') {
      RECORDS.sort((a, b) =>
        a.updatedAt > b.updatedAt ? 1 : b.updatedAt > a.updatedAt ? -1 : 0
      );
    }
    res.send(success(RECORDS, 'success'));
  });
};

getByManager = (req, res, next) => {
  const managerId = process.env.userId;

  TeamManagementModel.findOne({ managerId })
    .then((result) => {
      fetchRequests(result.empIds);
    })
    .catch((error) => next(error));

  const fetchRequests = (empIds) => {
    Promise.all([
      fetchLeaveReqs(empIds, true),
      fetchClubMembershipReqs(empIds, true),
      fetchAirTicketReqs(empIds, true),
    ]).then(function (results) {
      let RECORDS = [];
      results.forEach((e) => {
        RECORDS = RECORDS.concat(e);
      });
      if (req.body.filterBy == 'request-type') {
        RECORDS.sort((a, b) =>
          a.requestType > b.requestType
            ? 1
            : b.requestType > a.requestType
            ? -1
            : 0
        );
      } else if (req.body.filterBy == 'date') {
        RECORDS.sort((a, b) =>
          a.updatedAt > b.updatedAt ? 1 : b.updatedAt > a.updatedAt ? -1 : 0
        );
      }
      res.send(success(RECORDS, 'success'));
    });
  };
};

const fetchLeaveReqs = (userId, isManager) => {
  if (isManager) {
    return new Promise((resolve, reject) => {
      LeaveModel.aggregate([
        {
          $match: { userId: { $in: userId } },
        },
        {
          $project: {
            status: 1,
            workflowStatus: 1,
            requestType: 1,
            userId: 1,
            createdAt: {
              $dateToString: { format: '%d-%m-%Y', date: '$createdAt' },
            },
            updatedAt: {
              $dateToString: { format: '%d-%m-%Y', date: '$updatedAt' },
            },
          },
        },
      ]).then((result) => {
        resolve(result);
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      LeaveModel.aggregate([
        {
          $match: { userId: mongoose.Types.ObjectId(userId) },
        },
        {
          $project: {
            status: 1,
            workflowStatus: 1,
            requestType: 1,
            userId: 1,
            createdAt: {
              $dateToString: { format: '%d-%m-%Y', date: '$createdAt' },
            },
            updatedAt: {
              $dateToString: { format: '%d-%m-%Y', date: '$updatedAt' },
            },
          },
        },
      ]).then((result) => {
        resolve(result);
      });
    });
  }
};

const fetchClubMembershipReqs = (userId, isManager) => {
  if (isManager) {
    return new Promise((resolve, reject) => {
      ClubMembershipModel.aggregate([
        {
          $match: { userId: { $in: userId } },
        },
        {
          $project: {
            status: 1,
            workflowStatus: 1,
            requestType: 1,
            userId: 1,
            createdAt: {
              $dateToString: { format: '%d-%m-%Y', date: '$createdAt' },
            },
            updatedAt: {
              $dateToString: { format: '%d-%m-%Y', date: '$updatedAt' },
            },
          },
        },
      ]).then((result) => {
        resolve(result);
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      ClubMembershipModel.aggregate([
        {
          $match: { userId: mongoose.Types.ObjectId(userId) },
        },
        {
          $project: {
            status: 1,
            workflowStatus: 1,
            requestType: 1,
            userId: 1,
            createdAt: {
              $dateToString: { format: '%d-%m-%Y', date: '$createdAt' },
            },
            updatedAt: {
              $dateToString: { format: '%d-%m-%Y', date: '$updatedAt' },
            },
          },
        },
      ]).then((result) => {
        resolve(result);
      });
    });
  }
};

const fetchAirTicketReqs = (userId, isManager) => {
  if (isManager) {
    return new Promise((resolve, reject) => {
      AirTicketModel.aggregate([
        {
          $match: { userId: { $in: userId } },
        },
        {
          $project: {
            status: 1,
            workflowStatus: 1,
            requestType: 1,
            userId: 1,
            createdAt: {
              $dateToString: { format: '%d-%m-%Y', date: '$createdAt' },
            },
            updatedAt: {
              $dateToString: { format: '%d-%m-%Y', date: '$updatedAt' },
            },
          },
        },
      ]).then((result) => {
        resolve(result);
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      AirTicketModel.aggregate([
        {
          $match: { userId: mongoose.Types.ObjectId(userId) },
        },
        {
          $project: {
            status: 1,
            workflowStatus: 1,
            requestType: 1,
            userId: 1,
            createdAt: {
              $dateToString: { format: '%d-%m-%Y', date: '$createdAt' },
            },
            updatedAt: {
              $dateToString: { format: '%d-%m-%Y', date: '$updatedAt' },
            },
          },
        },
      ]).then((result) => {
        resolve(result);
      });
    });
  }
};

module.exports = { getByEmployee, getByManager };
