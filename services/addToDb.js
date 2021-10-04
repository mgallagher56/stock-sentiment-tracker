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

addStockPrice = (db, companyName, stockPrice, callback) => {
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

addTweetToDb = ( db, companyName, tweet, callback ) => {
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

module.exports.addStockPrice = addStockPrice;
module.exports.addTweetToDb  = addTweetToDb;
