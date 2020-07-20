// import { Server } from "http";

// const express = require('express');
const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// URL to get username and room name 
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// console.log(username, room);
// Server.log(username, room);
// Mesage form server


// join chat room
socket.emit('joinRoom', {username, room});

// get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener('submit', (ele) => {
    ele.preventDefault();

    // get message text
    const msg = ele.target.elements.msg.value;
    // console.log(msg); 
    
    //Emitting the message to the server 
    socket.emit('ChatMessage', msg);

    // clear input After send
    ele.target.elements.msg.value = '';
    ele.target.elements.msg.focus();
});


// output message to DOM     
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = ` <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p> `;
 
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users){
    userList.innerHTML = `
        ${users.map((user) => `<li>${user.username}</li>`).join('')}
    `;
} 