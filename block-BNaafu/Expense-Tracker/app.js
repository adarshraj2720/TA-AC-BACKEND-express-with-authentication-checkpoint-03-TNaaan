var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
var passport = require('passport')
require('dotenv').config()



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dashboardRouter = require('./routes/dashboard')
var auth = require('./middlewares/auth');


require('./modules/passport')

var app = express();

// connect to mb
mongoose.connect("mongodb://localhost:/expensetracker" ,(err) => {
    console.log(err ? err :"Connected to databases")
})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//add session
app.use(session({
  secret :process.env.SECRET ,
  resave : false ,
  saveUninitialized :false ,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))



app.use(passport.initialize());
app.use(passport.session());

app.use(auth.userInfo);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard',dashboardRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;