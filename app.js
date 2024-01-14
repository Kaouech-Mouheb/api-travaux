var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var db = require('./models');

var indexRouter = require('./routes/index');


var usersRouter = require('./routes/users');
const plansRouter = require('./routes/plans');
const annanceRouter = require('./routes/annance');
const publicationRouter = require('./routes/publication');
const mesannancesRouter = require('./routes/mesannances');
const estimationRouter = require('./routes/estimation');





var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://app-travaux-4ddc429d1e0f.herokuapp.com/');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/auth', usersRouter);
app.use('/api/plans', plansRouter);
app.use('/api/annance', annanceRouter);
app.use('/api/publication', publicationRouter);
app.use('/api/mesannances', mesannancesRouter);
app.use('/api/estimation', estimationRouter);






// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
