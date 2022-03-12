const MongoClient  = require('mongodb').MongoClient;
const calculations = require('../functions/helpers/calculations');
const url          = process.env.MONGO_URL;
const Client       = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

/**
 * Creates db connection. Throws error if connection fails.
 *
 * @param cb  callback function which takes the db connection param
 *
 * @return db connection
 *
 */
function connectToDB(dbName, cb) {
    Client.connect(function (err) {
        if (err)
            throw err;
        let db = Client.db(dbName);
        cb(db);
    })
}

/**
 * Adds an object to the company db collection
 *
 * @param db database connection
 *
 * @param companyName name of company db collection
 *
 * @param data dat object to insert to db
 *
 * @param callback function
 *
 */

const addToDb = ( db, companyName, data, callback ) => {
    console.log('db data',data);
    db.collection(companyName).insertOne(data, (err, result) => {
        if (err) {
            throw err;
        }
        callback(result);
    });
}

module.exports.connectToDB = connectToDB;
module.exports.addToDb  = addToDb;
