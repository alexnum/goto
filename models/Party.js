/**
 * Created by axius on 18/02/17.
 */

var mongoose = require('mongoose');

var partySchema = mongoose.Schema({
    name: String,
    totalValue:  Number,
    currentValue:  Number,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    date: Date,
    creationDate: Date,
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    description: String,
    //TODO DOnt receive in request
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contributions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contribuition' }],
    tag: [String],
    code: String,
    minValue: Number,
    capacity: Number
});

mongoose.model('Party', partySchema);