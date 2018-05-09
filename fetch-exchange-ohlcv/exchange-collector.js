<<<<<<< HEAD:exchange-collector.js
let ccxt = require('ccxt');
let queue = require("./queue");
let QUEUE_URL = process.env.QUEUE_URL;
let maxSize = 3
exports.handler = (event, context, callback) => {
    let exchange_id = event.exchange;
    let exchange = new ccxt[exchange_id] ()
    if (exchange.has.fetchOHLCV == true) {
        (async () => {
          let coin = event.coin;
          let base = event.base;
          let symbol = event.symbol;
=======
var request = require("request");
var ccxt = require('ccxt');
var queue = require("./queue");
var exchangeOhlcv = require('./exchange-ohlcv')

var QUEUE_URL = process.env.QUEUE_URL;
>>>>>>> 48beb392b795708ca7e35de9cd63586464806014:fetch-exchange-ohlcv/exchange-collector.js

          data = await exchange.fetchOHLCV (symbol, '1m', undefined, maxSize)
          let o = data[data.length - 1]
          let ohlcv = {
              "o": o[1],
              "h": o[2],
              "l": o[3],
              "c": o[4],
              "v": o[5]
          }
          let ts = o[0]

          if (process.env.NODE_ENV == 'dev') {
              console.log(exchange_id, ts, symbol, coin, base, ohlcv);
          }
          if (process.env.DRY_RUN != 'true') {
              if (ohlcv) {
                  queue.put(ohlcv, ts, symbol, coin, base, QUEUE_URL);
              }
          }
        }) ()
    } else {
        console.log("[Error] Not support fetchOHLCV for " + exchange_id, 'exchange.has.fetchOHLCV=', exchange.has.fetchOHLCV);
    }
}
