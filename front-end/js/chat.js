var chatText = document.getElementById('chatText');
var chatForm = document.getElementById('chatForm');
var chatInput = document.getElementById('chatInput');
var socket = io();

socket.on('addToChat', function(data) {
  chatText.innerHTML += '<p>' + data + '</p>';
});

chatForm.onsubmit = function(e) {
  e.preventDefault();
  if (chatInput.value === 'Diana') {
    socket.emit('correctAnswer', chatInput.value);
  } else {
    socket.emit('sendChatServer', chatInput.value);
  }
  chatInput.value = '';
}
