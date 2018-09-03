let queue = require("./queue")
let axios = require('axios')

const QUEUE_URL = process.env.QUEUE_URL
const CANDLE_JSON_URL = process.env.CANDLE_JSON_URL
const CANDLE_COUNT = process.env.CANDLE_COUNT
// const CANDLE_COUNT = 2
// const CANDLE_JSON_URL = 'https://api.upbit.com/v1/candles/minutes/1?'
// https://api.upbit.com/v1/candles/minutes/1?count=2&market=

exports.handler = (event, context, callback) => {
  let coin = event.coin
  let base = event.base
  let symbol = event.symbol
  let exchange_id = event.exchange
  let url = `${CANDLE_JSON_URL}count=${CANDLE_COUNT}&market=${base}-${coin}`
  axios.get(url).then((response) => {
    for(let i = 0; i < response.data.length; i++) {
      // 이전 10개  CANDLE_COUNT = 10, for(var i = 0; i < 10; i++) {
      let time = new Date(response.data[i]['timestamp'])
      time.setMilliseconds(0)
      time.setSeconds(0)
      let data = []
      data.push(time.getTime())
      data.push(response.data[i]['opening_price'])
      data.push(response.data[i]['high_price'])
      data.push(response.data[i]['low_price'])
      data.push(response.data[i]['trade_price'])
      data.push(response.data[i]['candle_acc_trade_volume'])
      if (process.env.NODE_ENV == 'dev') {
        console.log(exchange_id, coin, base, i, data);
      }
      if (process.env.DRY_RUN != 'true') {
        if (data) {
          queue.put(data, exchange_id, coin, base, QUEUE_URL)
        }
      }
    }
  })
}
