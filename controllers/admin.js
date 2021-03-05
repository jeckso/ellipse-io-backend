// Load required packages
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const mongoose = require('mongoose');

exports.login = (username, password, callback) => {
    Admin.findOne({"username": username}, (error, admin) => {
        if (error) {
            return callback(error, null)
        }
        if (bcrypt.compareSync(password, admin.password)) {
            callback(null, admin)
        } else {
            callback(new mongoose.Error.ValidatorError({"message": "Irregular username or password"}), null)
        }
    });
};

exports.findAdminById = (id,callback) => {
    Admin.findById(id, callback);
}