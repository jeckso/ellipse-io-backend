var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
var Note = require('./note').schema;
// define our students model
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
userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);
const userModel = mongoose.model('User',  userSchema);
module.exports = userModel;