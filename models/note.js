var mongoose = require('mongoose');

// define our students model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Note', {
    title : {type : String},
    content : {type : String},
    createDate : {type: Date, default: Date.now},
    updateDate : {type: Date, default: Date.now}
});