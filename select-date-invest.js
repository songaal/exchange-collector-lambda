const ccxt = require('ccxt')
const queue = require("./queue")
// const QUEUE_URL = process.env.QUEUE_URL
const QUEUE_URL = 'https://sqs.ap-northeast-2.amazonaws.com/868448630378/coin-price'
process.env.DEV = 'true'
process.env.DRY_RUN = 'false'

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
            if (process.env.DEV == 'true') {
              console.log(dataList, exchange_id, coin, base)
            }
            if (process.env.DRY_RUN != 'true') {
                queue.bulk_put(dataList, exchange_id, coin, base, QUEUE_URL);
            }
            lastData = dataList[size - 1]
            // 마지막 시간을 리턴한다.
            if (callback !== undefined) {
              callback(null, lastData[0]);
            }
        }, function (err) {
          if (callback !== undefined) {
            callback(err, null);
          }
        })

    } else {
        console.log(exchange_id, 'exchange not support candle api.')
    }
}

// let coin = 'XRP'
// let base = 'BTC'
// let day = ['1525737600000', '1525780800000']
// for (let i=0; i < 2; i++) {
//   exports.handler({
//     coin: coin,
//     base: base,
//     symbol: `${coin}/${base}`,
//     exchange: 'binance',
//     since: day[i],
//     limit: '720'
//   })
// }
