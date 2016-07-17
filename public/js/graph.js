var plotly = require('plotly.js'),
    config = require('../../config/server.json'),
    jsonPath = 'http://' + config.hostname + ':' + config.http_port + '/data.json'

init()

function init() {
    var element = document.getElementById('graph');
    if (typeof(element) != 'undefined' && element != null) {
        graph()
    }
}

function graph() {
    plotly.d3.json(jsonPath, function(json) {
        var temperature = {
            name: "Temperature",
            type: 'scatter',
            mode: 'lines',
            x: json.map(function(d) {
                return new Date(d.time)
            }),
            y: json.map(function(d) {
                return d.temperature.data
            })
        };

        var humidity = {
            name: "Humidity",
            type: 'scatter',
            mode: 'lines',
            x: json.map(function(d) {
                return new Date(d.time)
            }),
            y: json.map(function(d) {
                return d.humidity.data
            })
        };

        var light = {
            name: "Light",
            type: 'scatter',
            mode: 'lines',
            x: json.map(function(d) {
                return new Date(d.time)
            }),
            y: json.map(function(d) {
                return d.light.data
            })
        };

        plotly.plot(document.getElementById('graph'), [temperature, humidity, light]);
    })
}
