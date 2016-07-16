var config = require('../config/server'),
    emitter = require('../lib/emitter');

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
    if (elapsedTime >= rule.elapsed * 1000) {
        result = {}
        result[rule.actuator] = rule.action
        emitter.emit('observe', result)
            //console.log(result)
        delete startTime[i]
    }
}
