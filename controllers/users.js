const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');

const userProjection = {
    "password": false
};
exports.createUser = (body, callback) => {
    body.password = bcrypt.hashSync(body.password, 8);
    let user = new User(body);
    user.save(callback);
};

exports.findUserByPhone = (phone, callback) => {
    User.findOne({"phone": phone}, callback);
};

exports.findUserById = (id, callback) => {
    User.findById(id, userProjection, callback);
};

exports.findAllUsers = (phone, customId, limit, offset, callback) => {
    let conditions = {};
    if (phone) {
        conditions.phone = phone;
    }
    if (customId) {
        conditions.customId = customId;
    }
    User.find(conditions, userProjection, {skip: offset, limit: limit}, callback);
};

exports.updateUser = (id, body, callback) => {
    if (body.password) {
        body.password = bcrypt.hashSync(body.password, 8);
    }
    User.findByIdAndUpdate(id, body, {runValidators: true, context: 'query', projection: userProjection}, callback)
};

exports.deleteUserById = (id, callback) => {
    User.findByIdAndDelete(id, {projection: userProjection}, callback);
};

exports.login = (phone, password, callback) => {
    exports.findUserByPhone(phone, (error, user) => {
        if (error) {
            return callback(error, null)
        }
        if (bcrypt.compareSync(password, user.password)) {
            callback(null, user)
        } else {
            callback(new mongoose.Error.ValidatorError({message: "Irregular username or password"}), null)
        }
    });
};

