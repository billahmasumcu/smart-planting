var coap = require('coap'),
    coapServer = coap.createServer(),
    emitter = require('../lib/emitter');

init();

function init() {
    // Process incomming request
    coapServer.on('request', function(req, res) {
        return route(req, res);
    });

    // Listen CoAP server for port 5683 as default
    coapServer.listen(function() {
        console.log('CoAP server started!');
    });
}

function route(req, res) {
    pathname = req.url.split('/')[1];
    return (pathname == 'observe') ? serveObserve(req, res) : serveIndex(req, res);
}

function serveIndex(req, res) {
    res.setOption('Content-Format', 'application/json');
    sensorData = req.payload.toString();
    emitter.emit('sensor_data', sensorData);
    //console.log(req.payload.toString());
    res.end();
}

function serveObserve(req, res) {
    if (req.headers.Observe !== 0)
        return res.end('observe should be enabled on request\n');

    emitter.on('observe', function(data) {
        res.write(JSON.stringify(data));
    })

    res.on('finish', function(err) {
        //clearInterval(interval);
    });
}
