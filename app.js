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
function authenticate(request, callback) {
    users.loginUsers(request);
}

//const wss = new Server({ server });
const admin = new WebSocket.Server({server: server, path: '/admin'});
const android = new WebSocket.Server({server: server, path: '/android'});

admin.on('connection', (ws, req) => {
    admin.isAlive = true;
    ws.on('message', message => {
        ws.send(message)
    });
});

android.on('connection', (ws, req) => {
    ws.on('message', message => {
        if (admin.isAlive === true) {
            admin.clients.forEach(cl => {
                if (cl !== ws && cl.readyState === WebSocket.OPEN) {
                    cl.send(message)
                }
            });
        }
    });
});

// const client = new WebSocket("ws://localhost:8081/android");
// client.onopen = (ev) => {
//     let a = 0;
//     setInterval(() => {
//         ev.target.send("HUY" + a);
//         a++;
//     }, 500)
// };

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


