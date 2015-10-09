'use strict';
// Implment a webSocket server with connection status checker.


var WebSocketServer = require('ws').Server, wss = new WebSocketServer({ port: 8090 });

wss.on('connection', function connection(ws) {

  //
  console.log('connected!');


  //
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });


  // Implement connecton checker
  ws.on('pong', function(){
    console.log('pong!');
    setTimeout(function(){      
      try{
        ws.ping();
        console.log('ping!');
      }
      catch(e){
      	console.log(e);
        ws.close();
      }
    }, 1000);
  });
  ws.ping();

});
