const DbService = require('../Services/DbService');
const WebSocket = require('ws');
const socket = new WebSocket('wss://ws.finnhub.io?token=bvbkd3f48v6s3s585260');
const addStockPriceToDb = require('../services/addStockPriceToDb');

// Connection opened -> Subscribe
let openSocket = (socket, stockName) => {
    socket.addEventListener('open', (event) => {
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': stockName}))
    });
}

let priceListener = (socket, companyName) => {
    // Listen for messages
    socket.addEventListener('message', (event) => {
        // console.log(event.data);
        let priceData = JSON.parse(event.data);

        DbService.connectToDB(((db) => {
            addStockPriceToDb.addStockPrice(db, companyName, priceData.data[0]['p'], (result) => {
            })
        }))
    });
}

module.exports.openSocket = openSocket;
module.exports.priceListener = priceListener;