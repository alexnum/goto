/**
 * Created by axius on 18/02/17.
 */
var mongoose = require('mongoose');

var payamentSchema = mongoose.Schema({
    name: String,
    type: String
});

mongoose.model('PayamentMethos', payamentSchema);