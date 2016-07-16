var smoothie = require("smoothie"),
    config = require('../../config/server.json'),
    clientConfig = require('../../config/client.json'),
    wsPath = 'ws://' + config.hostname + ':' + config.ws_port + '/'

init()

function init() {
    var element = document.getElementById('monitor');
    if (typeof(element) != 'undefined' && element != null) {
        chart()
        var websocket = new WebSocket(wsPath)
        websocket.onmessage = function(evt) {
            onMessage(evt)
        }
    }
}

function chart() {
    var temperature = new smoothie.SmoothieChart()
    var humidity = new smoothie.SmoothieChart()
    var light = new smoothie.SmoothieChart()
    var postInterval = clientConfig.post_interval * 1000

    temperature.streamTo(document.getElementById("temperature"), postInterval)
    humidity.streamTo(document.getElementById("humidity"), postInterval)
    light.streamTo(document.getElementById("light"), postInterval)

    lineTemperature = new smoothie.TimeSeries()
    lineHumidity = new smoothie.TimeSeries()
    lineLight = new smoothie.TimeSeries()
    lineZero = new smoothie.TimeSeries()
    lineHundred = new smoothie.TimeSeries()

    temperature.addTimeSeries(lineTemperature)
    temperature.addTimeSeries(lineZero)
    temperature.addTimeSeries(lineHundred)
    humidity.addTimeSeries(lineHumidity)
    humidity.addTimeSeries(lineZero)
    humidity.addTimeSeries(lineHundred)
    light.addTimeSeries(lineLight)
    light.addTimeSeries(lineZero)
    light.addTimeSeries(lineHundred)
}

onMessage = function(evt) {
    var sensorData = JSON.parse(evt.data);
    document.getElementById("current-temperature").innerHTML = sensorData.temperature.data
    document.getElementById("current-humidity").innerHTML = sensorData.humidity.data
    document.getElementById("current-light").innerHTML = sensorData.light.data
    lineTemperature.append(new Date().getTime(), sensorData.temperature.data)
    lineHumidity.append(new Date().getTime(), sensorData.humidity.data)
    lineLight.append(new Date().getTime(), sensorData.light.data)
    lineZero.append(new Date().getTime(), 0)
    lineHundred.append(new Date().getTime(), 100)
};
