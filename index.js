var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/public', express.static('public'));

var port=740;

var remoteip;
var shortip;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  //console.log(remoteip);
});

io.on('connection', function(socket){
  remoteip = socket.client.conn.remoteAddress;
  var blocks = remoteip.split(":");
  shortip = blocks[blocks.length-1];
  //var blocks = remoteip.split(".");
  //shortip = blocks[2] + "." + blocks[3] ;
  //console.log(socket.request);
  
  io.emit('status message', '[' + shortip + '] connected');
  console.log('[' + remoteip + '] connected');
  
  socket.on('chat message', function(msg){
    io.emit('chat message', '[' + shortip + '] ' + msg);
    console.log('message: [' + remoteip + '] ' + msg);
  });

  socket.on('disconnect', function(){
    io.emit('status message', '[' + shortip + '] disconnected');
    console.log(remoteip +' disconnected');
  });
});

http.listen(port, function(){
  console.log('listening on port ' + port);
});