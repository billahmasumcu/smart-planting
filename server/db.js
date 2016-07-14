var mongoClient = require('mongodb').MongoClient,
    emitter = require('../lib/emitter'),
    url = 'mongodb://localhost:27017/smart-planting';

mongoClient.connect(url, function(err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server.')
        return
    }
    console.log('MongoDB: Connected to', url);
    collection = db.collection('data');
    emitter.on('sensor_data', function(data) {
        data = JSON.parse(data)
        collection.insert(data, function(err, result) {})
    })
    emitter.on('end', function(data) {
        db.close()
    })
})

module.exports = {
    getCollection: function() {
        return collection
    }
}
