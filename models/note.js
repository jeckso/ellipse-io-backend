var mongoose = require('mongoose');

// define our students model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Note', {
    id : {type : Number },
    title : {type : String},
    content : {type : String},
    createDate : {type : Date},
    updateDate : {type : Date}
});