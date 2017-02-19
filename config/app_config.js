/**
 * Created by GAEL on 11/01/2017.
 */

var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var app = module.exports = express();
var bcrypt = require('bcrypt');

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

preProcessParty = function(party, userId){
    if(party.users && party.users.length > 0 && party.users[0].constructor == String){
        party._doc.userInParty = party.users.indexOf(userId) > -1;
        party._doc.totalUsers = party.users.length;
    }else if (party.users){
        var userIds = party.users.map(function(us) {return us.f_id;});
        party._doc.userInParty = userIds.indexOf(userId) > -1;
        party._doc.totalUsers = party.users.length;
    }
    party._doc.day = moment(party.date).format('DD/MM/YYYY');
    party._doc.time = moment(party.date).format('hh:mm:ss');
    party._doc.percent = (party.currentValue*100)/party.totalValue;
    return party;
}

cryptPassword = function(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err)
            return callback(err);

        bcrypt.hash(password, salt, function(err, hash) {
            return callback(err, hash);
        });

    });
};

comparePassword = function(password, userPassword, callback) {
    bcrypt.compare(password, userPassword, function(err, isPasswordMatch) {
        if (err)
            return callback(err);
        return callback(null, isPasswordMatch);
    });
};