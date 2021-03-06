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
require('dotenv').config({ path: '.env' });
require('./auth/auth');
require('./config/db');

// Routes
var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var leaveRouter = require('./routes/leave');
var usersRouter = require('./routes/user');
var airTicketRouter = require('./routes/air-ticket');
var clubMembershipRouter = require('./routes/club-membership');
var attendanceRouter = require('./routes/attendance');
var teamManagement = require('./routes/team-management');
var workQueue = require('./routes/work-queue');
var calenderEvent = require('./routes/calender-event');
var docIssuanceReq = require('./routes/doc-issuance-req');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));
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
app.use('/api/air-ticket', airTicketRouter);
app.use('/api/club-membership', clubMembershipRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/team-management', teamManagement);
app.use('/api/work-queue', workQueue);
app.use('/api/calender-event', calenderEvent);
app.use('/api/doc-issuance-req', docIssuanceReq);

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

app.listen(process.env.PORT || 8080, () => {
  console.log(
    `Server running at http://localhost:${process.env.PORT || 8080}/`
  );
});

module.exports = app;
