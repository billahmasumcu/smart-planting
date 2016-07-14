var express = require('express'),
    emitter = require('../lib/emitter'),
    db = require('./db'),
    app = express();

/**
 * Configuring web app
 */
app.use(express.static('../public'))

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.get('/data', function(req, res) {
    db.getCollection().find({}).toArray(function(err, data) {
        res.send(data)
    });
})

app.listen(3000, function() {
    console.log('Web app listening on port 3000!')
})
