const DocIssuanceReqModel = require('../models/doc-issuance-req.model');
const attachmentCtrl = require('./attachment');

create = (req, res, next) => {
  req.body.userId = process.env.userId;
  const docIssuanceReq = new DocIssuanceReqModel(req.body);
  docIssuanceReq
    .save()
    .then((result) => {
      if (req.body.attachment && req.body.attachment.baseString) {
        const data = {
          userId: req.body.userId,
          requestId: result._id,
          fileName: req.body.attachment.fileName,
          fileType: req.body.attachment.fileType,
          baseString: req.body.attachment.baseString,
          requestType: 'DOC_ISSUANCE_REQ',
        };
        attachmentCtrl.create(data);
      }
      res.status(200).send({ message: 'Doc issuance request created' });
    })
    .catch((error) => {
      next(error);
    });
};

getAll = (req, res, next) => {
  const userId = process.env.userId;
  DocIssuanceReqModel.find({ userId: userId })
    .then((result) => res.status(200).send({ result: result }))
    .catch((error) => next(error));
};

module.exports = { create, getAll };
