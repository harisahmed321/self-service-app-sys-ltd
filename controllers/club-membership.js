const ClubMembershipModel = require('../models/club-membership.model');
const { success, failure } = require('../helpers/response');

addRequest = (req, res, next) => {
  req.body.userId = process.env.userId;
  // 
  delete[req.body.attachment];
  
  const clubMembership = new ClubMembershipModel(req.body);

  clubMembership
    .save()
    .then(() => {
      res.status(200).send(success("", "Club membership allowance request created successfully"));
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { addRequest };
