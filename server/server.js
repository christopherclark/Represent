var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');

var User = require('./models/userModel');
var CongressPerson = require('./models/congressPersonModel');
var seedConstructors = require('./models/seedConstructors');

// Dependencies needed for Authentication
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/routes');
var auth = require('./routes/authRoutes');

var SESSION_SECRET = require('../_config.js').SESSION_SECRET;

var app = express();
var port = process.env.PORT || 4556;
app.use(express.static(__dirname + '/../client'));



app.use(morgan('dev'));

app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret: SESSION_SECRET })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./auth/passport.js')(passport); //pass passport for configuration


// Routes 
app.use('/auth', auth);
app.use('/api', routes);


console.log('Server now listening on port ' + port);
app.listen(port);




//Connect to db - test for existence of local db
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/congressionalStalker');

// mongoose.connect("mongodb://delorean11:delorean11@ds039175.mongolab.com:39175/congressional-stalker");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {

  // Legacy function. Updated to seed congress db anytime it is empty.
  seedConstructors();
  console.log('congressionalStalker db opened');
});


module.exports = app;
