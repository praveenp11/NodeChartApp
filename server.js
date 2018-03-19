const express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

const PORT = process.env.PORT || 3000;
users = [];
connections = [];

app.get('/', (req, res) =>{
    //res.send('Welcome to home page.');
    res.sendFile(__dirname + '/web/index.html');
});

io.sockets.on('connection', function(socket){
    connections.push(socket)
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('disconnect', function(data){
        connections.splice(connections.indexOf(socket), 1);
        users.splice(users.indexOf(socket.username), 1);
        updateusernames();
        console.log('user disconnected');
    });

    socket.on('send message', function(data) {
        io.sockets.emit('new message', {msg: data, username : socket.username});
    });

    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateusernames();
    });

    function updateusernames(){
        io.sockets.emit('get users', users);
    }
});

http.listen(PORT, () => {
    console.log('Listening port ', PORT);
})