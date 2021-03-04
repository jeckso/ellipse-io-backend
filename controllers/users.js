const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.createUser = (body, callback) => {
    body.password = bcrypt.hashSync(body, 8);
    let user = new User(body);
    user.save(callback);
};

exports.findUserByPhone = (phone, callback) => {
    User.findOne({"phone": phone}, callback);
};

exports.findUserById = (id, callback) => {
    User.findById(id, callback);
};

exports.findAllUsers = (phone, customId, limit, offset, callback) => {
    let conditions = {};
    if (phone) {
        conditions.phone = phone;
    }
    if (customId) {
        conditions.customId = customId;
    }
    User.find(conditions, {}, {skip: offset, limit: limit}, callback);
};

exports.updateUser = (id, body, callback) => {
    User.findByIdAndUpdate(id, body, {runValidators: true, context: 'query'}, callback)
};

exports.deleteUserById = (id, callback) => {
    User.findByIdAndDelete(id, {}, callback);
};

