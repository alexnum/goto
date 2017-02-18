/**
 * Created by axius on 18/02/17.
 */
var jwt = require('jsonwebtoken');
var https = require('https');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');

module.exports = router;