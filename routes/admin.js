/**
 * Created by axius on 18/02/17.
 */

var https = require('https');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Card = mongoose.model('Card');
var PayamentMethod = mongoose.model('PayamentMethod');

router.use(function (req, res, next) {
  next();
});

router.get('/home', function (req, res) {
  PayamentMethod.find({}, function (err, pms) {
    var payaments = {};

    payaments.credit = pms.filter(function (pm) {
      return pm.type == 'Credit'
    });

    payaments.debit = pms.filter(function (pm) {
      return pm.type == 'Debit'
    });

    res.render('admin/admin_home', {user: req.reqUser, payaments: payaments});
  });
});

router.get('/logout', function (req, res) {
  res.clearCookie('x-access-token');
  res.redirect('/');
});

module.exports = router;