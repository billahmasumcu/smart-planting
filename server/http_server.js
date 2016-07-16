var express = require('express'),
    emitter = require('../lib/emitter'),
    db = require('./db'),
    app = express(),
    path = require('path');

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/', function(req, res) {
    res.render('index')
})

app.get('/graph', function(req, res) {
    res.render('graph')
        //res.sendFile(__dirname + '/html/graph.html')
})

app.get('/data.json', function(req, res) {
    db.getCollection().find({}).toArray(function(err, data) {
        res.send(data)
    });
})

app.listen(3000, function() {
    console.log('Web app listening on port 3000!')
})
