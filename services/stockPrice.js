const dbService = require('./dbService');
const calculations = require('../functions/helpers/calculations');

// Connection opened -> Subscribe
let openSocket = (socket, stockName) => {
    socket.on('error', (error) => {
        console.log(error);
    })

    socket.addEventListener('open', (event) => {
        socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': stockName }))
    });
}

// use socket to wait for stock prices and add average to db at set interval
let priceListener = (db, socket, companyName, addToDbIntervalMins) => {
    let stockPriceArray = [];
    const interval = 1000 * 60 * addToDbIntervalMins;

    // Listen for messages
    socket.addEventListener('message', (message) => {
        // console.log(message.data);
        if ('undefined' !== typeof message.data && message.data) {
            let priceData = JSON.parse(message.data);

            if ('undefined' !== typeof priceData.data && priceData.data) {

                priceData.data.forEach(trade => {
                    // add each trade price to array
                    stockPriceArray.push(trade[ 'p' ]);
                });
            }
        }
    });

    //add average stock price to db at interval
    setInterval(() => {
        const stockProceAverage = calculations.getAverageFromArray(stockPriceArray)
        const dateTime          = calculations.getNearestTime(interval);

        let priceData = {
            dateTime  : dateTime,
            stockPrice: stockProceAverage
        };
        console.log(stockProceAverage);

        stockPriceArray = [];
        dbService.addToDb(db, companyName.toLowerCase(), priceData, (result) => { })
    }, interval);
}

module.exports.openSocket = openSocket;
module.exports.priceListener = priceListener;
