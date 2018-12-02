var express = require('express')
var app = express()
var server = require('http').Server(app);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/front-end/index.html');
})

app.use('/front-end', express.static(__dirname + '/front-end'));

app.listen(3000);
