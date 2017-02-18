/**
 * Created by axius on 18/02/17.
 */
var router = require('express').Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Party = mongoose.model('Party');
var Company = mongoose.model('Company');
var Contribuition = mongoose.model('Contribuition');


router.post('/', function(req, res){
    var party = req.body();
    party.owner = req.reqUser._id;
    party.users = [req.reqUser._id];
    new Party(party).save(function(err, ad){
        if(err){
            res.redirect('err');
        }else{
            res.redirect('/');
        }
    });
});

router.get('/filter', function (req, res) {
    var type = req.query.type;
    var nameOrId = req.query.q;
    var compId = req.query.compId;
    var now = new Date();
    var query;
    switch(type){
        case 'MINE':
            query = {
                users: req.reqUser._id,
                date: {$gt: now},
                name: new RegExp(nameOrId, 'i'),
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
    if(!query){
        res.status(400).send();
    }else{
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
    }
});


router.delete('/:ptCode/kick/:userId', function(req, res){
    var ptCode = req.params.ptCode;
    var userToRemove = req.params.userId;
    if(userToRemove == req.reqUser._id){
        res.redirect('bad-request');
    }else{
        Party.findOne({code: ptCode}).populate('contributions').exec(function(err, pt){
            if(err){
                res.redirect('404');
            }else{
                if(pt.owner != req.reqUser._id){
                    res.redirect('no-admin');
                }else{
                    pt.users.pull(req.reqUser._id);
                    pt.contributions.pull({user: req.reqUser._id});
                    res.redirect('success');
                }
            }
        });
    }
});

router.post('/contribute', function(req, res){
    var contribuition = req.body();
    contribuition.user = req.reqUser._id;
    contribuition.confirmed = false;
    var partyCode = contribuition.partyCode;
    new Contribuition(contribuition).save(function(err, contri){
        if(err){
            res.redirect('err');
        }else{
            Party.findOneAndUpdate.findByIdAndUpdate(
                {code: partyCode},
                {
                    $push: {"contributions": contri._id},
                    $push: {"users": contri.user}
                },
                {safe: true, upsert: true},
                function(err, party) {
                    if(err){
                        res.redirect('err');
                    }else{
                        res.redirect('success');
                    }
                }
            );
        }
    });
});

router.post('/:id', function(req, res){
    var partyCode = req.params.id;
    var newParty = req.body();
    Party.update(newParty, {code: partyCode}, {},function (err, num) {
        if(err){
            res.redirect('err');
        }else{
            res.redirect('sucess' );
        }
    });
});


router.get('/:partyCode', function(req, res){
    var partyCode = req.params.partyCode;
    Party.findOne({code: partyCode},function (err, pt) {
        if(err){
            res.redirect('err');
        }else{

            res.redirect('sucess' + pt);
        }
    });
});

module.exports = router;