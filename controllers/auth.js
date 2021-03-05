const config = require('../config/secret');
const admin = require('./admin');
const users = require('./users');
const jwt = require('jsonwebtoken');

exports.loginAdmin = (req, res) => {
    let {username, password} = req.body;
    if (!username) {
        return res.status(400).send({"message": "Phone can not be empty"});
    }
    if (!username) {
        return res.status(400).send({"message": "Password can not be empty"});
    }
    admin.login(req.body, password, (err, admin) => {
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
            res.status(500).send({message: "Unknown error"});
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
            res.status(500).send({message: "Unknown error"});
        }
    })
};

exports.verifyAdminToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (!token)
        return res.status(403).send({auth: false, message: 'No token provided.'});
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    if (!token) {
        return res.status(403).send({auth: false, message: 'No token provided.'});
    }
    if (!decoded.isAdmin) {
        return res.status(403).send({auth: false, message: 'Forbidden role.'});
    }
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            return res.status(500).send({"message": 'Failed to authenticate token.'});
        }
        admin.findAdminById(decoded.id, err => {
            if (err) {
                return res.status(500).send(err);
            } else {
                next();
            }
        });
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

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            return res.status(500).send({"message": 'Failed to authenticate token.'});
        }
        users.findUserById(decoded.id, err => {
            if (err) {
                return res.status(500).send(err);
            } else {
                next();
            }
        });
    });
}

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
        console.log(e);
        return {}
    }
}