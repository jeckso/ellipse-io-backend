const express = require('express');
const cors = require('cors');

// region setup database
const mongoose = require('mongoose');
const auth = require("./controllers/auth");
const db = require('./config/db');

mongoose.connect(db.url); //Mongoose connection created

const app = express();
const notes = require('./routes/notes');
const admin = require('./routes/admin');
const bodyParser = require('body-parser');


app.options('*', cors());

app.use('/api/user/notes', bodyParser.json(), auth.verifyUserToken, notes);
app.use('/api/admin', bodyParser.json(), auth.verifyAdminToken, admin);

app.use('/api/admin/login', bodyParser.json(), auth.loginAdmin);
app.use('/api/user/login', bodyParser.json(), auth.loginUser);

const port = process.env.PORT || 3000;
const http = require('http').Server(app);

http.listen(port, () => {
    console.log('listening on *:3000');
});