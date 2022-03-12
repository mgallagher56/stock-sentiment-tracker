require('dotenv').config();
const bodyParser        = require('body-parser');
const WebSocket         = require('ws');
const socket            = new WebSocket('wss://ws.finnhub.io?token=' + process.env.FINNHUB);
const stockPriceService = require('../services/stockPrice');
const twitterService    = require('../services/twitter');
const express           = require('express');
const app               = express();
const port              = process.env.PORT || 5000;
const dbService         = require('../services/dbService');
const addToDbInterval   = 1;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
stockPriceService.openSocket(socket, 'AAPL');

dbService.connectToDB( 'stocks', ((db) => {
    stockPriceService.priceListener(db, socket, 'Apple', addToDbInterval);
    twitterService.twitterStream(db, 'Apple', 'AAPL', addToDbInterval);
}));


app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});


app.listen(port, () => console.log(`Listening on port ${port}`));
