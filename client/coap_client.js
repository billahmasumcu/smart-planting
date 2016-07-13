var coap = require('coap'),
    config = require('./config'),
    emitter = require('../lib/emitter');

emitter.on('board_ready', function(){
    observe();
});

emitter.on('sensor_data', function(data){
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
            //console.log('response code', res.code);
            //res.pipe(process.stdout);
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
            //console.log('response code', res.code);
            //res.pipe(process.stdout);
            res.on('data', function(data) {
                observeData = JSON.parse(data.toString());
                console.log(observeData);
                emitter.emit('observe_data', observeData);
            });

        });
        req.end();
    } catch (err) {
        console.log(err);
    }
}
