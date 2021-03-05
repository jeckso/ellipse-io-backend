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
    let userId = socket.handshake.query.userId;
    if (!userId) {
        next({data: "No user found quried"});
        socket.disconnect(true);
    } else {
        socket.userId = userId
        next();
    }
}).on("connection", (socket) => {
    socket.join(socket.userId);
})

server.of("/customer").use((socket, next) => {
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
        return socket.disconnect(true)
    }
    auth.checkUserToken(token, (err, user) => {
        if (err) {
            next({data: err});
            socket.disconnect(true)
        } else {
            socket.userId = user.customId;
            next();
        }
    });
}).on("connection", (socket) => {
    let user = socket.userId;
    socket.on("monitor", (message) => {
        health_params.createParameter(
            user,
            message.heartRate, (err, param) => {
                server.of("/admin").to(user).emit("params", param);
            }
        )
    });
});
module.exports = server;