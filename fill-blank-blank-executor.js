const ccxt = require('ccxt')
const axios = require('axios')

const exchange_id = 'binance'
const startTime = ''
const endTime = ''
const interval = ''

let coin = 'ETH'
let base = 'BTC'
const exchange = new ccxt[exchange_id]()
let promise = exchange.load_markets()
promise.then(function (markets) {
  Object.keys(markets).forEach((symbol) => {
    let coin = markets[symbol].quote
    let base = markets[symbol].base
  })
})

// if (exchange.has.fetchOHLCV == true) {
//     let promise = exchange.fetchOHLCV(symbol, '1m', since, limit)
//     promise.then(function(dataList){
//         let size = dataList.length
//         if (process.env.DRY_RUN != 'true') {
//             queue.bulk_put(dataList, exchange_id, coin, base, QUEUE_URL);
//         }
//         lastData = dataList[size - 1]
//         // 마지막 시간을 리턴한다.
//         callback(null, lastData[0]);
//     }, function (err) {
//         callback(err, null);
//     })
//
// } else {
//     console.log(exchange_id, 'exchange not support candle api.')
// }
