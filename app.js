var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');
const pool = require('generic-pool');;
var logger = require('morgan');
const bodyparser = require('body-parser');
const WebSocket = require('ws'); // new
var mongoose = require('mongoose');
var authRouter = require('./auth/AuthController');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var db = require('./config/db');
console.log("connecting--",db);
mongoose.connect(db.url); //Mongoose connection created
var app = express();
app.use(cors())
//var mysql = require("mysql");
app.use(bodyparser.urlencoded({ extended: false }))

app.use(bodyparser.json())
app.options('*', cors());


app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

const port = process.env.PORT || 3000;
let server = app.listen(port,()=> console.log(`listen on port ${port}..`));
//WEB SOCKET PART
var io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('a user connected');
});
io.on('message', function (message) {
    console.log("Got message: " + message);
    io.sockets.emit('pageview', { 'url': message });
});