var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');
const pool = require('generic-pool');;
var logger = require('morgan');
const bodyparser = require('body-parser');

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
//var mysqlConnection = mysql.createConnection('mysql://b3020c234f7bf9:c2f9aeec@eu-cdbr-west-02.cleardb.net/heroku_a055cf7e4179e62?reconnect=true');
  //  mysqlConnection.connect();


const port = process.env.PORT || 3000;
app.listen(port,()=> console.log(`listen on port ${port}..`));

