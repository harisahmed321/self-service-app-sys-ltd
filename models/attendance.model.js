const mongoose = require('mongoose')
  schema = mongoose.Schema;

const attendanceSchema = new schema (
  {
    timeIn: { type: String, required: true },
    timeOut: { type: String, required: true },
    date: { type: Date, required: true },
    userId: { type : schema.Types.ObjectId, ref : 'User', required : true }
  }
);

module.exports = mongoose.model('attendance', attendanceSchema);
