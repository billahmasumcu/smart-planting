var five = require("johnny-five"),
    emitter = require('../lib/emitter'),
    config = require('../config/client'),
    board = new five.Board(),
    sensorData = {};

/**
 * Fire when arduino board is ready
 */
board.on("ready", function() {
    console.log('Board_ready is ready.')
    initBoard()
    emitter.emit('board_ready')

    recordTemperature()
    recordHumidity()
    recordLight()
    controllSwitch()
    statusSwitch()

    /**
     * Call send function in every x interval
     */
    setInterval(function() {
        sensorData.time = new Date().getTime() //new Date().toISOString()
        emitter.emit('sensor_data', sensorData)
    }, config.post_interval * 1000)
});

function initBoard() {
    sensorData = {}
    temperature = new five.Temperature({
        pin: config.pin.temperature,
        controller: "TMP36"
    });
    humidity = new five.Sensor(config.pin.humidity)
    light = new five.Light(config.pin.light);
    switch_1 = new five.Pin(config.pin.switch_1)
    switch_2 = new five.Pin(config.pin.switch_2)
    switch_3 = new five.Pin(config.pin.switch_3)
    switchStatus = new five.Pin(config.pin.switch_status)
    cleanup()
}

emitter.on('end', function() {
    cleanup()
})

function cleanup() {
    switch_1.write(false)
    switch_2.write(false)
    switch_3.write(false)
}

/**
 * Update sensorData while changing sensor value
 */
function recordTemperature() {
    temperature.on("change", function() {
        sensorData.temperature = {
            data: this.celsius.toFixed(2),
            unit: 'celsius'
        }
    })
}

/**
 * Update sensorData while changing sensor value
 */
function recordHumidity() {
    humidity.on("change", function(value) {
        sensorData.humidity = {
            data: ((value / 1023) * 100).toFixed(2),
            unit: '%'
        }
    })
}

function recordLight() {
    light.on("change", function(value) {
        sensorData.light = {
            data: (this.level * 100).toFixed(2),
            unit: '%'
        }
    })
}

function controllSwitch() {
    emitter.on('observe_data', function(data) {
        blinkOnce()
        blinkOnce()
        console.log(data)
        if (typeof data.switch_1 !== 'undefined')
            switch_1.write(data.switch_1);
        if (typeof data.switch_2 !== 'undefined')
            switch_2.write(data.switch_2);
        if (typeof data.switch_3 !== 'undefined')
            switch_3.write(data.switch_3);
    })
}

function statusSwitch() {
    emitter.on('status_switch', function(type) {
        if ('send' == type) {
            blinkOnce()
        }
    })
}

function blinkOnce() {
    switchStatus.high()
    setTimeout(function() {
        switchStatus.low()
    }, 100)
}

function readSwitch(sw) {
    sw.read(function(err, data) {
        console.log('Switch_pin_' + pin + ': ' + data)
    });
}
