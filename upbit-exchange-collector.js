let ccxt = require('ccxt')
let queue = require("./queue")
let axios = require('axios')
const QUEUE_URL = process.env.QUEUE_URL
const CANDLE_JSON_URL = process.env.CANDLE_JSON_URL
// const CANDLE_JSON_URL = 'https://api.upbit.com/v1/candles/minutes/1?count=2&market='

exports.handler = (event, context, callback) => {
    let coin = event.coin
    let base = event.base
    let symbol = event.symbol
    let exchange_id = event.exchange
    console.log(`${CANDLE_JSON_URL}${base}-${coin}`)
    axios.get(`${CANDLE_JSON_URL}${base}-${coin}`).then((response) => {
      // 최신 2개
      candles = response.data
      for (var i=0; i < candles.length; i++) {
        candle = candles[i]
        data = []
        data.push(candle['timestamp'])
        data.push(candle['opening_price'])
        data.push(candle['high_price'])
        data.push(candle['low_price'])
        data.push(candle['trade_price'])
        data.push(candle['candle_acc_trade_volume'])
        queue.put(data, exchange_id, coin, base, QUEUE_URL)
      }
    })
}
