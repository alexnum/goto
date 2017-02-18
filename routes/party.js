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
            res.redirect('sucess');
        }
    });
});

router.delete('/:ptCode/kick/:userId', function(req, res){
    var ptCode = req.params.ptCode;
    var userToRemove = req.params.ptCode;
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


//TODO Move to company
// router.get('/:companyId', function(req, res){
//     var companyId = req.param.companyId;
//     Party.find({place: companyId},function (err, pt) {
//         if(err){
//             res.redirect('err');
//         }else{
//             res.redirect('sucess' + pt);
//         }
//     })
// });

router.get('/:partyCode', function(req, res){
    var partyCode = req.param.partyCode;
    Party.findOne({code: partyCode},function (err, pt) {
        if(err){
            res.redirect('err');
        }else{
            pt.userInParty = pt.users.indexOf("someString") > -1;
            res.redirect('sucess' + pt);
        }
    });
});

module.exports = router;