const MongoClient = require('mongodb').MongoClient;
const calculateTweetScore = require('../functions/helpers/calculateTweetScore');
const url = process.env.MONGO_URL;
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

/**
 * Adds a stock price and time to the db collection 'stocks'
 *
 * @param db database connection
 *
 * @param newUser object container new user data
 *
 * @param callback function
 *
 */

 const addStockPrice = (db, companyName, stockPrice, callback) => {
    let currentStockPrice = {
        time  : Date.now() * 1000,
        price : stockPrice
    };

    db.collection(companyName + 'StockPrice').insertOne(currentStockPrice, (err, result) => {
        if (err) {
            throw err;
        }
        callback(result);
    });
};

const addTweetToDb = ( db, companyName, tweet, watsonAnalysis, callback ) => {
    const score = calculateTweetScore.calculateTweetScore(tweet, watsonAnalysis);
    let tweetData = {
        time        : Date.now() * 1000,
        tweetContent: tweet.data.text,
        tweetData   : tweet
    };

    db.collection(companyName + 'Tweets').insertOne(tweetData, (err, result) => {
        if (err) {
            throw err;
        }
        callback(result);
    });
}

module.exports.connectToDB = connectToDB;
module.exports.addStockPrice = addStockPrice;
module.exports.addTweetToDb  = addTweetToDb;
