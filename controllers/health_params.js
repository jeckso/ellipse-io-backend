const HealthParameter = require('../models/health_params');

exports.createParameter = (customUserId, heartRate, callback) => {
    let body = {}
    body.userCustomId = customUserId;
    body.heartRate = heartRate;
    body.createDate = Date()
    let parameter = new HealthParameter(body);
    parameter.save(callback);
};

exports.getAllParameters = (userCustomId, fromDate, toDate, offset, limit, callback) => {
    let condition = {};
    if (userCustomId) {
        condition.userCustomId = userCustomId;
    }
    if (fromDate) {
        if (!condition.createDate) {
            condition.createDate = {};
        }
        condition.createDate.$gt = fromDate;
    }
    if (toDate) {
        if (!condition.createDate) {
            condition.createDate = {};
        }
        condition.createDate.$lt = toDate;
    }
    HealthParameter.find(condition, {}, {skip: offset, limit: limit}, callback);
};

exports.deleteParameter = (id, callback) => {
    HealthParameter.findOneAndDelete(id, callback);
};