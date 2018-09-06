const queue = require("./queue")
const axios = require('axios')
const QUEUE_URL = process.env.QUEUE_URL
const CANDLE_JSON_URL = process.env.CANDLE_JSON_URL
// const CANDLE_JSON_URL = 'https://www.bithumb.com/resources/chart/{COIN}_xcoinTrade_01M.json'
// process.env.NODE_ENV = 'dev'
// process.env.DRY_RUN = 'true'

exports.handler = (event, context, callback) => {
  let coin = event.coin
  let base = event.base
  let symbol = event.symbol
  let exchange_id = event.exchange
  let jsonUrl = CANDLE_JSON_URL.replace('{COIN}', coin.toUpperCase())
  axios.get(jsonUrl).then((response) => {
    // 빗썸은 t, o, c, h, l, v 순서.
    for(var i = 1; i <= 2; i++) {
      let index = response.data.length - i
      let data = []
      data.push(response.data[index][0])
      data.push(response.data[index][1])
      data.push(response.data[index][3])
      data.push(response.data[index][4])
      data.push(response.data[index][2])
      data.push(response.data[index][5])
      if (process.env.NODE_ENV == 'dev') {
        console.log(exchange_id, coin, base, i, data);
      }
      if (process.env.DRY_RUN != 'true') {
        if (data) {
          queue.put(data, exchange_id, coin, base, QUEUE_URL);
        }
      }
    }
  })
}
