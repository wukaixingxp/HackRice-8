var http = require('http'), io = require('socket.io');

// Start the server at port 8080
var server = http.createServer(function(req, res){

    // Send HTML headers and message
    res.writeHead(200,{ 'Content-Type': 'text/html' });
    res.end('<h1>Lunatic Jump!</h1>');
});

server.listen(80);
// var WebSocketServer = require('ws').Server;
// var wss = new WebSocketServer({
//     server: server
// });
var serv = io.listen(server);
console.log("Server started.");

var SOCKET_LIST = {};
var user1Input = false;
var user2Input = false;
var cur = 0;
var user1ID = 673;
var user2ID  = 839;
var user1Ready;
var user2Reary;
serv.on('connection', function(socket) {
    console.log('socket connection' + cur);
    if (cur < 2) {
        socket.id = cur;
        cur++;
        console.log(socket.id);
        SOCKET_LIST[socket.id] = socket;
    } else {
        cur++;
        socket.id = 999
        console.log('user number more than limit' + cur)
    }
    socket.on('disconnect', function () {
        for (var i in SOCKET_LIST) {
            delete SOCKET_LIST[i]
        }
        SOCKET_LIST = {};
        cur = 0
        console.log('player left:' + socket.id);
    });
    socket.on('VoiceInput', function (data) {
        if (socket.id === 0) {
            user1Input = data.input
            console.log('user1Input' + data.input);
        }
        if (socket.id === 1) {
            user2Input = data.input
            console.log('user2Input' + data.input);
        }
    });
    socket.on('upgrade', function (req, socket, head) {
        server.handleUpgrade(req, socket, head);
    });
    socket.on('contextID', function (data) {
        console.log(socket.id + data)
            if (socket.id === 0){
                user1ID = data.ID;
                console.log('user1ID'+ user1ID);
            }
            if (socket.id === 1){
                user2ID = data.ID;
                console.log('user2ID'+ user2ID);
            }
            function checkID() {
                if(user1ID !== user2ID) {
                    if (SOCKET_LIST.length > 0){
                        setTimeout(checkID, 300);
                        console.log(user1ID+"waiting for players"+user2ID)/* this checks the flag every 300 milliseconds*/
                    }
                } else {
                    for(var i in SOCKET_LIST){
                        var socket = SOCKET_LIST[i];
                        socket.emit('Ready', {
                            ready: true
                    });
                }
            }

            }
        checkID()

    });

});



setInterval(function(){

    if (user1Input &&  user2Input)
    {
        for(var i in SOCKET_LIST){
            var socket = SOCKET_LIST[i];
            socket.emit('Move', {
                move: 'up'
            });
        }
        console.log('Server up')

    }
    if (user1Input &&  !user2Input)
    {
        for(var i in SOCKET_LIST){
            var socket = SOCKET_LIST[i];
            socket.emit('Move', {
                move: 'left'
            });
        }
        console.log('Server left')
    }
    if (!user1Input &&  user2Input)
    {
        for(var i in SOCKET_LIST){
            var socket = SOCKET_LIST[i];
            socket.emit('Move', {
                move: 'right'
            });
        }
        console.log('Server right')
    }
},1000/10);