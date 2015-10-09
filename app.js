'use strict';
// Implment a webSocket server with connection status checker.


//
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        port: 8090
    });


//
wss.on('connection', function connection(ws) {

    //
    console.log('connected!');


    //
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });


    // Implement connecton checker
    (function() {


        //
        var closeConnection = function(ws) {
            console.log('Remote Client no pong or ping error!');
            ws.close();
        };


        //
        var recvPong = true;
        var pingFunc;


        //
        ws.on('pong', function() {
            recvPong = true;
            console.log('pong!');
        });


        //
        setTimeout(pingFunc = function() {
            if (recvPong) {
                try {
                    ws.ping();
                    console.log('ping!');
                    setTimeout(pingFunc, 1000);
                } catch (e) {
                    closeConnection(ws);
                }
            } else {
                closeConnection(ws);
            }
        }, 1000);

    })();

});
