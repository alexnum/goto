/**
 * Created by GAEL on 11/01/2017.
 */

var express = require('express');
var bodyParser = require('body-parser');
var app = module.exports = express();

var allowCors = function(req, res, next) {

  res.header('Access-Control-Allow-Origin', '127.0.0.1:5000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');

  next();
}

app.use(allowCors);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

function preProcessParty(party, userId){
    if(party.users.length > 0 && party.users[0].constructor == String){
        party.userInParty = party.users.indexOf(userId) > -1;
    }else{
        var userIds = party.users.map(function(us) {return us.f_id;});
        party.userInParty = userIds.indexOf(userId) > -1;
    }
    party.percent = (party.currentValue*100)/party.totalValue;

    party.totalUsers = party.users.length;
}

app.use(preProcessParty)