const mongoose = require('mongoose');

const airTicketSchema = new mongoose.Schema(
  {
    userId: { type: schema.Types.ObjectId, ref: 'User', required: true },
    requestedDate: { type: Date, required: true },
    allowanceAmountLimit: { type: Number },
    consumedAmountLimit: { type: Number },
    requestedAmount: { type: Number },
    comment: { type: String },
    attachment: {
      fileName: { type: String },
      fileUrl: { type: String },
    },
    workflowStatus: { type: String, default: 'Line Manager Approved' },
    status: {
      type: String,
      enum: ['SUBMITTED', 'ACQUIRED'],
      default: 'ACQUIRED',
    },
    requestType: {
      type: String,
      enum: ['AIR_TICKET_REQUEST'],
      default: 'AIR_TICKET_REQUEST',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const AirTicket = mongoose.model('AirTicket', airTicketSchema);

module.exports = AirTicket;
