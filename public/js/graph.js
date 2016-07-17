var plotly = require('plotly.js'),
    config = require('../../config/server.json');

init()

function init() {
    var element = document.getElementById('graph');
    if (typeof(element) != 'undefined' && element != null) {
        graph(getPath())
    }
}

function getPath() {
    var jsonPath = 'http://' + config.hostname + ':' + config.http_port + '/data.json'
    var element = document.getElementById('days');
    if (typeof(element) != 'undefined' && element != null) {
        jsonPath += '/' + element.innerHTML
    }
    return jsonPath
}

function graph(jsonPath) {
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
