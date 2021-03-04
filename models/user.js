const mongoose = require('mongoose');
var Note = require('./note').schema;
// define our students model
// module.exports allows us to pass this to other files when it is called

const uniqueValidator = require('mongoose-unique-validator');

const schema = mongoose.Schema({
    phone: {
        type: String,
        unique: [true, 'User with current phone already exists'],
        index: true,
        required: [true, 'A user must have an email address']
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
    },
    notes: [Note]
});

schema.plugin(uniqueValidator);

module.exports = mongoose.model('User', schema);