/**
 * Measure sensors value and send those data to server using CoAP protocol.
 */
var coap = require('coap'),
    five = require("johnny-five"),
    board = new five.Board(),
    sensorData = {},
    config = {
        host: 'localhost',
        port: 5683,
        temperaturePin: 'A0',
        humidityPin: 'A5',
        switch1Pin: 2
    };

var switch_1;

/**
 * Fire when arduino board is ready
 */
board.on("ready", function() {
    console.log('Board is ready.');
    observe();

    switch_1 = new five.Pin(config.switch1Pin);


    /**
     * Initiate sensors
     */
    var temperature = new five.Temperature({
        pin: config.temperaturePin,
        controller: "TMP36"
    });
    var humidity = new five.Sensor(config.humidityPin);

    /**
     * Update sensorData while changing sensor value
     */
    temperature.on("change", function() {
        sensorData.temperature = {
            data: this.celsius,
            unit: 'celsius'
        };
    });
    humidity.on("change", function(value) {
        sensorData.humidity = {
            data: ((value / 1023) * 100).toFixed(2),
            unit: '%'
        };
    });

    /**
     * Call send function in every x interval
     */
    setInterval(function() {
        sensorData.isotime = new Date().toISOString();
        send(sensorData);
    }, 1000);
});

/**
 * Post sensorData to server using CoAP protpcol
 */
function send(data) {
    query = {
        host: config.host,
        port: config.port,
        method: 'POST'
    };
    try {
        var req = coap.request(query);
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
    query = {
        host: config.host,
        port: config.port,
        observe: true,
        pathname: 'observe'
    };
    try {
        var req = coap.request(query);
        req.on('response', function(res) {
            //console.log('response code', res.code);
            //res.pipe(process.stdout);
            res.on('data', function(data){
                switch_1.high();
                json = JSON.parse(data.toString());
                console.log(json.hello);
            });

        });
        req.end();
    } catch (err) {
        console.log(err);
    }
}
