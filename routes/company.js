/**
 * Created by axius on 18/02/17.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Company = mongoose.model('Company');
var Party = mongoose.model('Party');


router.post('/', function(req, res){
    var newCompany = req.body;
    newCompany.owner = req.reqUser._id;
    new Company(newCompany).save(function(err, company){
        if(err){
            res.redirect('err');
        }else{
            res.redirect('/site/admin/home');
        }
    });
});

router.get('/:companyId/filter?', function(req, res){
    var cat = req.query.categoty;
    var compId = req.params.companyId;

    Company.find({
        category: cat,
        _id: compId, city:
        req.reqUser.city
    }, function(err, comps){
        if(err){
            res.status(500).send();
        }else{
            res.send(comps);
        }
    });
});

router.get('/:companyId', function (req, res) {
  var companyId = req.params.companyId;
  Company.find({
    _id: companyId
  }).populate('parties').exec(function (err, company) {
    if (err) {
      res.redirect('err');
    } else {
      res.render('company_details', {user: req.reqUser, company: company})
    }
  })
});

module.exports = router;