const ccxt = require('ccxt')
const queue = require("./queue")
const QUEUE_URL = process.env.QUEUE_URL

exports.handler = (event, context, callback) => {
    const exchange_id = event.exchange;
    const coin = event.coin
    const base = event.base
    const symbol = event.symbol
    const since = event.since;
    const limit = event.limit;

    const exchange = new ccxt[exchange_id]()

    if (exchange.has.fetchOHLCV == true) {
        let promise = exchange.fetchOHLCV(symbol, '1m', since, limit)
        promise.then(function(dataList){
            let size = dataList.length
            if (process.env.DRY_RUN != 'true') {
                queue.bulk_put(dataList, exchange_id, coin, base, QUEUE_URL);
            }
            lastData = dataList[size - 1]
            // 마지막 시간을 리턴한다.
            return lastData[0]
        }, function (err) {
            console.log(err);
        })

    } else {
        console.log(exchange_id, 'exchange not support candle api.')
    }
}
