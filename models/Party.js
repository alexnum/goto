/**
 * Created by axius on 18/02/17.
 */

var mongoose = require('mongoose');

var partySchema = mongoose.Schema({
    name: String,
    totalValue:  Number,
    currentValue: {type: Number, default: 0},
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    date: Date,
    creationDate: Date,
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    description: String,
    //TODO DOnt receive in request
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contribuitions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contribuition' }],
    tag: [String],
    code: String,
    minValue: Number,
    capacity: Number,
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },

});

mongoose.model('Party', partySchema);