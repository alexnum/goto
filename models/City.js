/**
 * Created by axius on 18/02/17.
 */
var mongoose = require('mongoose');

var citySchema = mongoose.Schema({
    nome: String,
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'State' }
});

mongoose.model('City', citySchema, 'cities');