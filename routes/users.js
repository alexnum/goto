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


router.get('/me', function (req, res, next) {
  //If the user isn't really authenticated in the server
  User.findOne({_id: req.reqUser._id}, {}, function (err, user) {
    if (err) {
      res.status(500).send('Failed to get states.');
    } else {
      res.send(user)
    }
  });
});

router.get('/home', function (req, res, next) {
  //If the user isn't really authenticated in the server
  res.render('home', {user: req.reqUser})
});

router.get('/logout', function(req, res) {
  res.clearCookie('x-access-token');
  res.redirect('/');
});




module.exports = router;