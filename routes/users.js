/**
 * Created by GAEL on 18/12/2016.
 */
var jwt = require('jsonwebtoken');
var https = require('https');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Party = mongoose.model('Party');
var Company = mongoose.model('Company');
var Contribuition = mongoose.model('Contribuition');

var preProcessParty = function(party){
  party.percent = (party.currentValue*100)/party.totalValue;
  party.totalUsers = party.users.length;
}

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

router.get('/home', function (req, res) {
  //If the user isn't really authenticated in the server
  res.render('home', {user: req.reqUser})
});

router.get('/mine', function (req, res) {
  var now = new Date();
    Party.find({
      owner: req.reqUser._id,
      date: {$gt: now}
    }).populate('users').exec(function(err, parties){
        if(err){
          res.render('err');
        }else{
          var processedParties = parties.map(preProcessParty);
          res.render('home', {parties: processedParties, type: 'MINE'});
        }
    });
});

router.get('/participating', function (req, res) {
    var now = new Date();
    Party.find({
        users: req.reqUser._id,
        date: {$gt: now}
    }).populate('users').exec(function(err, parties){
        if(err){
            res.render('err');
        }else{
            var processedParties = parties.map(preProcessParty);
            res.render('home', {parties: processedParties, type: 'PARTICIPATING'});
        }
    });
});

router.get('/closed', function (req, res) {
    var now = new Date();
    Party.find({
        users: req.reqUser._id,
        date: {$lt: now}
    }).populate('users').exec(function(err, parties){
        if(err){
            res.render('err');
        }else{
            var processedParties = parties.map(preProcessParty);
            res.render('home', {parties: processedParties, type: 'CLOSED'});
        }
    });
});

router.get('/logout', function(req, res) {
  res.clearCookie('x-access-token');
  res.redirect('/');
});




module.exports = router;