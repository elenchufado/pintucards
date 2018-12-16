var mongojs = require('mongojs');
var db = mongojs('localhost:27017/pintucards', ['users','flashCards']);
var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use('/', express.static(__dirname + '/front-end'));

var server = app.listen(2000);
console.log("Server started");

// Socket IO
//cb stands for "Call Backs", because Data Bases are asyncronous
var isUsernameTaken = function(data, cb) {
  db.users.find({username:data.nickname}, function(err, res) {
    if(res.length > 0){
      cb(true);
    } else {
      cb(false);
    }
  });
}

var addUser = function(data, cb) {
  if (data.nickname === '') {
    console.log('error');
  } else {
    console.log("New user added");
    db.users.insert({username:data.nickname}, function(err) {
      cb();
    });
  }
}

var socket_list = [];

var io = require('socket.io').listen(server);
io.on('connection', function(socket) {
  /* Gives ID to player
  socket.id = Math.random();
  socket_list[socket.id] = socket;*/


  var validation = function(data) {
    if (data) {
      socket.emit('signResponse',{success:true});
    } else {
      socket.emit('signResponse',{success:false});
    }
  }


  //LogIn
  socket.on('signIn',function(data){
    console.log("Listen the package");
      isUsernameTaken(data,function(res){
        console.log("before conditional true");
          if(res){
            console.log("after conditional true");
            validation(false);
          } else {
            console.log("before conditional false");
              addUser(data,function(){
                console.log("after conditional false");
                validation(true);
              });
          }
      });
  });

  /* Send history to new clients
  for (var i in line_history){
    socket.emit('drawLine', {
      line: line_history[i],
      color: line_color[i]
    });
  }

  socket.on('drawLine', function(data) {
    //Add to line_history
    line_history.push(data.line);
    line_color.push(data.color);
    //Send to al clients
    io.emit('draw_line', {
      line: data.line,
      color: data.color
    });
  });*/

  socket.on('drawLine', function(data) {
    socket.broadcast.emit('drawLine', data)
  });

  socket.on('clearCanvas', function() {
    io.emit('clearCanvas', true);
  });

  socket.on('correctAnswer', function() {
    for (var i in socket_list){
      socket_list[i].emit('addToChat', '<span>' + playerName + ' got the correct answer </span>');
    }
  });

  socket.on('sendChatServer', function(data) {
    for (var i in socket_list){
      socket_list[i].emit('addToChat', playerName + ': ' + data);
    }
  });

});
