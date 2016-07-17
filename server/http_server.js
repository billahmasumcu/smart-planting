var express = require('express'),
    emitter = require('../lib/emitter'),
    db = require('./db'),
    app = express(),
    moment = require('moment'),
    path = require('path');

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/', function(req, res) {
    res.render('graph')
})

app.get('/graph/:day', function(req, res) {
    res.render('graph', {
        day: req.params.day
    })
})

app.get('/live', function(req, res) {
    res.render('live')
})

app.get('/data.json', function(req, res) {
    db.getCollection().find({}).toArray(function(err, data) {
        res.send(data)
    });
})

app.get('/data.json/:day', function(req, res) {
    var timrstamp = moment().subtract(parseInt(req.params.day), 'day').toDate().getTime()
    db.getCollection().find({
        time: {
            $gte: timrstamp
        }
    }).toArray(function(err, data) {
        res.send(data)
    });
})

app.listen(3000, function() {
    console.log('HTTP server: started at port 3000')
})
