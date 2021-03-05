const mongoose = require('mongoose');
const schema = mongoose.Schema({
    userCustomId: {
        type: String,
        index: true,
        required: [true, 'A note must have a reference to user'],
    },
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    content: {
        type: String
    },
    createDate: {
        type: Date,
        required: [true, 'Creation date is Required']
    },
    updateDate: {
        type: Date,
        required: [true, 'Updating date is Required']
    }
});
module.exports = mongoose.model('Note', schema);