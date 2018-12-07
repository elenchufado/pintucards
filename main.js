var mongojs = require('mongojs');
var db = mongojs('localhost:27017/pintucards', ['users','flashCards']);
var express = require('express');
var app = express();
var http = require('http').Server(app);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/front-end/index.html');
})

app.use('/front-end', express.static(__dirname + '/front-end'));

var server = app.listen(2000);
console.log("Server started");

// Socket IO
//cb stands for "Call Backs", because Data Bases are asyncronous
var isUsernameTaken = function(data,cb) {
  db.users.find({username:data.nickname}, function(err,res) {
    if(res.lenght > 0){
      cb(true);
    } else {
      cd(false);
    }
  });
};

var addUser = function(data,cb) {
  db.users.insert({username:data.nickname}, function(err) {
    cb();
  });
};

var socket_list = [];
var line_history = [];
var line_color = [];

var io = require('socket.io').listen(server);
io.on('connection', function(socket) {
  // Gives ID to player
  socket.id = Math.random();
  socket_list[socket.id] = socket;
  var playerName =('' + socket.id).slice(2,7);

  //LogIn
  socket.on('signIp',function(data){
      isUsernameTaken(data,function(res){
          if(res){
              socket.emit('signInResponse',{
                success:false
              });
          } else {
              addUser(data,function(){
                  socket.emit('signInResponse',{
                    success:true
                  });
              });
          }
      });
    });


  // Send history to new clients
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
