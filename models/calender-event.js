const mongoose = require('mongoose');

const calenderEvent = new mongoose.Schema(
  {
    userId: { type: schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    dateTime: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CalenderEvent = mongoose.model('Calender-Event', calenderEvent);

module.exports = CalenderEvent;
