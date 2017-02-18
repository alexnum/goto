/**
 * Created by axius on 18/02/17.
 */
var mongoose = require('mongoose');

var stateSchema = mongoose.Schema({
    sigla: String,
    nome: String
});

mongoose.model('State', stateSchema, 'states');