let ccxt = require('ccxt')
let queue = require("./queue")
let axios = require('axios')
const QUEUE_URL = process.env.QUEUE_URL
const CANDLE_JSON_URL = process.env.CANDLE_JSON_URL

exports.handler = (event, context, callback) => {
    let coin = event.coin
    let base = event.base
    let symbol = event.symbol
    let exchange_id = event.exchange
    axios.get(`${CANDLE_JSON_URL}${base}-${coin}`).then((response) => {
      candles = response.data
      // 3개 조회 후 앞 2개만 업데이트
      for (var i = 0; i < candles.length - 1; i++) {
        candle = candles[i]
        data = []
        let time = new Date(candle['timestamp'])
        time.setMilliseconds(0)
        time.setSeconds(0)
        data.push(time.getTime())
        data.push(candle['opening_price'])
        data.push(candle['high_price'])
        data.push(candle['low_price'])
        data.push(candle['trade_price'])
        data.push(candle['candle_acc_trade_volume'])
        // console.log(data)
        queue.put(data, exchange_id, coin, base, QUEUE_URL)
      }
    })
}
