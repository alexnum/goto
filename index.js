var express = require('express');
var mongoose = require('mongoose');
var handlebars = require('express-handlebars');
var cookieParser = require('cookie-parser');

var port = process.env.PORT || 5000;
//var db = 'mongodb://heroku_5qcn5df4:l0imr1m3a4sse3dauep5qj131s@ds033096.mlab.com:33096/heroku_5qcn5df4';
var db = 'mongodb://192.168.1.48:27017/hackathon';

var https = require('https');
var querystring = require('querystring');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

mongoose.connect(db, function(err) {
  if (err) throw err;
});

require('./models/User');
require('./models/Card');
require('./models/Company');
require('./models/Contribuition');
require('./models/Party');
require('./models/PayamentMethod');
require('./models/State');
require('./models/City');
require('./models/MenuItem');

var routes = require('./routes/app');

var app = require('./config/app_config');
var router = express.Router();

app.set('superSecret', 'secret0');

router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.cookies['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.reqUser = decoded._doc;
        next();
      }
    });
  } else {
    //TODO vai para a tela de erro
    res.redirect('/');
  }
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(cookieParser());

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

var userRoute = require('./routes/users');
var partyRoute = require('./routes/party');
var companyRoute = require('./routes/company');
var cardRoute = require('./routes/card');
var adminRoute = require('./routes/admin');

app.use('/', routes);
app.use('/site', router);
app.use('/site/user', userRoute);
app.use('/site/company', companyRoute);
app.use('/site/event', partyRoute);
app.use('/site/card', cardRoute);
app.use('/site/admin', adminRoute);

app.set('view engine', 'ejs');

app.get('/', function(req, res) {

  var token = req.query.token || req.headers['x-access-token'] || req.cookies['x-access-token'];
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        res.render('login', {});
      } else {
        // if everything is good, save to request for use in other routes
        res.redirect('/site/user/home');
      }
    });
  } else {
    res.render('login', {});
  }
});

app.listen(port, function() {
  console.log('Node app is running on port', port);
});

updateToken = function (user, req, res) {
  var tk = {};
  var tokenUser = user;
  tk._doc = tokenUser;
  var token = jwt.sign(tk, req.app.get('superSecret'), {
    expiresInMinutes: 43200000 // expires in 24 hours
  });

  res.cookie('x-access-token', token, {maxAge: 90000000, httpOnly: true});
};
