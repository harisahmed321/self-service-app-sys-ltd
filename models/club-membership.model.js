const mongoose = require('mongoose')
  schema = mongoose.Schema;

const clubMembershipSchema = new schema(
  {
    userId: { type: schema.Types.ObjectId, ref: 'User', required: true },
    requestedDate: { type: Date, required: true },
    membershipStartDate: { type: Date, required: true },
    allowanceAmountLimit: { type: Number },
    consumedAmountLimit: { type: Number },
    requestedAmount: { type: Number },
    comment: { type: String },
    attachment: { type: String },
    workflowStatus: { type: String, default: 'Line Manager Approved' },
    status: {
      type: String,
      enum: ['SUBMITTED', 'ACQUIRED'],
      default: 'ACQUIRED',
    },
    requestType: {
      type: String,
      enum: ['CLUB_MEMBERSHIP_ALLOWANCE_REQUEST'],
      default: 'CLUB_MEMBERSHIP_ALLOWANCE_REQUEST',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model('clubMembership', clubMembershipSchema);
