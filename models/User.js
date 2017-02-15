/**
 * Created by Alessandro on 04/12/2016.
 */
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  login: String,
  email: String,
  password: String
});

mongoose.model('User', userSchema);