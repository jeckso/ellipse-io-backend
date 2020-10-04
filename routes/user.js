var express = require('express');
var router = express.Router();
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
var VerifyToken = require('../auth/VerifyToken');
const users = require('../controllers/user');

/**
 * Configure JWT
 */
var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file

app.options('*', cors());
router.post('/notes', VerifyToken, function (req, res) {
    if(req.body.title = ""){

            return res.status(400).json({message : "No title!"});

    }
else{
        users.createNote(req,res);
    }

});
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

router.get('/notes', VerifyToken, function (req, res) {
    console.log(req.query)
    if(isEmptyObject(req.query)){ console.log("nety"); users.getNotes(req,res);
    }
    else{
        console.log("est");
    }


});
router.patch('/notes/:id', VerifyToken, function (req, res) {
    if(req.body.title = ""){

        return res.status(400).json({message : "No title!"});

    }
    else {
        users.updateNote(req, res);
    }
});

module.exports = router;
