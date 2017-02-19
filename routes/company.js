/**
 * Created by axius on 18/02/17.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Company = mongoose.model('Company');
var Party = mongoose.model('Party');
var MenuItem = mongoose.model('MenuItem');


router.post('/', function(req, res){
    var newCompany = req.body;
    newCompany.owner = req.reqUser._id
    var item1 = {};
    var item2 = {};
    switch(newCompany.category){
        case 'MUSIC':
            item1 = {
                name: 'Aula de chorinho',
                price: 70,
                desc: 'Aulas de musica com um ótimo professor'
            };
            item2 = {
                name: 'Aula de teclado',
                price: 70,
                desc: 'Aulas de musica com o cãozinho dos teclados'
            };
            break;
        case 'FOOD':
            item1 = {
                name: 'Barca de Yakisoba',
                price: 60,
                desc: 'Deliciosa barca de yakisoba'
            };
            item2 = {
                name: 'Combinado 40 peças suhi',
                price: 40,
                desc: 'Delicioso prato da culinára Japonesa por um ótimo preço para dividir com quem você gosta'
            };
            break;
        case 'SPORTS':
            item1 = {
                name: 'Aluguel quadra de tênis 1 Hora',
                price: 50,
                desc: 'Aulas de musica com um ótimo professor'
            };
            item2 = {
                name: 'Auguem de campo para racha dos solteirões + Birita',
                price: 80,
                desc: 'Dividir o e bater uma bola e depois combar com uma bela loira gelada'
            };
            break;
        default:
            item1 = {
                name: 'Aulas particulares de Japonễs',
                price: 60,
                desc: 'Aulas de japonês com um ótimo professor! 昨夜のコン'
            };
            item2 = {
                name: 'Aula de zumba',
                price: 70,
                desc: 'Aulas de zumba para você queimar uitas calorias!'
            };
            break;
    }
    new Company(newCompany).save(function(err, comp){
        if(err){
            res.redirect('err');
        }else{
            item1.company = comp._id;
            item2.company = comp._id;
            new MenuItem(item1).save(function(err, it1){
                if(err){
                    res.send(err);
                }else{
                    new MenuItem(item2).save(function(err,it2){
                       if(err){
                           res.send(err);
                       }else{
                           res.redirect('/site/admin/home');
                       }
                    });
                }
            });

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
  Company.findOne({
    _id: companyId
  }).populate('parties')
    .populate({path: 'city', model: 'City', populate: {path: 'state', model: 'State'}})
    .populate({path: 'parties', model: 'Party', populate: {path: 'contributions', model: 'Contribuition'}}).exec(function (err, company) {
    if (err) {
      res.redirect('err');
    } else {
      for (var i in company.parties) {
        company.parties[i].place = company;
      }

      res.render('company_details', {user: req.reqUser, company: company})
    }
  })
});

module.exports = router;