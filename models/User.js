/**
 * Created by Alessandro on 04/12/2016.
 */
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  login: String,
  email: String,
  password: String,
  parties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Party' }],
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  walletBalance: Number,
  role: String
});

mongoose.model('User', userSchema);