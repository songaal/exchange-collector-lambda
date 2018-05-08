var request = require("request");
var ccxt = require('ccxt');
var queue = require("./queue");
var exchangeOhlcv = require('./exchange/exchange-ohlcv')

var QUEUE_URL = process.env.QUEUE_URL;
QUEUE_URL = "https://sqs.ap-northeast-2.amazonaws.com/868448630378/test-price"
exports.handler = (event, context, callback) => {
    (async () => {
      let coin = event.coin;
      let base = event.base;
      let symbol = event.symbol;
      let exchange_id = event.exchange;
      let exchange = new ccxt[exchange_id] ()
      data = await exchange.fetchOHLCV (symbol, '1m')
      ohlcv = exchangeOhlcv.getLatestOhlcv(data)
      if (process.env.NODE_ENV == 'dev') {
          console.log(exchange_id, coin, base, symbol, ohlcv);
      }
      if (ohlcv) {
          queue.put(ohlcv.ohlcv, ohlcv.ts, symbol, coin, base, QUEUE_URL);
      }
    })()
}
