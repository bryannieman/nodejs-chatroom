var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/public', express.static('public'));  //mapping /public folder to the world as /public

var port=740;		//port used for server

var remoteip;		//remote IP in full
var shortip;		//remote IP in short



app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  //console.log(remoteip);
});

io.on('connection', function(socket){
  var dtCur;		//current date time
  var blocks;		//keeping IP portions array
  var s;
  
  remoteip = socket.client.conn.remoteAddress;
  //var blocks = remoteip.split(":");
  //shortip = blocks[blocks.length-1];
  blocks = remoteip.split(".");
  shortip = blocks[2] + "." + blocks[3] ;
  //console.log(socket.request);
  dtCur = new Date();
  dtStr = dtCur.getHours() + ":" + dtCur.getMinutes();
  
  // CONNECTED EVENT
  s = [ dtStr,  " [", shortip, "] CONNECTED"].join("");
  io.emit('status_msg', s);
  s = [ dtStr,  " [", remoteip, "] CONNECTED"].join("");
  console.log(s);
  
  // DISCONNECTED EVENT
  socket.on('disconnect', function(){
    s = [ dtStr,  " [", shortip, "] DISCONNECTED"].join("");
    io.emit('status_msg', s);
    s = [ dtStr,  " [", remoteip, "] DISCONNECTED"].join("");
    console.log(s);
  });
  
  // SEND MESSAGE EVENT
  socket.on('chat_msg', function(data){
    var nickname = data.nickname;
    var message  = data.message;
    
    s = [dtStr,  " [", shortip, "] ", nickname, " : ",  message].join("");
    io.emit('chat_msg', s);
    s = [dtStr,  " [", remoteip, "] ", nickname, " : ",  message].join("");
    console.log(s);
    
  });


});

http.listen(port, function(){
  console.log('listening on port ' + port);
});