const mongoose = require('mongoose');
const schema = mongoose.Schema({
    heartRate: {
        type: Number,
        required: [true, 'Heart rate is required']
    },
    userCustomId: {
        type: String,
        index: true,
        required: [true, 'Reference to user custom id is obligatory'],
    },
    createDate: {
        type: Date,
        required: [true, 'Creation date is Required']
    }
});

module.exports = mongoose.model('HealthParameter', schema);