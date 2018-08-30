let ccxt = require('ccxt')
let queue = require("./queue")
let axios = require('axios')
const QUEUE_URL = process.env.QUEUE_URL
const CANDLE_JSON_URL = process.env.CANDLE_JSON_URL
// 'https://www.bithumb.com/resources/chart/BTC_xcoinTrade_01M.json'
// resolutions: 1, 3, 5, 10, 30 ,60 ,360, 720, D, W, M
exports.handler = (event, context, callback) => {
    let coin = event.coin
    let base = event.base
    let symbol = event.symbol
    let exchange_id = event.exchange

    axios.get(CANDLE_JSON_URL).then((response) => {
      // 최신 2개
      insertData = response.data.splice(response.data.length - 2, 2)
      for (var i=0; i < insertData.length; i++) {
        lastData = insertData[i]
        // 빗썸은 t, o, c, h, l, v 순서.
        data = []
        data.push(lastData[0])
        data.push(lastData[1])
        data.push(lastData[3])
        data.push(lastData[4])
        data.push(lastData[2])
        data.push(lastData[5])
        queue.put(data, exchange_id, coin, base, QUEUE_URL)
      }
    })
}
