const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    userId: { type: schema.Types.ObjectId, ref: 'User', required: true },
    requestId: { type: schema.Types.ObjectId, required: true },
    requestType: {
      type: String,
      enum: ['AIR_TICKET_REQUEST', 'CLUB_MEMBERSHIP_ALLOWANCE_REQUEST', 'DOCUMENT_ISSUANCE_REQUEST', 'ANNUAL_LEAVE_REQUEST', 'CASUAL_LEAVE_REQUEST', 'SICK_LEAVE_REQUEST'],
      required: true
    },
    uuidFileName: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
  },
  { timestamps: true }
);

const Attachment = mongoose.model('attachment', attachmentSchema);

module.exports = Attachment;
