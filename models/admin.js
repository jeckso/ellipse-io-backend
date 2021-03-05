const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schema = mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'Admin with current username already exists'],
        index: true,
        required: [true, 'Admin must have a username']
    },
    password: {
        type: String,
        required: [true, 'Admin password is required']
    }
});
schema.plugin(uniqueValidator);
module.exports = mongoose.model('Admin', schema);