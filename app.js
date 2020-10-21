var express = require('express');
const { Server } = require('ws');
var cors = require('cors');
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

const port = process.env.PORT || 3000;
let server = app.listen(port,()=> console.log(`listen on port ${port}..`));
//WEB SOCKET PART
const wss = new Server({ server });
var socketsArray = [];

wss.on('connection', function connection(ws, request, client) {

    var id = request.headers['sec-websocket-key'];
    socketsArray[id] = ws;
    console.log('New Connection id :: ', id);
    ws.send(id);
    function prob(){
        let  data = {
            pulse: Math.random() * (120 - 60 + 1) + 60,
            time: new Date().toLocaleTimeString().slice(0,-6)

        };
        ws.send(JSON.stringify(data));
    }
    ws.on('message', function message(msg) {
        var id = request.headers['sec-websocket-key'];
        socketsArray[id].send("gay porn");

        console.log('Message on :: ', id);
        console.log('On message :: ', msg);
        console.log(`Received message ${msg} from user ${client}`);
    });

    setInterval(prob,1500);
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


