var events = require('events'),
    eventEmitter = new events.EventEmitter();

module.exports = {
    emit: function(name, data) {
        eventEmitter.emit(name, data);
    },
    on: function(name, callback) {
        eventEmitter.on(name, callback);
    }
};
