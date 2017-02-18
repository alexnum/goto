/**
 * Created by axius on 18/02/17.
 */
var mongoose = require('mongoose');

var companySchema = mongoose.Schema({
    name: String,
    parties:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Party' }],
    logo: String,
    payamentMethos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PayamentMethos' }],
    address: String,
    location: { lat: Number, lng: Number },
    phoneNumber: String,
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' }
});

mongoose.model('Company', companySchema);