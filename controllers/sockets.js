const auth = require('./auth');
const health_params = require('./health_params');

const io = require("socket.io");
const server = new io.Server();

// Adding authorization
server.of("/admin").use((socket, next) => {
    let token = socket.handshake.auth.token;
    if (!token) {
        next({data: "Not authorized"});
        return socket.disconnect(true);
    }
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    if (!token) {
        next({data: "Not authorized"});
        return socket.disconnect(true);
    }
    auth.checkAdminToken(token, (err, admin) => {
        if (err) {
            next({data: err});
            socket.disconnect(true);
        } else {
            next();
        }
    });
}).use((socket, next) => {
    let userId = socket.handshake.query;
    if (!userId) {
        next({data: "No user found quried"});
        socket.disconnect(true);
    } else {
        socket.userId = query.userId
        next();
    }
}).on("connection", (socket) => {
    console.log("SOCKET= " + socket.id);
    socket.join(socket.userId);
}).on("connect_error", (err) => {
    console.log(err.message); // prints the message associated with the error
});

server.of("/customer").use((socket, next) => {
    let token = socket.handshake.auth.token;
    console.log("token= " + token);
    if (!token) {
        next({data: "Not authorized"});
        return socket.disconnect(true);
    }
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    if (!token) {
        next({data: "Not authorized"});
        return socket.disconnect(true)
    }
    auth.checkUserToken(token, (err, user) => {
        if (err) {
            next({data: err});
            socket.disconnect(true)
        } else {
            socket.userId = user._id;
            next();
        }
    });
}).on("connection", (socket) => {
    let user = socket.userId;
    socket.on("monitor", (message) => {
        health_params.createParameter(
            user,
            message.heartRate, (err, param) => {
                console.log("Param " + param + "Error " + err);
                server.of("/admin").to(user).emit("params", param);
            }
        )

    });
});
module.exports = server;