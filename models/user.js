var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
var mongooseToCsv = require('mongoose-to-csv')
var Note = require('./note').schema;
// define our user model
// module.exports allows us to pass this to other files when it is called
const userSchema = new mongoose.Schema({
    username : {type : String, default: ''},
    sex :{type : String, default: ''},
    dob : {type : Date},
    inn : {type : String, default: ''},
    password : {type : String, default: ''},
    notes : [Note],
    vitals : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vitals"
        }
    ]
});
userSchema.plugin(mongooseToCsv, {
    headers: 'Data',
    constraints: {

    },
    virtuals: {
        'Data': function(doc) {
            var hrColum ="";
            doc.vitals.forEach(function(value){
                hrColum+=value.hr+","+value.isCritical+","+value.time+'\n';
            });
            return hrColum;
        }
        // ,
        // 'isCritical': function(doc) {
        //     var isCriticalColum ="";
        //     doc.vitals.forEach(function(value){
        //         isCriticalColum+=value.isCritical+'\n';
        //     });
        //     return isCriticalColum;
        // },
        // 'time': function(doc) {
        //     var timeColum ="";
        //     doc.vitals.forEach(function(value){
        //         timeColum+=value.time+'\n';
        //     });
        //     return timeColum;
        // }
    }
});
userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);
const userModel = mongoose.model('User',  userSchema);
module.exports = userModel;