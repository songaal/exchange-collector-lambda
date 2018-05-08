var request = require("request");
var ccxt = require('ccxt');
var queue = require("./queue");
var QUEUE_URL = process.env.QUEUE_URL;

exports.handler = (event, context, callback) => {
    let coin = event.coin;
    let base = event.base;
    let symbol = event.symbol;
    let exchange_id = event.exchange;
    let exchange = new (ccxt)[exchange_id] ()

    data = await exchange.fetchOHLCV (symbol, '1m')
    if (process.env.NODE_ENV == 'dev') {
        console.log(exchange_id, coin, base, symbol, data);
    }
    if (data) {
        queue.put(data.ohlcv, data.ts, market, coin, base, QUEUE_URL);
    }
}
