const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    userId: { type: schema.Types.ObjectId, ref: 'User', required: true },
    requestId: { type: schema.Types.ObjectId, required: true },
    uuidFileName: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = Attachment;
