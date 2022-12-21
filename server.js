const cors = require('cors')
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const { Server: IOServer } = require("socket.io");
const io = new IOServer(server, { cors: { origin: '*', } });

app.use(cors())
app.use(express.static("public/"));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    console.log(`Socket.io : ${socket.id} is connected`);
    socket.on('disconnect', () => {
        console.log(`Socket.io : ${socket.id} is disconnected`);
    });

    socket.on('join', function (data) {
        console.log(data)
        if(!data.room || !data.name || data.name === "" || data.room === "") return;
        socket.join(data.room);
        io.sockets.in(data.room).emit('join_info', {uid:socket.id, name:data.name});
    });
    socket.on('leave', function (data) {
        socket.leave(data.room);
    });
    socket.on('send', (data) => {
        if(!data.room || !data.name || data.name === "" || data.room === ""|| !data.message || data.message === "") return;
        io.sockets.in(data.room).emit('message', {uid:socket.id,name:data.name,message:data.message});
    });
});

io.of("/").adapter.on("leave-room", (room, id) => {
    if (room == id) return;
    io.sockets.in(room).emit('leave_info', {uid:id});
});

server.listen(3000, '0.0.0.0', () => {
    console.log('api & socket.io listening on 3000');
});