/**
 * Created by axius on 18/02/17.
 */

var router = require('express').Router();
var mongoose = require('mongoose');
var moment = require("moment");

var User = mongoose.model('User');
var Party = mongoose.model('Party');
var Company = mongoose.model('Company');
var Contribuition = mongoose.model('Contribuition');
var MenuItem = mongoose.model('MenuItem');
var jwt = require('jsonwebtoken');


router.post('/', function (req, res) {
  var party = req.body;
  party.owner = req.reqUser._id;
  party.users = [req.reqUser._id];
  party.currentValue = 0;
  var evMoment = moment(party.date + " " + party.hour, "DD/MM/YYYY hh:mm");
  party.date = evMoment.toDate();
  new Party(party).save(function (err, pt) {
    if (err) {
      res.redirect('err');
    } else {
      Company.findOne({_id: pt.place}, function (err, comp) {

        comp.parties.push(pt._id);
        comp.save(function (err, compOk) {
          if (err) {
            res.send('err');
          } else {
            res.redirect('/');
          }
        });
      });
    }
  });
});

router.get('/filter', function (req, res) {
  var type = req.query.type;
  var nameOrId = req.query.q;
  var compId = req.query.compId;
  var now = new Date();
  var query;
  switch (type) {
    case 'MINE':
      query = {
        users: req.reqUser._id,
        owner: {$ne: req.reqUser._id},
        date: {$gt: now},
        name: new RegExp(nameOrId, 'i')
      };
      break;
    case 'OWNER':
      query = {
        owner: req.reqUser._id,
        date: {$gt: now},
        name: new RegExp(nameOrId, 'i'),
      };
      break;
    case 'CLOSED':
      query = {
        users: req.reqUser._id,
        date: {$lt: now},
        name: new RegExp(nameOrId, 'i'),
      };
      break;
    case 'COMP':
      query = {
        place: compId,
        name: new RegExp(nameOrId, 'i')
      };
      break;
  }
  if (!query) {
    res.status(400).send();
  } else {
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
        res.render('home', {parties: processedParties, type: 'MINE'});
      }
    });
  }
});


router.delete('/:ptCode/kick/:userId', function (req, res) {
  var ptCode = req.params.ptCode;
  var userToRemove = req.params.userId;
  if (userToRemove == req.reqUser._id) {
    res.redirect('bad-request');
  } else {
    Party.findOne({code: ptCode}).populate('contributions').exec(function (err, pt) {
      if (err) {
        res.redirect('404');
      } else {
        if (pt.owner != req.reqUser._id) {
          res.redirect('no-admin');
        } else {
          pt.users.pull(req.reqUser._id);
          pt.contributions.pull({user: req.reqUser._id});
          res.redirect('success');
        }
      }
    });
  }
});

router.post('/contribute', function (req, res) {
  var contribuition = req.body;
  contribuition.user = req.reqUser._id;
  contribuition.confirmed = false;
  var partyCode = contribuition.partyCode;
  if (contribuition.card && contribuition.card == 'goto') {
    contribuition.card = undefined;
    User.findOne({_id: req.reqUser}, function (err, me) {
      if (err) {
        res.send(err);
      } else {
        me.walletBalance = me.walletBalance - contribuition.value;
        if (me.walletBalance < 0) {
          res.send('Você não possui saldo suficiente em sua carteira');
        } else {
          me.save(function (err, me2) {
            if (err) {
              res.send(err);
            } else {
              new Contribuition(contribuition).save(function (err, contri) {
                if (err) {
                  res.redirect('err');
                } else {
                  Party.findOneAndUpdate(
                    {code: partyCode},
                    {
                      $push: {"contributions": contri._id},
                      $addToSet: {"users": contri.user},
                      $inc: {"currentValue": contri.value}
                    },
                    {safe: true, upsert: true},
                    function (err, party) {
                      if (err) {
                        res.redirect('err');
                      } else {
                        var tk = {};
                        var tokenUser = req.reqUser;
                        tokenUser.walletBalance = tokenUser.walletBalance - contribuition.value;
                        tk._doc = tokenUser;
                        var token = jwt.sign(tk, req.app.get('superSecret'), {
                          expiresInMinutes: 43200000 // expires in 24 hours
                        });

                        res.cookie('x-access-token', token, {maxAge: 90000000, httpOnly: true});
                        res.redirect('/site/event/' + partyCode);
                      }
                    }
                  );
                }
              });
            }
          })
        }
      }
    });
  } else {
    new Contribuition(contribuition).save(function (err, contri) {
      if (err) {
        res.redirect('err');
      } else {
        Party.findOneAndUpdate.findByIdAndUpdate(
          {code: partyCode},
          {
            $push: {"contributions": contri._id},
            $push: {"users": contri.user}
          },
          {safe: true, upsert: true},
          function (err, party) {
            if (err) {
              res.redirect('err');
            } else {
              res.redirect('success');
            }
          }
        );
      }
    });
  }

});

router.get('/contribute/:partyCode', function (req, res) {
  var ptCode = req.params.partyCode;
  Party.findOne({code: ptCode}, function (err, pt) {
    pt._doc.maxToDonate = pt.totalValue - pt.currentValue;
    res.render('participar', {user: req.reqUser, party: pt});
  });
});

router.post('/:id', function (req, res) {
  var partyCode = req.params.id;
  var newParty = req.body();
  Party.update(newParty, {code: partyCode}, {}, function (err, num) {
    if (err) {
      res.redirect('err');
    } else {
      res.redirect('sucess');
    }
  });
});

router.get('/new', function (req, res) {
  var companyId = req.query.companyId;
  MenuItem.find({company: companyId}, function (err, items) {
    res.render('new_event', {items: items, companyId: companyId, user: req.reqUser})
  });
});

router.get('/:partyCode', function (req, res) {
  var partyCode = req.params.partyCode;
  Party.findOne({code: partyCode})
    .populate('place')
    .populate({
      path: 'place',
      model: 'Company',
      populate: {path: 'city', model: 'City', populate: {path: 'state', model: 'State'}}
    })
    .populate('contribuitions')
    .populate({path: 'contributions', model: 'Contribuition', populate: {path: 'user', model: 'User'}})
    .exec(function (err, pt) {
      if (err) {
        res.redirect('err');
      } else {
        res.render('event_details', {user: req.reqUser, party: pt});
      }
    });
});

module.exports = router;