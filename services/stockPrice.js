const dbService = require('./dbService');

// Connection opened -> Subscribe
let openSocket = (socket, stockName) => {
    socket.on('error', (error) => {
        console.log(error);
      })

    socket.addEventListener('open', (event) => {
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': stockName}))
    });
}

let priceListener = (db, socket, companyName) => {
        // Listen for messages
        socket.addEventListener('message', (message) => {
            // console.log(message.data);
        if('undefined' !== typeof message.data && message.data) {
            let priceData = JSON.parse(message.data);
                if('undefined' !== typeof priceData.data && priceData.data) {
                    priceData.data.forEach(trade => {
                        dbService.addStockPrice(db, companyName, trade['p'], (result) => {})
                    });
                }
            }
        });
}

module.exports.openSocket = openSocket;
module.exports.priceListener = priceListener;
