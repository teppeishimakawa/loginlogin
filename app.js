/*mysql
db:bulletin_board

table:
users
rows user_id,user_name,email,password,created_at

boards
rows user_id,board_id,title,created_at

messages
rows user_id,message_id,board_id,message,created_at

users
*/

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');


var indexRouter = require('./routes/route.js');
//var usersRouter = require('./routes/users.js');
var boards = require('./routes/boards.js');
var register = require('./routes/register.js');
var login = require('./routes/login.js');　


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use(express.static(__dirname));
//css当てるのに必要。自動でpublic入力される
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));


//!!!!　/は自分のファイル。ここがapp.jsから出発したpathの基準
// /でreqされたらroute.js発動
app.use('/', indexRouter);
//app.use('/users', usersRouter);

//!!!!ここがapp.jsから出発したpathの基準。cssファイル当てる時大事
/*get,postで/boardsのreqm受けた時はvar boards = require('./routes/boards.js');発動*/
app.use('/boards', boards);
app.use('/register', register);
app.use('/login', login);



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
