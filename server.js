const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'Chat Bot';

// Setting static folders
app.use(express.static(path.join(__dirname, 'public')));

// Running of the server when clint connects
io.on('connection', (socket) => {
    console.log("New Socket connections");

    socket.on('joinRoom', ({username, room}) => {

        const user = userJoin(socket.id, username, room);

        // Join
        socket.join(user.room);

        // Displaying only to the single clint
        socket.emit('message', formatMessage(botName, 'Welcome to Talk_With!!'));

        // Display when a user connects
        // and used for showing all the clints except the active clients
        socket.broadcast.to(user.room).emit('message', formatMessage(botName,  `${user.username} has joined the chat`));
        
        // Send user and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    
    });


    // Listen for chat message
    socket.on('ChatMessage', (msg) => { 
        const user = getCurrentUser(socket.id);

        // console.log(msg);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs After disconnecting
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
            
            // Send user and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });

});


 
const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});