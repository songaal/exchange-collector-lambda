let queue = require("./queue")
const axios = require('axios')
const QUEUE_URL = process.env.QUEUE_URL
const END_URL = process.env.END_URL
// const END_URL = `https://api.huobi.pro/market/history/kline?period=1min&size=3`

exports.handler = (event, context, callback) => {
  let coin = event.coin
  let base = event.base
  let symbol = event.symbol
  let exchange_id = event.exchange
  let url = `${END_URL}&symbol=${coin.toLowerCase()}${base.toLowerCase()}`
  axios.get(url).then((response) => {
    let dataList = response.data.data
    dataList.forEach((candle, index) => {
      if (index === 0) {
        return true
      }
      let data = []
      data.push(candle['id'])
      data.push(candle['open'])
      data.push(candle['high'])
      data.push(candle['low'])
      data.push(candle['close'])
      data.push(candle['vol'])
      if (process.env.NODE_ENV == 'dev') {
        console.log(exchange_id, coin, base, data);
      }
      if (process.env.DRY_RUN != 'true') {
        if (data) {
          queue.put(data, exchange_id, coin, base, QUEUE_URL)
        }
      }
    })
  })
}
