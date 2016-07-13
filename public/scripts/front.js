websocket = new WebSocket("ws://rpi:6455/");

var smoothie = new SmoothieChart();
var smoothie2 = new SmoothieChart();
/*var smoothie = new SmoothieChart({
    grid: {
        strokeStyle: 'rgb(125, 0, 0)',
        fillStyle: 'rgb(60, 0, 0)',
        lineWidth: 1,
        millisPerLine: 250,
        verticalSections: 6,
    },
    labels: {
        fillStyle: 'rgb(60, 0, 0)'
    }
});*/
//smoothie.streamTo(document.getElementById("mycanvas"));
smoothie.streamTo(document.getElementById("temperature"), 1000 /*delay*/ );
smoothie2.streamTo(document.getElementById("humidity"), 1000 /*delay*/ );

// Data
var line1 = new TimeSeries();
var line2 = new TimeSeries();

var line3 = new TimeSeries();
var line4 = new TimeSeries();

// Add a random value to each line every second
/*setInterval(function() {
    line1.append(new Date().getTime(), Math.random());
    line2.append(new Date().getTime(), Math.random());
}, 1000);*/

websocket.onmessage = function(evt) {
    var sensorData = JSON.parse(evt.data);
    document.getElementById("current-temperature").innerHTML = sensorData.temperature.data;
    document.getElementById("current-humidity").innerHTML = sensorData.humidity.data;
    //document.write(evt.data);
    line1.append(new Date().getTime(), sensorData.temperature.data);
    line2.append(new Date().getTime(), sensorData.humidity.data);
    line3.append(new Date().getTime(), 0);
    line4.append(new Date().getTime(), 100);
};

// Add to SmoothieChart
smoothie.addTimeSeries(line1);
smoothie.addTimeSeries(line3);
smoothie.addTimeSeries(line4);
//smoothie.addTimeSeries(line2);


smoothie2.addTimeSeries(line2);
smoothie2.addTimeSeries(line3);
smoothie2.addTimeSeries(line4);
/*smoothie.addTimeSeries(line1, {
    strokeStyle: 'rgb(0, 255, 0)',
    fillStyle: 'rgba(0, 255, 0, 0.4)',
    lineWidth: 3
});
smoothie.addTimeSeries(line2, {
    strokeStyle: 'rgb(255, 0, 255)',
    fillStyle: 'rgba(255, 0, 255, 0.3)',
    lineWidth: 3
});*/
