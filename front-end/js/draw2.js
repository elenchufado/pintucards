var socket;
var strokeColor = 'white';

function setup() {
  var myCanvas = createCanvas(550, 400);
  myCanvas.parent('ctx2');
  background(102);

  var socket = io();

  socket.on('drawLine', function(data) {
    stroke(data.strokeColor);
    line(data.positionX, data.positionY, data.prePositionX, data.prePositionY);
  });

  socket.on('clearCanvas', function(data) {
    if (data) {
      setup(); //Restart canvas by redrawing it
    }
  })
}


function draw() {
  stroke(strokeColor);
  if (mouseIsPressed === true) {
    line(mouseX, mouseY, pmouseX, pmouseY);
    sendMouse(mouseX, mouseY, pmouseX, pmouseY, strokeColor);
  }
}

//Function to send mouse data in just one variable
function sendMouse(x, y, pX, pY, color) {
  var mouseDrawingData = {
    positionX : x,
    positionY : y,
    prePositionX : pX,
    prePositionY : pY,
    strokeColor : color
  };
  socket.emit('drawLine', mouseDrawingData);
}

//Send package to clear canvas
function clearCanvas() {
  socket.emit('clearCanvas', true);
}


function colorPicker(obj) {
  switch (obj.id) {
      case 'green':
          strokeColor = 'green';
          break;
      case 'blue':
          strokeColor = 'blue';
          break;
      case 'red':
          strokeColor = 'red';
          break;
      case 'yellow':
          strokeColor = 'yellow';
          break;
      case 'orange':
          strokeColor = 'orange';
          break;
      case 'black':
          strokeColor = 'black';
          break;
    }
}
