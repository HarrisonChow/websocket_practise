var app = require("http").createServer();
var io = require("socket.io")(app);

var PORT = 9999;

var clientCount = 0;

var socketMap = {};

app.listen(PORT);

var bindListener = function(socket, event) {
    socket.on(event, function(data) {
        if (socket.clientNum % 2 == 0) {
            if (socketMap[socket.clientNum - 1]) {
                socketMap[socket.clientNum - 1].emit(event,data);
            }
        } else {
            if (socketMap[socket.clientNum + 1]) {
                socketMap[socket.clientNum + 1].emit(event,data);
            }
        }
    });
}

io.on('connection', function(socket) {
    clientCount = clientCount + 1;
    socket.clientNum = clientCount;
    socketMap[clientCount] = socket;

    if (clientCount % 2 == 1) {
        socket.emit('waiting', 'waiting for another player');
    } else {
        if (socketMap[(clientCount - 1)]) {
            socket.emit('start');
            socketMap[(clientCount - 1)].emit('start');
        } else {
            socket.emit('leave');
        }
    }
    bindListener(socket, 'init');
    bindListener(socket, 'next');
    bindListener(socket, 'moveDown');
    bindListener(socket, 'moveLeft');
    bindListener(socket, 'moveRight');
    bindListener(socket, 'squareFixed');
    bindListener(socket, 'fall');
    bindListener(socket, 'rotate');
    bindListener(socket, 'line');
    bindListener(socket, 'time');
    bindListener(socket, 'lose');
    bindListener(socket, 'bottomLines');
    bindListener(socket, 'addTailLines');


    //
    // socket.on('message', function(str) {
    //     io.emit('message', socket.nickname + ' says: ' + str);
    // })

    socket.on('disconnect', function() {
        if (socket.clientNum % 2 == 0) {
            if (socketMap[socket.clientNum - 1]) {
                socketMap[socket.clientNum - 1].emit('leave');
            }
        } else {
            if (socketMap[socket.clientNum + 1]) {
                socketMap[socket.clientNum + 1].emit('leave');
            }
        }
        delete(socketMap[socket.clientNum]);
    });
});
