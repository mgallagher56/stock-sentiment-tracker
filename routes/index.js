const bodyParser = require('body-parser');
const WebSocket = require('ws');
const socket = new WebSocket('wss://ws.finnhub.io?token=bvbkd3f48v6s3s585260');
const stockPriceService = require('../services/stockPriceService');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

stockPriceService.openSocket( socket, 'AAPL' );
stockPriceService.priceListener(socket, 'apple');

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