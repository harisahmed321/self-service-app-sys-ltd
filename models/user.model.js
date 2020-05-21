const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { upperCapitalizeFirst } = require('../helpers/helpers');

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['ADMIN', 'MANAGER', 'USER'],
      default: 'USER',
    },
    email: {
      type: String,
      required: true,
    },
    isEmailVerified: { type: Boolean, default: false },
    password: { type: String, required: true, trim: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    designation: { type: String },
    dob: { type: Date },
    phoneNo: { type: String },
    officeNo: { type: String },
    address: { type: String },
    bloodGroup: { type: String },
    isBlocked: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (!validator.isEmail(user.email)) {
    const error = new Error('Email format is not valid');
    next(error);
  }

  await User.findOne({ email: user.email }).then((res) => {
    if (res) {
      const error = new Error('email already exist');
      next(error);
    }
  });

  user.firstName = user.firstName
    ? upperCapitalizeFirst(user.firstName)
    : user.firstName;
  user.lastName = user.lastName
    ? upperCapitalizeFirst(user.lastName)
    : user.lastName;
  next();
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
});

userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
