var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var Note = require('./note').schema;
// define our students model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('User', {
    username : {type : String, default: ''},
    password : {type : String, default: ''},
    notes : [Note]
});