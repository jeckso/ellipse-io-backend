
var url = require('url')
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
const {Server} = require('ws');
const WebSocket = require('ws');
var cors = require('cors');
const bodyparser = require('body-parser');
var mongoose = require('mongoose');
var vitalsController = require('./controllers/vitals');
var authRouter = require('./auth/AuthController');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var socket = require('./socket/websocket')
var db = require('./config/db');

console.log("connecting--", db);
mongoose.connect(db.url); //Mongoose connection created

app.use(cors())
//var mysql = require("mysql");
app.use(bodyparser.urlencoded({extended: false}))

app.use(bodyparser.json())
app.options('*', cors());


app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

const port = process.env.PORT || 3000;
let server = app.listen(port, () => console.log(`listen on port ${port}..`));
//WEB SOCKET PART
function authenticate(request,callback) {
    users.loginUsers(request);
}
//const wss = new Server({ server });
const wss1 = new WebSocket.Server({server: server, path: "/mobile"});
const wss2 = new WebSocket.Server({server: server, path: "/web"});

console.log("server");
console.log(server);

console.log("wss1: ");
console.log(wss1);

console.log("wss2: ");
console.log(wss2);

console.log("wss1: " + wss1);
console.log("wss2: " + wss2);

wss1.on('connection', function connection(ws) {
    ws.send("WEBSOCKET1 TEST");
});

wss2.on('connection', function connection(ws) {
    ws.send("WEBSOCKET2 TEST");
});

wss2.on('message', function connection(ws) {
    ws.send("WEBSOCKET2 TEST");
    console.log(ws);
});

wss1.on('message', function connection(ws) {
    ws.send("WEBSOCKET1 TEST");
    console.log(ws);
});

wss2.on('error', function connection(error) {
    ws.send("WEBSOCKET2 TEST " + error);
    console.log("WS_2 " + error);
});

wss1.on('error', function connection(error) {
    ws.send("WEBSOCKET1 TEST " + error);
    console.log("WS_1 " + error);
});

// server.on('upgrade', function upgrade(request, socket, head) {
//     // This function is not defined on purpose. Implement it with your own logic.
//     authenticate(request, (err, client) => {
//         if (err || !client) {
//             socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
//             socket.destroy();
//             return;
//         }
//
//         wss.handleUpgrade(request, socket, head, function done(ws) {
//             wss.emit('connection', ws, request, client);
//         });
//     });
// });


