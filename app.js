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

app.use('/api/admin/login', bodyParser.json(), auth.loginAdmin);
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

/**
const io = require("socket.io-client");

const client = io("http://localhost:8080/customer", {
    auth: {
        token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDE4ZjAxNGI4MzRiMjk3NzZmZTlmOSIsInVzZXJuYW1lIjoiKzM4MDk5NzA5OTM1NyIsImN1c3RvbUlkIjoiTVlfQ1VTVE9NX0lEIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTYxNDk3MzMxNywiZXhwIjoxNjE1MDU5NzE3fQ.fSq_wfP2fiq8bn18_88GvNoDSlAqPOOk6UwqW2Lvtto"
    },
    reconnectionDelayMax: 2000,
    path: "/socket",
    reconnect: true
});
setInterval(() => {client.emit("monitor", { heartRate: 200 });}, 5000);
client.on('connect_failed', function(){
    console.log('Connection Failed');
});
client.on('connect', function(socket){
    console.log('Connected ' + socket);
});
client.on('disconnect', function () {
    console.log('Disconnected');
});**/