/**
 * Created by GAEL on 11/01/2017.
 */

/**
 * Created by GAEL on 18/12/2016.
 */
var jwt = require('jsonwebtoken');
var https = require('https');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');
var City = mongoose.model('City');

router.get('/register', function (req, res, next) {
  res.render('register', {});
});

router.post('/register', function (req, res, next) {

  var user = req.body;
  new User(user).save(user, function(err, usr){
    if(err){
      res.render('login', {error: {field: "password", message: "Dados do cadastro inválidos"}});
    }else{
      res.render('login', {});
    }
  });
});

router.get('/states', function (req, res, next) {
  //If the user isn't really authenticated in the server
  State.find({}, {}, function (err, states) {
    if (err) {
      res.status(500).send('Failed to get states.');
    } else {
      res.send(states)
    }
  });
});

router.get('/city', function (req, res, next) {
    var cityName = req.query.q;
    //If the user isn't really authenticated in the server
    City.find({nome: new RegExp(cityName, 'i')}).populate('state').exec(function (err, cities) {
        if (err) {
            res.status(500).send('Failed to get citie.');
        } else {
            res.send(cities)
        }
    });
});



router.post('/authenticate', function (req, res, next) {
  console.log("Auth");
  var user = req.body.username;
  var password = req.body.password;
  User.findOne({login: user}).exec(function(err, admin){
    var ad = {};
    if(admin != undefined && admin.password == password){
      ad._doc = admin;
      var token = jwt.sign(ad, req.app.get('superSecret'), {
        expiresInMinutes: 43200000 // expires in 24 hours
      });
      res.cookie('x-access-token', token, { maxAge: 9000000000, httpOnly: true });
      //res.redirect(301, '/api/profile');
      res.redirect('/site/user/home');
      //res.status(301).send("Redirect");
    }else{
      res.render('login', {error: {field: "password", message: "Senha inválida"}});
    }
  });
});



module.exports = router;