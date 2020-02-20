

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var screenactive=false;
var screensocket;
var sockets = [];

http.listen(52300, function(){
    console.log('listening on *:52300');
  });
  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });
  io.on('connection', function(socket){
    console.log(socket.id +" connected");
    sockets.push(socket);
    console.log("Total users: "+(sockets.length));
    io.emit('NewUser',{usercount: (sockets.length)});
    socket.on('isScreen',function(){
      screenactive=true;
      screensocket=socket;
    });
    
   // console.log('a user connected');
    socket.on('Color',function(col){
       // console.log('Color is: ' + col);
        socket.broadcast.emit('Changecolor', { color: col });
    });

    socket.on('isScreen', function(){
        screenactive=true;
    });
    socket.on('disconnect', function(){
      sockets.splice(sockets.indexOf(socket), 1 );//disconnect not emitting
        io.emit('NewUser',{usercount: (sockets.length)});
        
        console.log(socket.id +' disconnected');
        console.log("Total users: "+(sockets.length));
        
      });
  });
  
  