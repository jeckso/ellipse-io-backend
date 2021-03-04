const express = require('express');
const cors = require('cors');

// region setup database
const mongoose = require('mongoose');
const db = require('./config/db');

mongoose.connect(db.url); //Mongoose connection created

const app = express();
const users = require('./routes/users');

app.options('*', cors());
app.use('/users', users);

const port = process.env.PORT || 3000;
const http = require('http').Server(app);

http.listen(port, () => {
    console.log('listening on *:3000');
});

/*
const cors = require('cors');
const bodyparser = require('body-parser');

const mongoose = require('mongoose');
const authRouter = require('./auth/AuthController');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const VerifyToken = require('../auth/VerifyToken');

const db = require('./config/db');
console.log("connecting--", db);
mongoose.connect(db.url); //Mongoose connection created
const app = express();
app.use(cors())
//var mysql = require("mysql");
app.use(bodyparser.urlencoded({extended: false}))

app.use(bodyparser.json())
app.options('*', cors());


app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
//var mysqlConnection = mysql.createConnection('mysql://b3020c234f7bf9:c2f9aeec@eu-cdbr-west-02.cleardb.net/heroku_a055cf7e4179e62?reconnect=true');
//  mysqlConnection.connect();


const port = process.env.PORT || 3000;
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use('/static', express.static('node_modules'));

socketAuth = function (token, callback) {
    VerifyToken(token, function (err, res) {  // method to get the user of this token from the DB and validate the connection.
        if (err) {
            return callback(true, false);
        } else {
            return callback(null, res);
        }
    });
};

io.set('authorization', function (handshakeData, callback) {
    console.log("Inside Auth Handshake");
    console.log(handshakeData._query);

    if (handshakeData._query && handshakeData._query.token) {
        var token = handshakeData._query.token;
        socketAuth(token, function (err, res) {
            if (err) {
                console.log(err);
                console.log("** Socket Authentication Done :" + false);
                return callback(null, false);
            } else {
                console.log(" *** Socket Authentication Done :" + res);
                return callback(null, res);
            }
        });
    } else {
        console.log("*Socket Authentication connection: false , Done :" + false);
        return callback(null, false);
    }
});

io.use((socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
        // find existing session
        const session = sessionStore.findSession(sessionID);
        if (session) {
            socket.sessionID = sessionID;
            socket.userID = session.userID;
            socket.username = session.username;
            return next();
        }
    }
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error("invalid username"));
    }
    // create new session
    socket.sessionID = randomId();
    socket.userID = randomId();
    socket.username = username;
    next();
});

io.on('connection', (socket) => {
    const user = socket.user;
    if (isAdmin(user)) {
        socket.join(user.pacientId);
    } else {
        socket.on('health-params', (socket, msg) => {
            io.to(user).emit("health-params", JSON.parse(msg));
        });
    }
});


http.listen(port, () => {
    console.log('listening on *:3000');
});

const ioClient = require("socket.io-client");

const socket = ioClient("http://localhost:3000/", {
    reconnectionDelayMax: 10000
});

socket.on('connect', (socket) => {

});

socket.emit('CH01', 'me', 'test msg');
*/
