var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');
const loggerJs = require('./helpers/logger');
var cors = require('cors');

// Helpers
require('dotenv').config({ path: '.env.prod' });
require('./auth/auth');
require('./config/db');

// Routes
var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var leaveRouter = require('./routes/leave');
var usersRouter = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

// Routes
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/leaves', leaveRouter);
app.use('/api/user', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // console.log('error', err);
  loggerJs.error(err, req, res);
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  res.status(400).send({
    message: err ? err.message : 'Something went wrong',
  });
});

app.listen(() => {
  const API_PORT = process.env.PORT || 8080;
  console.log(`Server running at http://localhost:${API_PORT}/`);
});

module.exports = app;
