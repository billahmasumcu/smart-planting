var express = require('express'),
    app = express();

/**
 * Configuring web app
 */
app.use(express.static('../public'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.listen(3000, function() {
    console.log('Web app listening on port 3000!');
});
