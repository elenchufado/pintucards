//document.addEventListener('DOMContentLoaded', function() {
  //Mouse obect
  var mouse = {
    click: false,
    move: false,
    position: {
      x: 0,
      y: 0
    },
    positionPrev: false,
    color: 'black'
  };

  var canvas = document.getElementById('ctx');
  var context = canvas.getContext('2d');
  var width = 500;
  var height = 500;
  var socket = io();

  // set canvas to full browser width/height
  canvas.width = width;
  canvas.height = height;

  //Mouse click
  canvas.onmousedown = function(e) {
    mouse.click = true;
  };
  //Mouse unclick
  canvas.onmouseup = function(e) {
    mouse.click = false;
  };

  //Mouse movement in x and y
  canvas.onmousemove = function(e) {
    //Normalize mouse position to range 0.0 - 1.0
    mouse.position.x = e.clientX / width;
    mouse.position.y = e.clientY / height;
    mouse.move = true;
  };

  //Color
  function colorPicker(obj) {
    switch (obj.id) {
        case "green":
            mouse.color = "green";
            break;
        case "blue":
            mouse.color = "blue";
            break;
        case "red":
            mouse.color = "red";
            break;
        case "yellow":
            mouse.color = "yellow";
            break;
        case "orange":
            mouse.color = "orange";
            break;
        case "black":
            mouse.color = "black";
            break;
      }
  }

  //Send package to clear canvas
  function clearCanvas() {
    socket.emit('clear_canvas', true);
  }

  //Callback from server to clear canvas
  socket.on('clear_canvas', function(){
    context.clearRect(0, 0, width, height);
  });

  //Draw line received from the server
  socket.on('draw_line', function(data) {
    var line = data.line;
    context.strokeStyle = data.color;
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(line[0].x * width, line[0].y * height);
    context.lineTo(line[1].x * width, line[1].y * height);
    context.stroke();
  });

  //Sends info to server every 25ms
  function mainLoop() {
     if (mouse.click && mouse.move && mouse.positionPrev) {
        socket.emit('draw_line', {
          line: [ mouse.position, mouse.positionPrev],
          color: mouse.color
        });
        mouse.move = false;
     }
     mouse.positionPrev = {
       x: mouse.position.x,
       y: mouse.position.y
     };
     setTimeout(mainLoop, 25);
  }
  mainLoop();

//});
