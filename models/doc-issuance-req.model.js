const mongoose = require('mongoose');

const docIssuanceReq = new mongoose.Schema(
  {
    userId: { type: schema.Types.ObjectId, ref: 'User', required: true },
    letterType: {
      type: String,
      enum: ['DOC'],
      default: 'DOC',
    },
    language: {
      type: String,
      enum: ['EN', 'UR'],
      default: 'EN',
    },
    letterTo: { type: String, required: true },
    subject: { type: String, required: true },
    reasonForLetterReq: { type: String, required: true },
    dueDate: { type: Date, required: true },
    workflowStatus: { type: String, default: 'Line Manager Approved' },
    status: {
      type: String,
      enum: ['SUBMITTED', 'ACQUIRED'],
      default: 'ACQUIRED',
    },
    requestType: {
      type: String,
      enum: ['DOC_ISSUANCE_REQ'],
      default: 'DOC_ISSUANCE_REQ',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const DocIssuanceReq = mongoose.model('doc-issuance-req', docIssuanceReq);

module.exports = DocIssuanceReq;
