const mongoose = require('mongoose')
  schema = mongoose.Schema;

const quotaSchema = new schema(
  {
    annualLeaves: { type: Number, default: 12 },
    casualLeaves: { type: Number, default: 10 },
    sickLeaves: { type: Number, default: 10 },
    userId: { type : schema.Types.ObjectId, ref : 'User', required : true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quota', quotaSchema);
