const express = require('express');
const cors = require('cors');

// region setup database
const mongoose = require('mongoose');
const auth = require("./controllers/auth");
const socket = require('./controllers/sockets');
const db = require('./config/db');

mongoose.connect(db.url); //Mongoose connection created

const app = express();
const notes = require('./routes/notes');
const admin = require('./routes/admin');
const healthParams = require('./routes/healt_params');
const bodyParser = require('body-parser');
const logger = require('morgan');

app.use(logger("dev"));
app.use(cors());
app.use('/api/user/notes', bodyParser.json(), auth.verifyUserToken, notes);
app.use('/api/user/health_params', auth.verifyUserToken, healthParams);
app.use('/api/admin', bodyParser.json(), auth.verifyAdminToken, admin);

app.use('/api/administrator/login', bodyParser.json(), auth.loginAdmin);
app.use('/api/user/login', bodyParser.json(), auth.loginUser);

const port = process.env.PORT || 8080;
const http = require('http').createServer(app);

http.listen(port, () => {
    console.log('listening on *:' + port);
});

socket.listen(http, {
    cors: {
        origin: '*',
    },
    path: "/socket"
});
