var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var mongoose = require('mongoose');
var chat = require('./chat');
var userNames = [];
server.listen(3000);

mongoose.connect('mongodb://localhost/chat', function(err){
    if(err){
        console.log(err);
    }else{
       console.log('connected to mongodb');
    }
});

app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection',function(socket){ 
// to display all the usernames
socket.on('new user' , function(data,callback){
    callback(true);
    socket.userName = data;
    userNames.push(socket.userName);    
    io.sockets.emit('userNames',userNames);
});

  //to receive the messege from the client
  socket.on('send messege',function(data){
    var newMsg = new chat({messege : data, userName : socket.userName});
    newMsg.save(function(err){
        if(err) throw err;
         io.sockets.emit('new messege', {msg : data , name : socket.userName});
    })
      //emits the messege that is received from client
           
  });

  socket.on('disconnect',function(data){
      if(!socket.userName) return ;
      userNames.splice(userNames.indexOf(socket.userNames) , 1);      
       io.sockets.emit('userNames',userNames);
  });
});
