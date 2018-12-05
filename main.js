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
var socket_list = [];
var line_history = [];
var line_color = [];

var io = require('socket.io').listen(server);
io.on('connection', function(socket) {
  // Gives ID to player
  socket.id = Math.random();
  socket_list[socket.id] = socket;
  var playerName =('' + socket.id).slice(2,7);

  // Send history to new clients
  for (var i in line_history){
    socket.emit('draw_line', {
      line: line_history[i],
      color: line_color[i]
    });
  }

  socket.on('draw_line', function(data) {
    //Add to line_history
    line_history.push(data.line);
    line_color.push(data.color);
    //Send to al clients
    io.emit('draw_line', {
      line: data.line,
      color: data.color
    });
  });

  socket.on('clear_canvas', function() {
    io.emit('clear_canvas', true);
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
