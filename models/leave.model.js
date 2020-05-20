const mongoose = require('mongoose')
  schema = mongoose.Schema;

const leaveSchema = new schema(
  {
    onBehalfLeave: { type: Boolean, default: false },
    leaveType: { type: String, enum: ['Annual', 'Casual', 'Sick'], required: true },
    currentBalance: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    remainingBalance: { type: Number, required: true },
    dutyResumptionDate: { type: Date, required: true },
    actingEmployee: { type: String, required: true },
    comments: { type: String, default: '' },
    exitPermitRequired: { type: Boolean, default: false },
    attachment: { type: String },
    user: { type : schema.Types.ObjectId, ref : 'User', required : true },
    workflowStatus: { type: String, default: 'Line Manager Approved' },
    status: { 
      type: String,
      enum: ['SUBMITTED', 'ACQUIRED'],
      default: 'ACQUIRED'
    },
    requestType: { 
      type: String,
      enum: ['ANNUAL_LEAVE_REQUEST', 'CASUAL_LEAVE_REQUEST', 'SICK_LEAVE_REQUEST'],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Leave', leaveSchema);
