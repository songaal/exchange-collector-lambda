let ccxt = require('ccxt');
let queue = require("./queue");
const QUEUE_URL = process.env.QUEUE_URL;
const maxSize = 3
exports.handler = (event, context, callback) => {
    let exchange_id = event.exchange;
    let exchange = new ccxt[exchange_id] ()
    if (exchange.has.fetchOHLCV == true) {
        (async () => {
          let coin = event.coin;
          let base = event.base;
          let symbol = event.symbol;

          dataList = await exchange.fetchOHLCV (symbol, '1m', undefined, maxSize)
          let data = dataList[dataList.length - 1]

          if (process.env.NODE_ENV == 'dev') {
              console.log(exchange_id, ts, symbol, coin, base, ohlcv);
          }
          if (process.env.DRY_RUN != 'true') {
              if (ohlcv) {
                  queue.put(data, symbol, coin, base, QUEUE_URL);
              }
          }
        }) ()
    } else {
        console.log("[Error] Not support fetchOHLCV for ", exchange_id, 'exchange.has.fetchOHLCV=', exchange.has.fetchOHLCV);
    }
}
