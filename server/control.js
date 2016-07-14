var config = require('./config'),
    emitter = require('../lib/emitter');

/*dummyValue = 32
setInterval(function() {
    if (dummyValue >= 25)
        dummyValue--;

    emitter.emit('sensor_data', JSON.stringify({
        light: {
            data: dummyValue
        }
    }))
}, 1000)*/

startTime = []
emitter.on('sensor_data', function(sensorData) {
    //console.log(sensorData)
    data = JSON.parse(sensorData)
    for (var i = 0; i < config.rules.length; i++) {
        rule = config.rules[i]
        if ('smaller' == rule.target)
            condition = "data[rule.sensor]['data'] < rule.value"
        else if ('greater' == rule.target)
            condition = "data[rule.sensor]['data'] > rule.value"
        else if ('equal' == rule.target)
            condition = "data[rule.sensor]['data'] == rule.value"

        if (eval(condition)) {
            if (typeof startTime[i] === 'undefined')
                startTime[i] = new Date().getTime();
            _trigger(i)
        } else {
            delete startTime[i]
        }
    }
})


function _trigger(i) {
    var elapsedTime = new Date().getTime() - startTime[i]
        //console.log(elapsedTime)
    if (elapsedTime >= rule.elapsed) {
        console.log(rule.value)
        result = {}
        result[rule.actuator] = rule.action
        emitter.emit('observe', result)
        delete startTime[i]
    }
}
