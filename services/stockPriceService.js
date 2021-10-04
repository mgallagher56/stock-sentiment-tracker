const DbService = require('../Services/DbService');
const WebSocketServer = require('ws');
const socket = new WebSocketServer('wss://ws.finnhub.io?token=c5djt1iad3ifm1hm21v0');
const addStockPriceToDb = require('../services/addStockPriceToDb');

// Connection opened -> Subscribe
let openSocket = (socket, stockName) => {
    socket.on('error', (error) => {
        console.log(error);
      })

    socket.addEventListener('open', (event) => {
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': stockName}))
    });
}

let priceListener = (socket, companyName) => {
    DbService.connectToDB(((db) => {
        // Listen for messages
        socket.addEventListener('message', (message) => {
            // console.log(message.data);
        if('undefined' !== typeof message.data && message.data) {
            let priceData = JSON.parse(message.data);
                if('undefined' !== typeof priceData.data && priceData.data) {
                    addStockPriceToDb.addStockPrice(db, companyName, priceData.data[0]['p'], (result) => {
                    })
                }
            }
        });
    }))
}

module.exports.openSocket = openSocket;
module.exports.priceListener = priceListener;
