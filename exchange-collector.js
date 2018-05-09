let ccxt = require('ccxt');
let queue = require("./queue");
const QUEUE_URL = process.env.QUEUE_URL;
const maxSize = 3
exports.handler = (event, context, callback) => {
    let coin = event.coin
    let base = event.base
    let symbol = event.symbol
    let exchange_id = event.exchange;
    let exchange = new ccxt[exchange_id]()
    if (exchange.has.fetchOHLCV == true) {
        let dataList;
        (async () => {
            dataList = await exchange.fetchOHLCV(symbol, '1m', undefined, maxSize)
        })()

        let data = dataList[dataList.length - 1]

        if (process.env.NODE_ENV == 'dev') {
            console.log(exchange_id, symbol, coin, base, data);
        }
        if (process.env.DRY_RUN != 'true') {
            if (data) {
                queue.put(data, symbol, coin, base, QUEUE_URL);
            }
        }

    } else {
        console.log(exchange_id, 'exchange not support candle api.')
    }
}
