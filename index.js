var express = require('express');
var mongoose = require('mongoose');
var handlebars = require('express-handlebars');
var cookieParser = require('cookie-parser');

var port = process.env.PORT || 5000;
var db = 'mongodb://heroku_5qcn5df4:l0imr1m3a4sse3dauep5qj131s@ds033096.mlab.com:33096/heroku_5qcn5df4';

var https = require('https');
var querystring = require('querystring');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

mongoose.connect(db, function(err) {
  if (err) throw err;
});




require('./models/User');

var UserModel = mongoose.model('User');

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
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(cookieParser());

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

var userRoute = require('./routes/users');

app.use('/', routes);
app.use('/site', router);
app.use('/site/user', userRoute);

app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: {
    ifIn: function(elem, list, options) {
      if(list == undefined){
        return false;
      }
      if(list.indexOf(elem) > -1) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  }
}));

app.set('view engine', 'handlebars');

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


