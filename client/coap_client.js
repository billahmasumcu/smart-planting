var coap = require('coap'),
    config = require('../config/client'),
    emitter = require('../lib/emitter');

emitter.on('board_ready', function() {
    observe();
});

emitter.on('sensor_data', function(data) {
    send(data);
});

function send(data) {
    connection = {
        host: config.host,
        port: config.port,
        method: 'POST'
    };
    try {
        var req = coap.request(connection);
        req.setOption('Content-Format', 'application/json');
        req.write(JSON.stringify(data));
        req.on('response', function(res) {
            emitter.emit('status_switch', 'send');
            //console.log('response code', res.code);
        });
        req.end();
    } catch (err) {
        console.log(err);
    }
}


function observe() {
    connection = {
        host: config.host,
        port: config.port,
        observe: true,
        pathname: 'observe'
    };
    try {
        var req = coap.request(connection);
        req.on('response', function(res) {
            res.on('data', function(data) {
                observeData = JSON.parse(data.toString());
                emitter.emit('observe_data', observeData);
            });

        });
        req.end();
    } catch (err) {
        console.log(err);
    }
}
