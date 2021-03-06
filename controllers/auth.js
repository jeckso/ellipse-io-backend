const config = require('../config/secret');
const admin = require('./admin');
const users = require('./users');
const jwt = require('jsonwebtoken');

exports.loginAdmin = (req, res) => {
    let {username, password} = req.body;
    if (!username) {
        return res.status(400).send({"message": "Username can not be empty"});
    }
    if (!password) {
        return res.status(400).send({"message": "Password can not be empty"});
    }
    admin.login(username, password, (err, admin) => {
        if (err) {
            return res.status(401).send(err)
        }
        if (admin) {
            let payload = {
                id: admin._id,
                username: admin.username,
                isAdmin: true
            };
            let token = jwt.sign(payload, config.secret, {expiresIn: 86400});
            res.status(200).send({'authorizationToken': token});
        } else {
            res.status(500).send({"message": "Unknown error"});
        }
    })
};

exports.loginUser = (req, res) => {
    let {phone, password} = req.body;
    if (!phone) {
        return res.status(400).send({"message": "Phone can not be empty"});
    }
    if (!password) {
        return res.status(400).send({"message": "Password can not be empty"});
    }
    users.login(phone, password, (err, user) => {
        if (err) {
            return res.status(401).send(err)
        }
        if (user) {
            let payload = {
                id: user._id,
                username: user.phone,
                customId: user.customId,
                isAdmin: false
            };
            let token = jwt.sign(payload, config.secret, {expiresIn: 86400});
            res.status(200).send({'authorizationToken': token});
        } else {
            res.status(500).send({"message": "Unknown error"});
        }
    })
};

exports.verifyAdminToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (!token)
        return res.status(403).send({"message": 'No token provided.'});
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    if (!token) {
        return res.status(403).send({"message": 'No token provided.'});
    }
    exports.checkAdminToken(token, (err, admin) => {
        if (err) {
            return res.status(401).send({"message": 'Failed to authenticate user.'});
        } else {
            next();
        }
    });
}

exports.verifyUserToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (!token)
        return res.status(401).send({"message": 'Unauthorized'});
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    if (!token) {
        return res.status(401).send({"message": 'Unauthorized'});
    }
    exports.checkUserToken(token, (err, user) => {
        if (err) {
            return res.status(401).send({"message": 'Failed to authenticate user.'});
        } else {
            next();
        }
    });
}

exports.checkUserToken = (token, callback) => {
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return callback(err, null);
        }
        users.findUserById(decoded.id, (err, user) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, user);
            }
        });
    });
};

exports.checkAdminToken = (token, callback) => {
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return callback(err, null);
        }
        if (!decoded.isAdmin) {
            return callback({message: 'Forbidden role.'}, null);
        }
        admin.findAdminById(decoded.id, (err, user) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, user);
            }
        });
    });
};

exports.parsePayload = (token) => {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let buff = new Buffer(base64, 'base64');
    let payloadinit = buff.toString('ascii');
    return JSON.parse(payloadinit);
}

exports.receivePayload = (req) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    token = token.slice(7, token.length);
    try {
        return exports.parsePayload(token);
    } catch (e) {
        return {}
    }
}