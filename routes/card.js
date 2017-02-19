/**
 * Created by axius on 18/02/17.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Card = mongoose.model('Card');

router.post('/', function (req, res) {
  var card = req.body();
  card.user = req.reqUser._id;
  new Card(card).save(function (err, newCard) {
    if (err) {
      res.redirect('err');
    } else {
      newCard.populate('user').exec(function (err, user) {
        if (err) {
          res.redirect('err');
        } else {
          user.cards.push(newCard._id);
          res.redirect('/');
        }
      });
    }
  });
});

router.delete('/:id', function (req, res) {
  var cardId = req.params.id;
  Card.find({_id: cardId}, function (err, card) {
    if (err) {
      console.log('err');
    } else {
      if (card.user != req.reqUser._id) {
        res.redirect('err')
      } else {
        card.remove(function (err) {
          if (err) {
            res.redirect('err');
          } else {
            res.redirect('/')
          }
        });
      }
    }
  });
});

module.exports = router;