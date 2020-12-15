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
        time : Date.now() * 1000,
        price : stockPrice
    };

    db.collection(companyName).insertOne(currentStockPrice, (err, result) => {
        if (err) {
            throw err;
        }
        callback(result);
    });
};

module.exports.addStockPrice = addStockPrice;