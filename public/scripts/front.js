websocket = new WebSocket("ws://rpi:6455/");

var temperature = new SmoothieChart();
var humidity = new SmoothieChart();
var light = new SmoothieChart();

temperature.streamTo(document.getElementById("temperature"), 1000 /*delay*/ );
humidity.streamTo(document.getElementById("humidity"), 1000 /*delay*/ );
light.streamTo(document.getElementById("light"), 1000 /*delay*/ );

var lineTemperature = new TimeSeries();
var lineHumidity = new TimeSeries();
var lineLight = new TimeSeries();
var lineZero = new TimeSeries();
var lineHundred = new TimeSeries();

websocket.onmessage = function(evt) {
    var sensorData = JSON.parse(evt.data);
    document.getElementById("current-temperature").innerHTML = sensorData.temperature.data;
    document.getElementById("current-humidity").innerHTML = sensorData.humidity.data;
    document.getElementById("current-light").innerHTML = sensorData.light.data;
    lineTemperature.append(new Date().getTime(), sensorData.temperature.data);
    lineHumidity.append(new Date().getTime(), sensorData.humidity.data);
    lineLight.append(new Date().getTime(), sensorData.light.data);
    lineZero.append(new Date().getTime(), 0);
    lineHundred.append(new Date().getTime(), 100);
};

temperature.addTimeSeries(lineTemperature);
temperature.addTimeSeries(lineZero);
temperature.addTimeSeries(lineHundred);
humidity.addTimeSeries(lineHumidity);
humidity.addTimeSeries(lineZero);
humidity.addTimeSeries(lineHundred);
light.addTimeSeries(lineLight);
light.addTimeSeries(lineZero);
light.addTimeSeries(lineHundred);
