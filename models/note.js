var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
// define our students model
// module.exports allows us to pass this to other files when it is called
const noteSchema = new mongoose.Schema({
    title : {type : String},
    content : {type : String},
    createDate : {type: Date, default: Date.now},
    updateDate : {type: Date, default: Date.now}
});
noteSchema.plugin(mongoosePaginate);
const noteModel = mongoose.model('Note',  noteSchema);
module.exports = noteModel;
