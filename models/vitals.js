var mongoose = require('mongoose');
var mongooseToCsv = require('mongoose-to-csv')
// define our students model
// module.exports allows us to pass this to other files when it is called
const vitalsSchema = new mongoose.Schema( {
    hr : {type : Number},
    isCritical : {type : Boolean, default: false},
    time : {type: Date, default: Date.now}
});

vitalsSchema.plugin(mongooseToCsv, {
    headers: 'hr isCritical time  ',
    constraints: {
        'hr': 'hr',
        'isCritical': 'isCritical',
        'time': 'time'
    }
});
const vitalsModel = mongoose.model('Vitals',  vitalsSchema);
module.exports = vitalsModel;