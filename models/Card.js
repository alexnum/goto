/**
 * Created by axius on 18/02/17.
 */
var mongoose = require('mongoose');

var cardSchema = mongoose.Schema({
    cardNumber: String,
    expirationDate: Date,
    flag: String,
    cvCode: String,
    userName: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('Card', cardSchema);