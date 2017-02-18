/**
 * Created by axius on 18/02/17.
 */
var mongoose = require('mongoose');

var menuItemSchema = mongoose.Schema({
    name: String,
    desc: String,
    price: Number,
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
});

mongoose.model('MenuItem', menuItemSchema);