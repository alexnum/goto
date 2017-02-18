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
  Company.find({city: req.reqUser.city}, function(err, companies){
      if(err){
          res.render('home', {user: req.reqUser, err:'err'});
      }else{
          res.render('home', {user: req.reqUser, companies: companies});
      }
  })
});

router.get('/mine', function (req, res) {
  var now = new Date();
    Party.find({
      owner: req.reqUser._id,
      date: {$gt: now}
    }).populate('users').populate('place').exec(function(err, parties){
        if(err){
          res.render('err');
        }else{
            var processedParties = parties.map(function(item){
                preProcessParty(item, req.reqUser._id);
                return item;
            });
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
            var processedParties = parties.map(function(item){
                preProcessParty(item, req.reqUser._id);
                return item;
            });
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
            var processedParties = parties.map(function(item){
                preProcessParty(item, req.reqUser._id);
                return item;
            });
            res.render('home', {parties: processedParties, type: 'CLOSED'});
        }
    });
});

router.get('/account', function(req, res) {
    User.find({_id: req.reqUser._id}).populate('cards').exec(function(err, usr){
        if(err){
            res.redirect('err');
        }else{
            var userCards = user.cards.map(function(card){
                card.lastDigits = card.number.slice(-2);
            });
            res.render("my_account", {user: user});
        }
    });
    res.redirect('/');
});

router.post('/edit', function(req, res) {
    var updatedUser = req.body();
    User.update(updatedUser, {_id: req.reqUser._id}, {},function (err, num) {
        if(err){
            res.redirect('err');
        }else{
            res.redirect('sucess' );
        }
    });
});

router.post('/founds/add', function(req, res) {
    var founds = req.body().founds;
    User.find({_id: req.reqUser._id}, function(err, user){
        if(err){
            res.redirect("err");
        }else{
            user.founds = user.walletBalance + founds;
            user.save(function(err, usr){
                if(err){
                    res.redirect(err);
                }else{
                    res.redirect('/')
                }
            })
        }
    });
});


router.get('/logout', function(req, res) {
  res.clearCookie('x-access-token');
  res.redirect('/');
});




module.exports = router;