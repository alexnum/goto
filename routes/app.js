/**
 * Created by GAEL on 11/01/2017.
 */

/**
 * Created by GAEL on 18/12/2016.
 */

var jwt = require('jsonwebtoken');
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
  cryptPassword(user.password, function (err, hash) {
    if (err) {
      res.render('login', {error: {field: "password", message: "Dados do cadastro inválidos"}});
    } else {
      user.password = hash;
      new User(user).save(user, function (err, usr) {
        if (err) {
          res.render('login', {error: {field: "password", message: "Dados do cadastro inválidos"}});
        } else {
          res.render('login', {});
        }
      });
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
  var user = req.body.username;
  var password = req.body.password;

  User.findOne({login: user}).populate('city').exec(function (err, admin) {
    var us = {};
    if (!admin) {
      res.render('login', {error: {field: "password", message: "Senha inválida"}});
    } else {
      comparePassword(password, admin.password, function (err, match) {
        if (err) {
          res.render('login', {error: {field: "password", message: "Senha inválida"}});
        } else {
          if (match) {
            us._doc = admin;

            var token = jwt.sign(us, req.app.get('superSecret'), {
              expiresInMinutes: 43200000 // expires in 24 hours
            });

            res.cookie('x-access-token', token, {maxAge: 9000000000, httpOnly: true});

            if (us._doc.role && us._doc.role == 'ADMIN') {
              res.redirect('/site/admin/home');
            } else {
              res.redirect('/site/user/home');
            }
          } else {
            res.render('login', {error: {field: "password", message: "Senha inválida"}});
          }
        }
      });
    }
  });
});

module.exports = router;