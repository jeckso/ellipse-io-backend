var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file
var Admin = require('../models/admin');
function AdminVerify(req, res, next) {

    // check header or url parameters or post parameters for token
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err)
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        Admin.find({"username":decoded.username}, function (err, admin) {

            if (err) {
                return res.status(500).send(err);
            } else if (admin[0] == null) {
                return res.status(401).send({auth: false, token: null});
                // return false;
            }
        });
        // if everything is good, save to request for use in other routes
        req.body.decoded = decoded.username;
        next();
    });

}

module.exports = AdminVerify;