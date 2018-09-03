let ccxt = require('ccxt');
let queue = require("./queue");
const QUEUE_URL = process.env.QUEUE_URL;
const limit = 3

exports.handler = (event, context, callback) => {
    let coin = event.coin
    let base = event.base
    let symbol = event.symbol
    let exchange_id = event.exchange;
    let exchange = new ccxt[exchange_id]()
    if (exchange.has.fetchOHLCV == true) {
        let promise = exchange.fetchOHLCV(symbol, '1m', undefined, limit)
        promise.then(function(dataList){
            for(var i = 1; i <= 2; i++) {
                let data = dataList[dataList.length - i]

                if (process.env.NODE_ENV == 'dev') {
                    console.log(exchange_id, coin, base, i, data);
                }
                if (process.env.DRY_RUN != 'true') {
                    if (data) {
                        queue.put(data, exchange_id, coin, base, QUEUE_URL);
                    }
                }
            }
        }, function (err) {
            console.log(err);
        })

    } else {
        console.log(exchange_id, 'exchange not support candle api.')
    }
}
