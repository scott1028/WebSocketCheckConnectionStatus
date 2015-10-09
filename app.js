'use strict';
// Implment a webSocket server with connection status checker.
// 由於網路不穩定的斷線不會發送 Close Connection 訊號，將造成 ping-pong 延遲，不會斷線，除非到達作業系統 Timout 上限，所以自行實作 Ping-Pong 檢查 Rule。
// ref: https://pusher.com/docs/pusher_protocol#ping-pong

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
        var latency = 1000;  // 預期 1 秒內 pong 就會回應
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
                    setTimeout(pingFunc, latency);
                } catch (e) {
                    closeConnection(ws);
                }
            } else {
                closeConnection(ws);
            }
        }, latency);

    })();

});


// Client Sample
/*
    var ws = new WebSocket('ws://127.0.0.1:8091');
    ws.onerror=function(e){
        console.log(e);
        ws.close();
    };
    
    ws.send('test!');
*/
