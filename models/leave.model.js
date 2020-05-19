const mongoose = require('mongoose')
  schema = mongoose.Schema;

const leaveSchema = new schema(
  {
    onBehalfLeave: { type: Boolean, default: false },
    leaveType: { type: String, required: true },
    currentAnnualBalance: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    remainingBalance: { type: Number, required: true },
    dutyResumptionDate: { type: Date, required: true },
    actingEmployee: { type: String, required: true },
    // expectedDutyResumptionDate: { type: Date, required: true },
    // annualDutyResumptionDate: { type: Date, required: true },
    comments: { type: String, default: '' },
    exitPermitRequired: { type: Boolean, default: false },
    attachment: { type: String },
    status: { type: String, enum: ['SUBMITTED', 'APPROVED'], default: 'APPROVED' },
    workflowStatus: { type: String, default: 'Line Manager Approved' },
    user: { type : schema.Types.ObjectId, ref : 'User', required : true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Leave', leaveSchema);
