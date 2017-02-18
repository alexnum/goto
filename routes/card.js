/**
 * Created by axius on 18/02/17.
 */
var jwt = require('jsonwebtoken');
var https = require('https');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Card = mongoose.model('Card');

router.post('/', function(req, res){
    var card = req.body();
    card.owner = req.reqUser._id;
    new Card(card).save(function(err, ad){
        if(err){
            res.redirect('err');
        }else{
            res.redirect('sucess');
        }
    });
});

router.post('/:id', function(req, res){
    var newParty = req.body();
    var partyCode = req.param.id;
    Party.findOneAndUpdate({code: partyCode},function (err, pt) {
        if(err){
            res.redirect('err');
        }else{
            res.redirect('sucess' + pt._id);
        }
    })
});

module.exports = router;