var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var expressHbs = require('express-handlebars');
var session =require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);

var app = express();
var mongoose =require('mongoose');
require('./config/passport');
// URL at which MongoDB service is running
var url = "mongodb+srv://aishwar:Aishu@123@cluster0-xqeaq.mongodb.net/test?retryWrites=true&w=majority";
 

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(res=>{
        console.log("DB Connected!")
}).catch(err => {
  console.log(Error, err.message);
});




// view engine setup
app.engine('.hbs',expressHbs({defaultLayout: 'layout',extname:'.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret:'qwertyuiop',
	resave: false, 
	saveUninitialized: false,
	store: new MongoStore({mongooseConnection: mongoose.connection}),
	cookie: { maxAge: 180* 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session;
	next();
})

app.use('/user', usersRouter);
app.use('/', indexRouter);

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
