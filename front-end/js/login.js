var logInDiv = document.getElementById('logInDiv');
var nickname = document.getElementById('nickname');
var confirmNickname = document.getElementById('confirmNickname');

confirmNickname.onclick = function() {
  socket.emit('signIn',{
    nickname: nickname.value
  })
};

socket.on('signInResponse', function(data) {
  if (data.success) {
    logInDiv.style.display = 'none';
    gameDiv.style.display = 'inline-block';
  } else {
    alert('Username already taken... Try again.');
  }
});
