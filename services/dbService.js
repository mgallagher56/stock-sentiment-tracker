const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbname = 'stocks';
const Client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

/**
 * Creates db connection. Throws error if connection fails.
 *
 * @param cb  callback function which takes the db connection param
 *
 * @return db connection
 *
 */
function connectToDB(cb) {
    Client.connect(function (err) {
        if (err)
            throw err;
        let db = Client.db(dbname);
        cb(db);
    })
}

module.exports.connectToDB = connectToDB;