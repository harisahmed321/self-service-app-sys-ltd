const UserModel = require('../models/user.model');
const QuotaModel = require('../models/quota.model');
const jwt = require('jsonwebtoken');

login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({
      email,
    });
    if (!user) {
      const error = new Error('Email or password not matched');
      next(error);
      return;
    }
    const validate = await user.isValidPassword(password);
    if (!validate) {
      const error = new Error('Email or password not matched');
      next(error);
      return;
    }
    const token = generateToken(user);
    user.password = '';
    const result = { token, user };
    res.status(200).send({ result, message: 'Login successful' });
  } catch (error) {
    next(error);
  }
};

userRegistration = (req, res, next) => {
  const {
    email,
    password,
    role,
    firstName,
    lastName,
    designation,
    dob,
    phoneNo,
    officeNo,
    address,
    bloodGroup,
  } = req.body;

  const user = new UserModel({
    email,
    password,
    role,
    firstName,
    lastName,
    designation,
    dob,
    phoneNo,
    officeNo,
    address,
    bloodGroup,
  });

  user
    .save()
    .then((user) => {
      const token = generateToken(user);
      user.password = '';
      const result = { token, user };
      addQuota(result);
    })
    .catch((error) => {
      next(error);
    });

  const addQuota = (result) => {
    const quota = new QuotaModel();
    quota.userId = result.user._id;

    quota
    .save()
    .then((qt) => {
      res.status(200).send({ result, message: 'Registration successful' });
    })
    .catch((error) => {
      next(error);
    });
  }
};

generateToken = (user) => {
  const body = { _id: user._id, phoneNo: user.phoneNo };
  const token = jwt.sign({ user: body }, process.env.JWT_Secret_Key, {
    expiresIn: process.env.JWT_ExpiresIn,
  });
  return token;
};

module.exports = { userRegistration, login };
