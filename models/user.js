const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = mongoose.Schema({
    phone: {
        type: String,
        unique: [true, 'User with current phone number already exists'],
        index: true,
        required: [true, 'A user must have a phone number']
    },
    customId: {
        type: String,
        unique: [true, 'User with current id already exists'],
        index: true,
        required: [true, 'A user must have customId']
    },
    password: {
        type: String,
        required: [true, 'A user must have password']
    }
});

schema.plugin(uniqueValidator);

module.exports = mongoose.model('User', schema);