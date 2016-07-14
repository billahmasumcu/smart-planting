require('./coap_server');
require('./http_server');
require('./ws_server');
require('./control');
require('./db');

var emitter = require('../lib/emitter')

var endHandler = function() {
    console.log('__End__')
    emitter.emit('end')
    process.exit()
}

process.on('SIGINT', endHandler)
process.on('uncaughtException', endHandler)
