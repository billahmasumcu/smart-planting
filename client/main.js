require('./board');
require('./coap_client');

var emitter = require('../lib/emitter')

var endHandler = function() {
    console.log('__End__')
    emitter.emit('end')
    process.exit()
}

//process.on('SIGINT', endHandler)
//process.on('uncaughtException', endHandler)
