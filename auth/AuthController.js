var express = require('express');
var router = express.Router();
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var VerifyToken = require('./VerifyToken');
var mysql = require('../database');
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file

app.options('*', cors());
router.post('/login', function (req, res) {
    req.header("Access-Control-Allow-Origin", "*");
    req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");

    var testPassword = "$2a$08$8GiRharrz4xN8ekyfmkMSehJ.4Bgio2HqSIO0cFW1S6h.d5lZQv9a";
    var testLogin = "+380997099357";
  // console.log(hashedPassword);
    var passwordIsValid = bcrypt.compareSync(req.body.password, testPassword);
    if (!passwordIsValid || testLogin!=req.body.username) return res.status(401).send({auth: false, token: null});

    var token = jwt.sign({id: "+380997099357"}, config.secret, {
        expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({auth: true, token: token});

    // User.findOne({ email: req.body.email }, function (err, user) {
    //     if (err) return res.status(500).send('Error on the server.');
    //     if (!user) return res.status(404).send('No user found.');
    //
    //     // check if the password is valid
    //     var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    //     if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    //
    //     // if user is found and password is valid
    //     // create a token
    //     var token = jwt.sign({ id: user._id }, config.secret, {
    //         expiresIn: 86400 // expires in 24 hours
    //     });
    //
    //     // return the information including token as JSON
    //     res.status(200).send({ auth: true, token: token });
    // });

});

router.get('/logout', function (req, res) {
    res.status(200).send({auth: false, token: null});
});


router.post('/register', function (req, res) {
    req.header("Access-Control-Allow-Origin", "*");
    req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    res.status(200).send({  registered: true } );

});

router.get('/me', VerifyToken, function (req, res, next) {


    //  if (err) return res.status(500).send("There was a problem finding the user.");
    // if (!user) return res.status(404).send("No user found.");
    res.status(200).send("MMM Let's have sex");
    // res.status(200).send(user);


});

module.exports = router;