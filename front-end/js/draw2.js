var socket;
var myCanvasContext;

function setup() {
  var myCanvas = createCanvas(550, 400);
  myCanvas.parent('ctx2');
  background(102);

  var socket = io();

  socket.on('drawLine', function(data) {
    stroke(255);
    line(data.positionX, data.positionY, data.prePositionX, data.prePositionY);
  });

  socket.on('clearCanvas', function(data) {
    if (data) {
      document.getElementsByClassName('p5Canvas')[0].getContext('2d').clearRect(0,0,550,400);
    }
  })
}


function draw() {
  stroke(255);
  if (mouseIsPressed === true) {
    line(mouseX, mouseY, pmouseX, pmouseY);
    sendMouse(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function sendMouse(x, y, pX, pY) {
  var mousePosition = {
    positionX : x,
    positionY : y,
    prePositionX : pX,
    prePositionY : pY
  };
  socket.emit('drawLine', mousePosition);
}

//Send package to clear canvas
function clearCanvas() {
  socket.emit('clearCanvas', true);
}
