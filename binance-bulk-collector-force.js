/*
바이낸스 API의 데이터를 입력 시킴.
// https://api.binance.com/api/v1/klines?symbol=BTCUSDT&interval=1m&startTime=0&limit=
*/
const AWS = require('aws-sdk')
const lambda = new AWS.Lambda({region: 'ap-northeast-2'})
const axios = require('axios')
const queue = require("./queue")
const QUEUE_URL = process.env.QUEUE_URL
// const QUEUE_URL = 'https://sqs.ap-northeast-2.amazonaws.com/868448630378/coin-price'

exports.handler = (event, context, callback) => {
    const exchange = event.exchange
    const coin = event.coin
    const base = event.base
    const symbol = event.symbol.replace('/', '').toUpperCase()
    const since = event.since
    const limit = event.limit
    console.log(exchange, symbol, since, limit)
    let url = `https://api.binance.com/api/v1/klines?symbol=${symbol}&interval=1m&startTime=${since}&limit=${limit}`
    console.log('url', url)
    axios.get(url).then((response) => {
      let dataList = []
      response.data.forEach(o => {
        let tmpData = []
        tmpData.push(o[0])
        tmpData.push(o[1])
        tmpData.push(o[2])
        tmpData.push(o[3])
        tmpData.push(o[4])
        tmpData.push(o[5])
        dataList.push(tmpData)
        console.log('update data: ', tmpData)
      })
      if (process.env.DRY_RUN != 'true') {
          queue.bulk_put(dataList, exchange, coin, base, QUEUE_URL)
      }
    })
}
