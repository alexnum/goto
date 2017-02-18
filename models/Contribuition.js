/**
 * Created by axius on 18/02/17.
 */
var mongoose = require('mongoose');
var contribuitionSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  card: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
  confimed: Boolean,
  value: Number
});

mongoose.model('Contribuition', contribuitionSchema);