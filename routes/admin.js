var express = require('express');
var router = express.Router();
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var AdminVerify = require('../auth/AdminVerify');
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const admins = require('../controllers/admin');

/**
 * Configure JWT
 */
var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file

app.options('*', cors());
router.post('/login', function (req, res) {
    admins.loginAdmin(req,res);
});
router.post('/register', function (req, res) {
    admins.postAdmin(req,res);
})
router.get('/users', AdminVerify, function (req, res) {
    admins.getUsers(req,res);
})
router.get('/users/:id', AdminVerify, function (req, res) {
    admins.getUsers(req,res);
})
module.exports = router;
