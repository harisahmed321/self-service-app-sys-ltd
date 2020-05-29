const mongoose = require('mongoose');

const teamManagement = new mongoose.Schema(
  {
    teamName: { type: String },
    teamDesc: { type: String },
    managerId: { type: schema.Types.ObjectId, ref: 'User', required: true },
    empIds: [{ type: schema.Types.ObjectId, ref: 'User', required: true }],
    userId: { type: schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

teamManagement.pre('save', async function (next) {
  const model = this;
  await TeamManagement.findOne({
    $and: [{ managerId: model.managerId }, { empId: model.empId }],
  }).then((result) => {
    console.log('result', result);
    if (result) {
      const error = new Error('user already exist');
      next(error);
    }
  });
});

const TeamManagement = mongoose.model('Team-Management', teamManagement);

module.exports = TeamManagement;
