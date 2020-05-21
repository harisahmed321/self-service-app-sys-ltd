const ClubMembershipModel = require('../models/club-membership.model');
const { success, failure } = require('../helpers/response');

addRequest = (req, res, next) => {
  req.body.userId = process.env.userId;

  const clubMembership = new ClubMembershipModel(req.body);
  clubMembership
    .save()
    .then((resp) => {
      addAttachment(resp);
      res.status(200).send(success("", "Club membership allowance request created successfully"));
    })
    .catch((error) => {
      next(error);
    });

  const addAttachment = (resp) => {
    if (req.body.attachment != null) {
      const data = {
        userId: req.body.userId,
        requestId: resp._id,
        fileName: req.body.attachment.fileName,
        fileType: req.body.attachment.fileType,
        baseString: req.body.attachment.baseString,
        requestType: 'CLUB_MEMBERSHIP_ALLOWANCE_REQUEST'
      };
      attachmentCtrl.create(data);
      return;
    } else {
      return;
    }
  }

};

module.exports = { addRequest };
