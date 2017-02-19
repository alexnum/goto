/**
 * Created by GAEL on 18/12/2016.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('underscore');

var User = mongoose.model('User');
var Party = mongoose.model('Party');
var Company = mongoose.model('Company');
var Contribuition = mongoose.model('Contribuition');

router.get('/me', function (req, res) {
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
  Company.find({city: req.reqUser.city}, function (err, companies) {
    if (err) {
      res.render('home', {user: req.reqUser, err: 'err'});
    } else {
      res.render('home', {user: req.reqUser, companies: companies});
    }
  })
});

router.get('/events/mine', function (req, res) {
  var now = new Date();
  Party.find({
    owner: req.reqUser._id,
    date: {$gt: now}
  }).populate('users').populate('place').exec(function (err, parties) {
    if (err) {
      res.render('err');
    } else {
      var processedParties = parties.map(function (item) {
        preProcessParty(item, req.reqUser._id);
        return item;
      });
      res.render('events', {parties: processedParties, type: 'MINE', user: req.reqUser});
    }
  });
});

router.get('/events/participating', function (req, res) {
  var now = new Date();
  Party.find({
    users: req.reqUser._id,
    date: {$gt: now}
  }).populate('users').exec(function (err, parties) {
    if (err) {
      res.render('err');
    } else {
      var processedParties = parties.map(function (item) {
        var processedItem = preProcessParty(item, req.reqUser._id);
        return processedItem;
      });

      res.render('events', {parties: processedParties, type: 'PARTICIPATING', user: req.reqUser});
    }
  });
});

router.get('/events/closed', function (req, res) {
  var now = new Date();
  Party.find({
    users: req.reqUser._id,
    date: {$lt: now}
  }).populate('users').exec(function (err, parties) {
    if (err) {
      res.render('err');
    } else {
      var processedParties = parties.map(function (item) {
        preProcessParty(item, req.reqUser._id);
        return item;
      });
      res.render('events', {parties: processedParties, type: 'CLOSED', user: req.reqUser});
    }
  });
});

router.get('/account', function (req, res) {
  User.find({_id: req.reqUser._id}).populate('cards').exec(function (err, users) {
    if (err) {
      res.redirect('err');
    } else {
      var user = users[0];
      if (_.isArray(user.cards)) {
        user.cards.map(function (card) {
          card._doc.lastDigits = card.number.slice(-2);
        });
      }

      res.render("account", {user: user});
    }
  });
});

router.post('/edit', function (req, res) {
  var updatedUser = req.body;
  User.update(updatedUser, {_id: req.reqUser._id}, {}, function (err, num) {
    if (err) {
      res.redirect('err');
    } else {
      res.redirect('sucess');
    }
  });
});

router.get('/founds/add', function (req, res) {

  User.findOne({_id: req.reqUser._id}, function(err, pt){
    res.render('fundos', {user: req.reqUser, party: pt});
  });
});

router.post('/founds/add', function (req, res) {
  var founds = req.body.founds;
  User.find({_id: req.reqUser._id}, function (err, user) {
    if (err) {
      res.redirect("err");
    } else {
      user.founds = user.walletBalance + founds;
      user.save(function (err, usr) {
        if (err) {
          res.redirect(err);
        } else {
          res.redirect('/')
        }
      })
    }
  });
});

router.get('/logout', function (req, res) {
  res.clearCookie('x-access-token');
  res.redirect('/');
});

module.exports = router;