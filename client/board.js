var five = require("johnny-five"),
    emitter = require('../lib/emitter'),
    config = require('./config'),
    board = new five.Board(),
    sensorData = {};

/**
 * Fire when arduino board is ready
 */
board.on("ready", function() {
    console.log('Board_ready is ready.');
    initBoard();
    emitter.emit('board_ready');

    recordTemperature();
    recordHumidity();
    controllSwitch();

    /**
     * Call send function in every x interval
     */
    setInterval(function() {
        sensorData.isotime = new Date().toISOString();
        emitter.emit('sensor_data', sensorData);
    }, config.post_interval);
});

board.on("close", function(){
    console.log('Closwed')
})

function initBoard() {
    sensorData = {};
    temperature = new five.Temperature({
        pin: config.pin.temperature,
        controller: "TMP36"
    });
    humidity = new five.Sensor(config.pin.humidity);
    switch_1 = new five.Pin(config.pin.switch_1);
}

/**
 * Update sensorData while changing sensor value
 */
function recordTemperature() {
    temperature.on("change", function() {
        sensorData.temperature = {
            data: this.celsius,
            unit: 'celsius'
        };
    });
}

/**
 * Update sensorData while changing sensor value
 */
function recordHumidity() {
    humidity.on("change", function(value) {
        sensorData.humidity = {
            data: ((value / 1023) * 100).toFixed(2),
            unit: '%'
        };
    });
}


function controllSwitch() {
    emitter.on('observe_data', function(data) {
        switch_1.write(data.switch_1);
    });
}


function readSwitch(sw) {
    sw.read(function(err, data) {
        console.log('Switch_pin_' + pin + ': ' + data);
    });
}
