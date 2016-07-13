var emitter = require('./emitter'),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        port: 6455
    });

/**
 * Send data by WebSocket
 */
wss.on('connection', function(ws) {
    emitter.on('sensor_data', function(sensorData) {
        console.log(sensorData);
        ws.send(sensorData, function() {});
    });
    ws.on('message', function(msg) {
        data = JSON.parse(msg);
    });
});
