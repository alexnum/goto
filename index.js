var express = require('express');
var mongoose = require('mongoose');
var handlebars = require('express-handlebars');
var cookieParser = require('cookie-parser');
var expressLayouts = require('express-ejs-layouts');

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
app.use(expressLayouts);
app.set('views', './views');

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

//TODO Remove
var Company = mongoose.model('Company');
var Party = mongoose.model('Party');
var MenuItem = mongoose.model('MenuItem');
app.listen(port, function() {
  console.log('Node app is running on port', port);
    // var company = {
    //     name: "Pizarella",
    //     logo: "",
    //     payamentMethos: ["58a889058b1e1e39e9fa4303", "58a889058b1e1e39e9fa42fb", "58a889058b1e1e39e9fa4300"],
    //     address: "Rua das flores, nº 41",
    //     phoneNumber: "(83) 98888-4444",
    //     city: "587d81e5b0073721f8f62ba5",
    //     category: "FOOD"
    // };
    // new Company(company).save(function(err, comp){
    //   if(err){
    //     console.log('err');
    //   }else{
    //     console.log(comp);
    //   }
    // })



    // var pt = {
    //     name: "PizzaGigante",
    //     totalValue:  80,
    //     currentValue:  10,
    //     users: ["58a87929411e612f3c4cb9d2"],
    //     date: new Date(),
    //     place: "58a88bdb14a9e43b3cf33af2",
    //     description: "Um evento mt legal",
    //     //TODO DOnt receive in request
    //     owner: "58a87929411e612f3c4cb9d2",
    //     tag: ['PITZA'],
    //     code: "qt678",
    //     minValue: 60,
    //     capacity: 80
    // }
    // new Party(pt).save(function(err, party){
    //   if(err){
    //     console.log("treta");
    //   }else{
    //     console.log(party);
    //   }
    // })

    // var item = {
    //     name: "Pizza",
    //     desc: "Uma pizza muito boa!",
    //     price: 80,
    //     company: "58a88bdb14a9e43b3cf33af2"
    // }
    // new MenuItem(item).save(function(err, it){
    //   if(err){
    //     console.log("errItem");
    //   }else{
    //     console.log(it);
    //     Party.find({},function(err,pt){
    //       if(err){
    //         console.log("ErrItemPT");
    //       }else{
    //         pt[0].item = it._id;
    //           pt[0].save(function(err, pt2){
    //           if(err){
    //             console.log("error seting ItemTp");
    //           }else{
    //               console.log(pt2);
    //           }
    //         });
    //       }
    //     })
    //   }
    // });
});


